import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from 'src/clients/clients.module';
import { ManagersModule } from 'src/managers/managers.module';
import { StoresModule } from 'src/stores/stores.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from './constants';

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
