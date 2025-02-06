import { SetMetadata } from '@nestjs/common';

export const AllowAccountType = (...types: string[]) => SetMetadata('allow-account', types);
