import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import type { JoiConfig } from '@artyomguybov2002/joi-config-util';
import { JoiUtil } from '@artyomguybov2002/joi-config-util';
import { ConfigNames } from './config.constants';
import type { IAppConfig } from './config.interface';

export const appConfigNs = registerAs('config-namespace', (): IAppConfig => {
  const env = process.env;
  const configs: JoiConfig<IAppConfig> = {
    port: {
      value: env[ConfigNames.PORT] ? parseInt(env[ConfigNames.PORT], 10) : undefined,
      joi: Joi.number().default(3002),
    },
    jwtAccessSecret: {
      value: env[ConfigNames.JWT_ACCESS_SECRET],
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});
