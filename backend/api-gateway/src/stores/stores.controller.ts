import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Session, SessionManager } from 'src/auth/constants';
import { IsClient, IsManager, IsRequiredStore } from 'src/utils/decorators';
import { CreateStoreDto } from './dtos/create-store.dto';
import { FindStoresDto } from './dtos/find-stores.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { StoresService } from './users-services';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @IsManager()
  create(@Body() createStoreDto: CreateStoreDto, @Req() { manager }: { manager: Session }) {
    return this.storesService.create(createStoreDto, manager.id);
  }

  @Put()
  @IsManager()
  @IsRequiredStore()
  update(@Req() { manager }: { manager: SessionManager }, @Body() { id, name }: UpdateStoreDto) {
    return this.storesService.update({ id, name }, manager.id);
  }

  @Get('my')
  @IsManager()
  MyStores(@Req() req: { manager: SessionManager }) {
    return this.storesService.findByManagerId(req.manager.id);
  }

  @Get('/:page?')
  @IsClient()
  findAllWithLimit(@Param('page') param?: FindStoresDto) {
    const page = param ? Number(param) : 1;
    return this.storesService.findStores(page);
  }
}
