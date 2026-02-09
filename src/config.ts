import * as vscode from 'vscode';
import isEmpty from './utils/empty';

/** 插件配置 */
export type Config = {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucketList: Array<{
    label: string;
    value: string;
    /** 上传的远程路径 */
    remotePath?: string;
  }>;
};

export function getConfig(): Config {
  const { config } = vscode.workspace.getConfiguration('ossUpload');

  const { region, accessKeyId, accessKeySecret, bucketList } = (config as Config) || {};

  if ([region, accessKeyId, accessKeySecret].some(isEmpty)) {
    throw new Error('请先前往扩展完善基本信息！');
  }

  if (isEmpty(bucketList as any) || !Array.isArray(bucketList)) {
    throw new Error('bucketList 只能是数组！');
  }

  return config;
}
