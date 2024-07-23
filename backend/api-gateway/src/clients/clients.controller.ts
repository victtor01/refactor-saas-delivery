import { Controller, Post, Body, Logger, Res, BadRequestException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Public } from 'src/utils/decorators';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  private logger: Logger = new Logger(ClientsController.name)

  @Public()
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    const response = await this.clientsService.create(createClientDto);

    return response;
  }

  // @Public()
  // @Post('auth')
  // async auth(
  //   @Body() { email, password }: AuthClientDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const auth = await this.clientsService.auth({ email, password });

  //   try {
  //     response.cookie('__access_token', auth.accessToken, {
  //       httpOnly: true,
  //       sameSite: 'strict',
  //       path: '/',
  //     });

  //     response.cookie('__refresh_token', auth.refreshToken, {
  //       httpOnly: true,
  //       sameSite: 'strict',
  //       path: '/',
  //     });
  
  //     return auth;
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new BadRequestException("Houve um erro ao tentar Fazer login")
  //   }
  // }
}
