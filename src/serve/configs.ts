import { IConfigs } from './iface';
import * as path from 'path';

export const CONFIGS: IConfigs = {
  entry: '../../test/md',
  out: '../../test/html',
  joiner: '/'
}

export const HTTP_CONFIGS = {
  hostname: '127.0.0.1',
  port: 8000,
  root: process.cwd(),
  compress: /\.(html|js|css|md)/,
  cache: {
      // 配置缓存时间，这里单位是秒
      maxAge: 60,
      // 是否支持，true表示支持s
      expires: true,
      cacheControl: true,
      lastModified: true,
      etag: true
  }
}

export const LOGGER_CONFIGS = {
  // file: path.resolve(__dirname, './log/log.log')
  file: path.resolve('/Users/vincent/2022/md/src/serve/', './log/log.log')
}