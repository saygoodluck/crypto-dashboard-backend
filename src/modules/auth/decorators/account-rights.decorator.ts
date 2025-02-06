import { SetMetadata } from '@nestjs/common';

export const AllowRights = (...rights: string[]) => SetMetadata('allow-rights', rights);
