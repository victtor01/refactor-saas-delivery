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
import { StoresService } from 'src/stores/stores.service';

type OptionsToGenerateJwt = {
  payload: any;
  expiresIn: string;
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
    accessToken: this.jwtConfig.getAccessTokenExpiration(),
    longExpiration: this.jwtConfig.getRefreshTokenExpiration(),
  };

  private logger: Logger = new Logger(AuthService.name);
  private roles = new Roles();

  public async generateJwt({ payload, expiresIn }: OptionsToGenerateJwt): Promise<string> {
    const jwt = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn,
    });

    return jwt;
  }

  private async getAccessAndRefreshToken<T = any>(payload: T) {
    const accessToken = await this.generateJwt({
      expiresIn: this.jwtConfig.getAccessTokenExpiration(),
      payload,
    });

    const refreshToken = await this.generateJwt({
      expiresIn: this.jwtConfig.getRefreshTokenExpiration(),
      payload,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async selectStore({
    storeId,
    response,
    managerId,
  }: SelectStoreAndSetInResponseProps): Promise<any> {
    try {
      const stores = await this.storesService.findByManagerId(managerId);
      if (!stores[0]?.id) throw new BadGatewayException('Nenhuma loja disponível!');

      const searchStoreInResponseOfDatabase = () =>
        stores?.filter((store: any) => store?.id === storeId)?.[0] || null;
      const selectedStore = searchStoreInResponseOfDatabase();

      if (!selectedStore?.id || selectedStore?.managerId !== managerId)
        throw new BadGatewayException('Loja não encontrada!');

      const jwtStore: string = await this.generateJwt({
        payload: { id: selectedStore.id },
        expiresIn: this.expiresWithOption.longExpiration,
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

  public async authClient({ email, password }: AuthDto) {
    const clientInDatabase = await this.clientsService.findByEmail(email);

    const comparePassword = !!(await compareHash(password, clientInDatabase.password));
    if (!comparePassword) throw new UnauthorizedException('A senha está incorreta!');

    try {
      const { id, email } = clientInDatabase;
      const payload: Session = { id, email, role: this.roles.clientRole };

      const { accessToken, refreshToken } = await this.getAccessAndRefreshToken<Session>(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async authManager({ email, password }: AuthDto) {
    const findOneManagerByEmail = await this.managersService.findOneByEmail(email);
    if (!findOneManagerByEmail?.id) throw new NotFoundException('Usuário não existe!');

    const passwordIsValid = await compareHash(password, findOneManagerByEmail.password);
    if (!passwordIsValid) throw new UnauthorizedException('Senha incorreta!');

    try {
      const { id, email } = findOneManagerByEmail;
      const payload: Session = { id, email, role: this.roles.managerRole };

      const { accessToken, refreshToken } = await this.getAccessAndRefreshToken<Session>(payload);

      return {
        accessToken,
        refreshToken,
        email
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
