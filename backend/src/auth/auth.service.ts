import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User, Session } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // For generating refresh tokens
import { PrismaService } from 'src/prisma.service';
import { AuthTokensDto, SignInResponseDto } from './dto/auth-token.dto';
import { JwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<Omit<User, 'password' | 'sessions'>> {
    const { email, password, firstName, lastName, role } = signUpDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: role || 'USER', // Default to USER if not provided
          isVerified: true, // Or true, depending on your verification flow
        },
        include: {
          sessions: true, // Include sessions if needed
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, sessions, ...result } = user;
      return result;
    } catch (error) {
      // Handle potential Prisma errors, e.g., unique constraint violation if not caught above
      throw new InternalServerErrorException('Could not create user.');
    }
  }

  async signIn(
    signInDto: SignInDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { sessions: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your email address.');
    }

    const tokens = await this.generateAndSaveTokens(user, userAgent, ipAddress);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, sessions, ...userResult } = user;
    return { ...tokens, user: userResult };
  }

  async signOut(userId: string, refreshToken: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session || session.userId !== userId || !session.isValid) {
      throw new UnauthorizedException('Invalid session or refresh token.');
    }

    await this.prisma.session.update({
      where: { refreshToken: refreshToken },
      data: { isValid: false },
    });
  }

  async refreshToken(
    userId: string,
    currentRefreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokensDto> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: currentRefreshToken },
      include: { user: true },
    });

    if (!session || !session.isValid || session.userId !== userId) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (session.expiresAt < new Date()) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isValid: false },
      });
      throw new UnauthorizedException('Refresh token expired.');
    }

    // Invalidate the old refresh token (session)
    await this.prisma.session.update({
      where: { id: session.id },
      data: { isValid: false },
    });

    // Generate new tokens and a new session
    return this.generateAndSaveTokens(session.user, userAgent, ipAddress);
  }

  async validateOpaqueRefreshToken(token: string): Promise<{
    user: Omit<User, 'password' | 'sessions'>;
    session: Session;
    refreshToken: string;
  }> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: token }, // Busca el UUID en la base de datos
      include: { user: true }, // Incluye el usuario asociado a la sesión
    });

    // Es crucial verificar que session y session.user existan
    if (!session || !session.isValid || !session.user) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token (session not found, invalid, or no user associated).',
      );
    }

    if (session.expiresAt < new Date()) {
      // Invalida la sesión si ha expirado en la BD
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isValid: false },
      });
      throw new UnauthorizedException(
        'Refresh token expired (session outdated).',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = session.user;

    // Devuelve los datos validados para que el guard los pueda adjuntar a la request
    // Esto incluye el usuario, la sesión y el propio token de refresco (UUID)
    return { user: userResult, session, refreshToken: token };
  }

  private async generateAndSaveTokens(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokensDto> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, newRefreshTokenString] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      }),
      this.generateRefreshTokenString(), // Use a more robust method for refresh tokens
    ]);

    const refreshTokenExpiresIn =
      this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION_TIME_NUMERIC_SECONDS',
      ) ?? '604800'; // Default 7 days in seconds
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + parseInt(refreshTokenExpiresIn, 10),
    );

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: newRefreshTokenString,
        userAgent: userAgent,
        ipAddress: ipAddress,
        expiresAt: expiresAt,
        isValid: true,
      },
    });

    return { accessToken, refreshToken: newRefreshTokenString };
  }

  private async generateRefreshTokenString(): Promise<string> {
    // Generate a cryptographically strong random string for the refresh token
    return uuidv4();
  }

  async validateUserById(
    userId: string,
  ): Promise<Omit<User, 'password' | 'sessions'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, sessions, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId, isValid: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async invalidateSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found or access denied.');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isValid: false },
    });
  }

  async invalidateAllUserSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<void> {
    const whereClause: {
      userId: string;
      isValid: boolean;
      id?: { not: string };
    } = {
      userId,
      isValid: true,
    };
    if (currentSessionId) {
      whereClause.id = { not: currentSessionId };
    }
    await this.prisma.session.updateMany({
      where: whereClause,
      data: { isValid: false },
    });
  }
}
