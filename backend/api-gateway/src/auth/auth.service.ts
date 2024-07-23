import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtConfig, Session } from './constants';
import { JwtService } from '@nestjs/jwt';
import { ManagersService } from 'src/managers/managers.service';
import { compare as compareHash } from 'bcryptjs';
import { Roles } from 'src/utils/roles';
import { Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import { ClientsService } from 'src/clients/clients.service';
import { Store } from 'src/stores/entities/store.entity';
import { StoresService } from 'src/stores/stores.service';

type OptionsToGenerateJwt = {
  payload: any;
  option: 'accessToken' | 'refreshToken';
};

type SelectStoreAndSetInResponseProps = {
  response: Response;
  storeId: string;
  managerId: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtConfig: JwtConfig,
    private readonly jwtService: JwtService,
    private readonly managersService: ManagersService,
    private readonly clientsService: ClientsService,
    private readonly storesService: StoresService,
  ) {}

  private expiresWithOption = {
    ['accessToken']: this.jwtConfig.getAccessTokenExpiration(),
    ['refreshToken']: this.jwtConfig.getRefreshTokenExpiration(),
  };

  private logger: Logger = new Logger(AuthService.name);
  private roles = new Roles();

  async generateJwt({ payload, option }: OptionsToGenerateJwt): Promise<string> {
    const jwt = await this.jwtService.signAsync(payload, {
      expiresIn: this.expiresWithOption[option],
    });

    return jwt;
  }

  async selectStore({
    storeId,
    response,
    managerId,
  }: SelectStoreAndSetInResponseProps): Promise<any> {
    try {
      const stores: Store[] = await this.storesService.findByManagerId(managerId);
      if (!stores[0]?.id) throw new BadGatewayException('Nenhuma loja disponível!');

      const selectedStore = stores?.filter((store: Store) => store.id === storeId)?.[0] || null;
      if (!selectedStore?.id) throw new BadGatewayException('Loja não encontrada!');

      const jwtStore: string = await this.generateJwt({
        payload: { id: selectedStore.id },
        option: 'refreshToken',
      });

      response.cookie('_store', jwtStore, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });
      
      return selectedStore;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  async authClient({ email, password }: AuthDto) {
    const clientInDatabase = await this.clientsService.findByEmail(email);

    const comparePassword = !!(await compareHash(password, clientInDatabase.password));
    if (!comparePassword) throw new UnauthorizedException('A senha está incorreta!');

    try {
      const { id, email } = clientInDatabase;
      const payload: Session = { id, email, role: this.roles.clientRole };

      const accessToken = await this.generateJwt({ payload, option: 'accessToken' });
      const refreshToken = await this.generateJwt({ payload, option: 'refreshToken' });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async authManager({ email, password }: AuthDto) {
    const findOneManagerByEmail = await this.managersService.findOneByEmail(email);
    if (!findOneManagerByEmail?.id) throw new NotFoundException('Usuário não existe!');

    const passwordIsValid = await compareHash(password, findOneManagerByEmail.password);
    if (!passwordIsValid) throw new UnauthorizedException('Senha incorreta!');

    try {
      const { id, email } = findOneManagerByEmail;
      const payload: Session = { id, email, role: this.roles.managerRole };

      const accessToken = await this.generateJwt({ payload, option: 'accessToken' });
      const refreshToken = await this.generateJwt({ payload, option: 'refreshToken' });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
