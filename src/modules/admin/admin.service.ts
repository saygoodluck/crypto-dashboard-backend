import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../database/model/Admin';
import { CreateAdminDto } from './dto/create.admin.dto';
import { AdminDetailsDto } from './dto/admin-details.dto';
import { Sequelize } from 'sequelize-typescript';

import { v4 as uuidv4 } from 'uuid';
import { Bcrypt } from 'bcrypt';
import { UpdateAdminDto } from './dto/update.admin.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { Transaction } from 'sequelize';

export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminRepository: typeof Admin,
    private readonly sequelize: Sequelize
  ) {}

  public async create(admin: CreateAdminDto): Promise<AdminDetailsDto> {
    const existsAdmin = await this.adminRepository.findOne({
      where: { email: admin.email }
    });

    if (existsAdmin) {
      throw new BadRequestException('This email address is already in use');
    }

    admin.password = Bcrypt.hashSync(admin.password, 10);
    const createdAdmin = new this.adminRepository({ ...admin });
    await createdAdmin.save();
    return new AdminDetailsDto(createdAdmin);
  }

  public async receive(id: number): Promise<AdminDetailsDto> {
    const admin = await this.adminRepository.findOne({
      where: { id: id }
    });

    if (!admin) {
      throw new NotFoundException('Admin with this id is not exist');
    }

    return new AdminDetailsDto(admin);
  }

  public async receiveAll(limit: number, page: number): Promise<AdminDetailsDto[]> {
    const admins = await this.adminRepository.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });
    return admins.map((admin) => new AdminDetailsDto(admin));
  }

  public async requestForPasswordReset(
    data: RequestResetPasswordDto,
    transaction?: Transaction
  ): Promise<AdminDetailsDto> {
    return this.sequelize.transaction({ transaction }, async (t) => {
      const admin = await this.adminRepository.findOne({
        where: { email: data.email },
        transaction: t
      });

      if (!admin) {
        throw new NotFoundException(`Admin with this email: ${data.email} is  not exist`);
      }
      const token = uuidv4();
      const updatedAdmin = await admin.update({ resetPasswordToken: token }, { transaction: t });
      return new AdminDetailsDto(updatedAdmin);
    });
  }

  public async changePassword(
    resetToken: string,
    data: ResetPasswordDto
  ): Promise<AdminDetailsDto> {
    const admin = await this.adminRepository.findOne({
      where: { token: resetToken }
    });

    if (!admin) {
      throw new NotFoundException(`Admin with this token: ${resetToken} is  not exist`);
    }

    const updatedPassword = Bcrypt.hashSync(data.password, 10);

    const updatedAdmin = await admin.update({
      password: updatedPassword,
      resetPasswordToken: null
    });

    return new AdminDetailsDto(updatedAdmin);
  }

  public async delete(adminId: number): Promise<AdminDetailsDto> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId }
    });

    if (!admin) {
      throw new NotFoundException('Admin with this id is not exist');
    }

    if (admin.isRoot) {
      throw new BadRequestException("You can't delete root");
    }
    await this.adminRepository.destroy({ where: { id: adminId } });
    return new AdminDetailsDto(admin);
  }

  public async update(adminId: number, data: UpdateAdminDto): Promise<AdminDetailsDto> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });

    if (!admin) {
      throw new NotFoundException(`Admin with this id: ${adminId} is not exist`);
    }

    if (await Bcrypt.compare(admin.password, data.oldPassword)) {
      throw new BadRequestException('passwords do not match');
    }

    const newPassword = Bcrypt.hashSync(data.newPassword, 10);

    const updatedAdmin = await admin.update({ password: newPassword });

    return new AdminDetailsDto(updatedAdmin);
  }

  public async getCount(): Promise<number> {
    return await this.adminRepository.count();
  }
}
