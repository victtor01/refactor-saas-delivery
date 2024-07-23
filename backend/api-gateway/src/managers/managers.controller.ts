import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Public } from 'src/utils/decorators';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  private logger: Logger = new Logger(ManagersController.name);

  @Public()
  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }
}
