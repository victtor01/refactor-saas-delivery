import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  IS_CLIENT,
  IS_MANAGER,
  IS_PUBLIC_KEY,
  IS_REQUIRED_STORE_SELECTED,
} from 'src/utils/decorators';
import { Session } from './constants';
import { Roles } from 'src/utils/roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  private roles: Roles = new Roles();
  private logger: Logger = new Logger(AuthGuard.name);

  private getContext(context: ExecutionContext) {
    const isManagerRoute: boolean = this.reflector.getAllAndOverride<boolean>(IS_MANAGER, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isClientRoute: boolean = this.reflector.getAllAndOverride<boolean>(IS_CLIENT, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isRequiredStoreSelected: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_REQUIRED_STORE_SELECTED,
      [context.getHandler(), context.getClass()],
    );

    return {
      isRequiredStoreSelected,
      isManagerRoute,
      isClientRoute,
    };
  }

  private async renewTokenWithPassportOrError(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = await this.jwtService.signAsync({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      return newAccessToken;
    } catch (error) {
      throw new BadGatewayException('Sessão expirada!');
    }
  }

  private DispareErrorMessage() {
    throw new UnauthorizedException('Você não tem permissão para fazer isso!');
  }

  private setNewTokenInCookie(response: Response, token: string) {
    response.cookie('__access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request?.cookies?.['__access_token'] || null;
    const refreshToken = request?.cookies?.['__refresh_token'] || null;
    const storeSelectToken = request?.cookies?.['_store'] || null;

    if (!accessToken || !refreshToken)
      throw new UnauthorizedException('Você não tem permissão para fazer isso!');

    const { isRequiredStoreSelected, isManagerRoute, isClientRoute } = this.getContext(context);
    if (!isManagerRoute && !isClientRoute) this.DispareErrorMessage();

    if (isRequiredStoreSelected) {
      await this.jwtService
        .verifyAsync(storeSelectToken)
        .then((data) => (request['store'] = data))
        .catch((err) => {
          this.logger.error(err.message);
          throw new BadGatewayException('Selecione a loja novamente!');
        });
    }

    const session: Session = await this.jwtService
      .verifyAsync(accessToken)
      .catch(async () => {
        const token = await this.renewTokenWithPassportOrError(refreshToken);
        const payload = await this.jwtService.verifyAsync(token);
        this.setNewTokenInCookie(response, token);

        return payload;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new BadGatewayException('Sessão expirada!');
      });

    const { role } = session;
    if (!role) this.DispareErrorMessage();

    const isManager = !!(role === this.roles.managerRole);
    const isClient = !!(role === this.roles.clientRole);
    const isPrivateToAllRoles = !!(isClientRoute && isManagerRoute);

    const isInvalidRequest = !isManager && !isClient;
    if (isInvalidRequest) this.DispareErrorMessage();

    const defaultRole = this?.roles?.defaultRole;
    const userRole = (isPrivateToAllRoles ? defaultRole : role)?.toLocaleLowerCase();

    request[userRole] = session;

    return true;
  }
}
