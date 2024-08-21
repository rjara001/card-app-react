
import { IConfig } from '../interfaces/IConfig';
import { config as devConfig } from './config.dev';
import { config as prodConfig } from './config.prod';

export const getConfig = () : IConfig => {

  const env = process.env.REACT_APP_ENV;

  switch (env) {
    case 'dev':
      return devConfig;
    case 'prod':
      return prodConfig;
    default:
      // You can provide a default configuration or throw an error
      throw new Error(`Unknown environment: ${env}`);
  }
};