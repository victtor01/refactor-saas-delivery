import { Controller, Post, Body, Req, Res, BadRequestException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsManager, Public } from 'src/utils/decorators';
import { Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import { SessionManager } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger: Logger = new Logger(AuthController.name);

  @Post('select-store')
  @IsManager()
  async selectStore(
    @Req() { manager }: { manager: SessionManager },
    @Res({ passthrough: true }) response: Response,
    @Body('storeId') storeId: string,
  ) {
    const { id: managerId } = manager;
    return await this.authService.selectStore({ storeId, managerId, response });
  }

  @Public()
  @Post('clients')
  async authClient(
    @Body() { email, password }: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const auth = await this.authService.authClient({ email, password });

    try {
      response.cookie('__access_token', auth.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });

      response.cookie('__refresh_token', auth.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });

      return auth;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Houve um erro ao tentar Fazer login');
    }
  }

  @Public()
  @Post('managers')
  async auth(@Body() authManager: AuthDto, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken, email } = await this.authService.authManager(authManager);

    try {
      response.cookie('__access_token', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });

      response.cookie('__refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });

      return {
        error: false,
        logged: true,
        email: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Houve um erro ao tentar Fazer login');
    }
  }
}
