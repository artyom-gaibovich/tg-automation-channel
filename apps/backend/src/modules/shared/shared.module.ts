import { DynamicModule, Module } from '@nestjs/common';
import { PrismaModule } from './persistence/prisma/prisma.module';

interface DatabaseOptions {
	type: 'prisma';
	global?: boolean;
}

@Module({})
export class SharedModule {
	static async register({ global = false, type }: DatabaseOptions): Promise<DynamicModule> {
		return {
			global,
			module: SharedModule,
			imports: [type === 'prisma' ? PrismaModule : PrismaModule],
			exports: [type === 'prisma' ? PrismaModule : PrismaModule],
		};
	}
}
