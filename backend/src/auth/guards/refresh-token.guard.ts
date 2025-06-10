import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service'; // Ajusta la ruta si es necesario
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.controller';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'Refresh token not provided in cookie.',
      );
    }

    try {
      // authService.validateOpaqueRefreshToken debe devolver un objeto con user, session, y refreshToken
      // o lanzar una excepción si la validación falla.
      const validatedData =
        await this.authService.validateOpaqueRefreshToken(token);

      // Adjunta la información del usuario y token a la request para que el controlador la use.
      // Es importante que la estructura de 'request.user' sea la que espera @GetUser().
      // Por ejemplo, si @GetUser('sub') espera request.user.sub, asegúrate de que 'sub' esté presente.
      // Y si @GetUser('refreshToken') espera request.user.refreshToken, asegúrate de que esté.
      (request as any).user = {
        ...validatedData.user, // Contiene id, email, role, etc.
        sub: validatedData.user.id, // Mapea user.id a 'sub' para consistencia con @GetUser('sub')
        refreshToken: validatedData.refreshToken, // El UUID del token de refresco validado
        sessionId: validatedData.session.id, // El ID de la sesión de la base de datos
      };
    } catch (error) {
      // Si authService.validateOpaqueRefreshToken lanza una UnauthorizedException (o cualquier error),
      // se captura aquí y se relanza, resultando en una respuesta 401.
      throw new UnauthorizedException(
        error.message || 'Invalid or expired refresh token.',
      );
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request?.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
  }
}
