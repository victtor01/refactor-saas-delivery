import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { IsClient, IsManager } from 'src/utils/decorators';
import { Session, SessionManager } from 'src/auth/constants';
import { FindStoresDto } from './dtos/find-stores.dto';
import { Response } from 'express';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @IsManager()
  create(@Body() createStoreDto: CreateStoreDto, @Req() { manager }: { manager: Session }) {
    return this.storesService.create(createStoreDto, manager.id);
  }

  @Get('my')
  @IsManager()
  MyStores(@Req() req: { manager: SessionManager }) {
    return this.storesService.findByManagerId(req.manager.id);
  }

  // @Post('select')
  // @IsManager()
  // selectStore(
  //   @Req() { manager }: { manager: SessionManager },
  //   @Res({ passthrough: true }) response: Response,
  //   @Body('storeId') storeId: string,
  // ) {
  //   const { id: managerId } = manager;
  //   const store = this.storesService.selectStore({ storeId, managerId, response });
  // }

  @Get('/:page?')
  @IsClient()
  findAllWithLimit(@Param('page') param?: FindStoresDto) {
    const page = param ? Number(param) : 1;
    return this.storesService.findStores(page);
  }
}
