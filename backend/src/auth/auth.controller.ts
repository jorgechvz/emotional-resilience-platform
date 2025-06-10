import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
  Ip,
  Headers,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Role, Session, User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { UserEntity } from './entity/users.entity';
import { GetUser } from './decorators/get-user.decorator';
import { ConfigService } from '@nestjs/config';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const COOKIE_DOMAIN = process.env.CORS_ORIGIN || 'http://localhost:5173'; // Default to localhost if not set

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const accessTokenMaxAge =
      this.configService.get<number>(
        'JWT_EXPIRATION_TIME_NUMERIC_SECONDS',
        1440 * 60,
      ) * 1000; // Default 24 hours in ms
    const refreshTokenMaxAge =
      this.configService.get<number>(
        'JWT_REFRESH_EXPIRATION_TIME_NUMERIC_SECONDS',
        7 * 24 * 60 * 60,
      ) * 1000; // Default 7 days in ms

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/auth/refresh',
    });
  }

  private clearTokenCookies(res: Response) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      expires: new Date(0), 
      path: '/',
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      expires: new Date(0), 
      path: '/auth/refresh',
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    });
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: UserEntity,
  })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.authService.signUp(signUpDto);
    return user;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in. Tokens set in HttpOnly cookies.',
    type: UserEntity, 
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 403, description: 'Email not verified.' })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ): Promise<{ user: Omit<PrismaUser, 'password' | 'sessions'> }> {
    const signInData = await this.authService.signIn(
      signInDto,
      userAgent,
      ipAddress,
    );
    this.setTokenCookies(res, signInData.accessToken, signInData.refreshToken);
    const { accessToken, refreshToken, ...userData } = signInData;
    return userData; 
  }

  @UseGuards(RefreshTokenGuard) 
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(REFRESH_TOKEN_COOKIE_NAME) 
  @ApiOperation({
    summary: 'Refresh access token using HttpOnly refresh token cookie',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tokens successfully refreshed. New tokens set in HttpOnly cookies.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(
    @GetUser('sub') userId: string,
    @GetUser('refreshToken') refreshTokenFromGuard: string, // This is the UUID from the guard
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ): Promise<{ message: string }> {
    const newTokens = await this.authService.refreshToken(
      userId,
      refreshTokenFromGuard, // Pass the UUID
      userAgent,
      ipAddress,
    );
    this.setTokenCookies(res, newTokens.accessToken, newTokens.refreshToken);
    return { message: 'Tokens refreshed successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME) 
  @ApiOperation({
    summary: 'Log out the current user session and clear HttpOnly cookies',
  })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signOut(
    @GetUser('id') userId: string,
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshTokenFromCookie = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshTokenFromCookie) {
      try {
        await this.authService.signOut(userId, refreshTokenFromCookie);
      } catch (error) {
        // Log error or handle, but still proceed to clear cookies
        console.warn(
          `SignOut: Error invalidating session for user ${userId}: ${error.message}. Proceeding to clear cookies.`,
        );
      }
    } else {
      // If no refresh token cookie, perhaps invalidate all sessions for the user?
      // Or just clear cookies if they exist.
      console.warn(
        `SignOut: No refresh token cookie found for user ${userId}. Clearing potential cookies.`,
      );
    }

    this.clearTokenCookies(res);
    return { message: 'Successfully signed out.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout-all')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
  @ApiOperation({
    summary: 'Log out from all devices/sessions and clear HttpOnly cookies',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed out from all sessions.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signOutAll(
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request, // To potentially get current session's refresh token
  ): Promise<{ message: string }> {
    const currentRefreshTokenFromCookie =
      req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    let currentSessionId: string | undefined;

    if (currentRefreshTokenFromCookie) {
      // We need to find the session ID from the refresh token string
      // This requires a lookup if your service's invalidateAllUserSessions expects a session ID to exclude
      // For simplicity, if your service can handle excluding based on the refresh token string itself, that's easier.
      // Assuming authService.invalidateAllUserSessions can take the current refresh token string to identify the session to keep.
      // Or, we find the session ID first.
      try {
        const session = await this.authService['prisma'].session.findUnique({
          // Accessing prisma directly here is not ideal, better via a service method
          where: { refreshToken: currentRefreshTokenFromCookie },
        });
        if (session && session.userId === userId) {
          currentSessionId = session.id;
        }
      } catch (e) {
        console.warn(
          'Could not find session for current refresh token during signout-all',
          e.message,
        );
      }
    }

    await this.authService.invalidateAllUserSessions(userId, currentSessionId);
    this.clearTokenCookies(res); // Clear cookies regardless
    return { message: 'Successfully signed out from all other sessions.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME) // Document cookie for Swagger
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile.',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(
    @GetUser() user: Omit<UserEntity, 'password'>,
  ): Omit<UserEntity, 'password'> {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-test')
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
  @ApiOperation({ summary: 'Test endpoint for admin role' })
  @ApiResponse({ status: 200, description: 'Admin access granted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  adminRoute(@GetUser('email') email: string): { message: string } {
    return { message: `Admin access granted to ${email}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
  @ApiOperation({ summary: 'Get all active sessions for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of active sessions.' /* type: [SessionEntity] */,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUserSessions(@GetUser('id') userId: string): Promise<Session[]> {
    // Changed from 'sub' to 'id' as per previous suggestions
    return this.authService.getUserSessions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
  @ApiOperation({
    summary: 'Invalidate a specific session for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Session successfully invalidated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Session not found or access denied.',
  })
  async invalidateSession(
    @GetUser('id') userId: string, // Changed from 'sub' to 'id'
    @Param('sessionId') sessionId: string,
  ): Promise<{ message: string }> {
    await this.authService.invalidateSession(userId, sessionId);
    return { message: 'Session successfully invalidated.' };
  }
}
