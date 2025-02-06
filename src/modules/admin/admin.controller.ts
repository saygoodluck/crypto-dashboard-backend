import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { AdminDetailsDto } from './dto/admin-details.dto';
import { AllowAccountType } from '../auth/decorators/account-type.decorator';
import { AllowRights } from '../auth/decorators/account-rights.decorator';
import { UpdateAdminDto } from './dto/update.admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('/admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/')
  @AllowAccountType('admin')
  @AllowRights('root')
  public create(@Body() admin: CreateAdminDto): Promise<AdminDetailsDto> {
    return this.adminService.create(admin);
  }

  @Get('self')
  @AllowAccountType('admin')
  public receiveSelf(@Req() req): Promise<AdminDetailsDto> {
    return this.adminService.receive(req.user.id);
  }

  @Get('/:id')
  @AllowAccountType('admin')
  public receive(@Param('id') id: number): Promise<AdminDetailsDto> {
    return this.adminService.receive(id);
  }

  @Get('/')
  @AllowAccountType('admin')
  @AllowRights('root')
  public async receiveAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
  ): Promise<{
    data: AdminDetailsDto[];
    pagination: { limit: number; total: number; skip: number; inPage: number };
  }> {
    const admins = await this.adminService.receiveAll(limit, page);
    const total = await this.adminService.getCount();
    return {
      data: admins,
      pagination: { limit: limit, total: total, skip: (page - 1) * limit, inPage: admins.length }
    };
  }

  @Delete('/:id')
  @AllowAccountType('admin')
  @AllowRights('root')
  public deleteAnother(@Param('id') id: number): Promise<AdminDetailsDto> {
    return this.adminService.delete(id);
  }

  @Patch('/change-password/:token')
  public changePassword(
    @Param('token') token: string,
    @Body() data: ResetPasswordDto
  ): Promise<AdminDetailsDto> {
    return this.adminService.changePassword(token, data);
  }

  @Patch('self')
  @AllowAccountType('admin')
  public updateSelf(@Body() data: UpdateAdminDto, @Req() req): Promise<AdminDetailsDto> {
    return this.adminService.update(req.user.id, data);
  }

  @Patch('/:id')
  @AllowAccountType('admin')
  @AllowRights('root')
  public updateAnother(
    @Param('id') id: number,
    @Body() data: UpdateAdminDto
  ): Promise<AdminDetailsDto> {
    return this.adminService.update(id, data);
  }
}
