import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './constants';
import { ManagersModule } from 'src/managers/managers.module';
import { ClientsModule } from 'src/clients/clients.module';
import { StoresService } from 'src/stores/stores.service';
import { StoresModule } from 'src/stores/stores.module';

const configJWT: JwtConfig = new JwtConfig();

@Module({
  imports: [
    ManagersModule,
    ClientsModule,
    StoresModule,
    JwtModule.register({
      global: true,
      secret: configJWT.getSecretKey(),
      signOptions: { expiresIn: configJWT.getAccessTokenExpiration() },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtConfig],
  exports: [AuthService, JwtConfig],
})
export class AuthModule {}
