import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  CreateScenarioUseCase,
  DeleteScenarioUseCase,
  GetOneScenarioUseCase,
  GetScenarioListUseCase,
  UpdateScenarioUseCase,
} from '../../Application';
import { ScenarioApiContracts } from '../ApiContracts/types';

@Controller('scenario')
export class ScenarioController {
  constructor(
    private readonly createScenario: CreateScenarioUseCase,
    private readonly getOneScenario: GetOneScenarioUseCase,
    private readonly getScenarioList: GetScenarioListUseCase,
    private readonly updateScenario: UpdateScenarioUseCase,
    private readonly deleteScenario: DeleteScenarioUseCase
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Body() dto: ScenarioApiContracts.Api.CreateScenario.Request.Body
  ): Promise<ScenarioApiContracts.Api.CreateScenario.Response.Data> {
    return this.createScenario.execute(dto);
  }

  @Get('list')
  findAll(): Promise<ScenarioApiContracts.Api.GetScenarioList.Response.Data> {
    return this.getScenarioList.execute();
  }

  @Get(':id')
  findOne(
    @Param() params: ScenarioApiContracts.Api.GetOneScenario.Request.Params
  ): Promise<ScenarioApiContracts.Api.GetOneScenario.Response.Data> {
    return this.getOneScenario.execute({ id: params.id });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param() params: ScenarioApiContracts.Api.UpdateScenario.Request.Params,
    @Body() dto: ScenarioApiContracts.Api.UpdateScenario.Request.Body
  ): Promise<ScenarioApiContracts.Api.UpdateScenario.Response.Data> {
    return this.updateScenario.execute({ id: params.id, data: dto });
  }

  @Delete(':id')
  async delete(
    @Param() params: ScenarioApiContracts.Api.DeleteScenario.Request.Params
  ): Promise<ScenarioApiContracts.Api.DeleteScenario.Response.Data> {
    await this.deleteScenario.execute({ id: params.id });
    return { success: true };
  }
}
