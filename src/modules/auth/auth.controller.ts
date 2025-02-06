import { BadRequestException, Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowAccountType } from './decorators/account-type.decorator';
import { UserDetailsDto } from '../user/dto/user-details.dto';
import { AdminDetailsDto } from '../admin/dto/admin-details.dto';
import { UserService } from '../user/user.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
  }

  @Post('/telegram')
  async authTelegram(@Body() telegramUser: any) {
    if (!telegramUser || !telegramUser.id) {
      throw new BadRequestException('Неверные данные пользователя');
    }
    const user = await this.userService.findOrCreate(telegramUser);
    const token = await this.authService.generateToken(user);
    return { success: true, token };
  }

  @Get('/whoami')
  @AllowAccountType('user', 'admin')
  public whoAmI(@Req() request: any): UserDetailsDto | AdminDetailsDto {
    return new UserDetailsDto(request.user);
  }

  @Post('/logout')
  @AllowAccountType('user', 'admin')
  public logout(@Headers('authorization') token: string): Promise<void> {
    return this.authService.logout(token);
  }
}
