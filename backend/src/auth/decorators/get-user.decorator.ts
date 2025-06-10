// filepath: src/auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { JwtPayloadWithRt } from '../strategy/refresh-token.strategy';

// Type for user object from JwtStrategy (actual user model)
type UserFromJwtStrategy = Omit<PrismaUser, 'password' | 'sessions'>;
// Type for user/payload object from RefreshTokenStrategy
type PayloadFromRefreshTokenStrategy = JwtPayloadWithRt;

// Union of all possible keys from both types
type PossibleUserOrPayloadKeys =
  | keyof UserFromJwtStrategy
  | keyof PayloadFromRefreshTokenStrategy;

export const GetUser = createParamDecorator(
  (data: PossibleUserOrPayloadKeys | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<any>(); // Use any for request.user initially
    const user = request.user;

    // If data is provided, return that specific piece of user information.
    // Otherwise, return the whole user object.
    return data && user ? user[data] : user;
  },
);
