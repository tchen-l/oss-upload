import { getConfig } from './config';
import fs from 'fs';
import path from 'path';
import co from 'co';
import OSS from 'ali-oss';
import * as vscode from 'vscode';

type ProgressCallback = (increment: number, message?: string) => void;

type ResolveCallback = (msg?: string) => void;

type RejectCallback = (reason?: string) => void;

function ossUpload(
  options: {
    filePath: string;
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    remotePath?: string;
  },
  callbacks: {
    onProgress: ProgressCallback;
    onResolveCallback: ResolveCallback;
    onRejectCallback: RejectCallback;
  },
) {
  const {
    region,
    accessKeyId,
    accessKeySecret,
    filePath,
    bucket,
    remotePath: optionRemotePath,
  } = options;
  const { onProgress, onResolveCallback, onRejectCallback } = callbacks;

  const files: string[] = [];
  const uploadFlagList: any[] = [];

  const remotePath = optionRemotePath || ''; // 远程oss文件名
  // 构建oss对象
  let client: OSS;
  try {
    onProgress(0, '登录中...');

    client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
    });
  } catch (err) {
    onRejectCallback('登录失败，请检查配置是否正确！');
    return;
  }
  // 递归取出 打包后./dist 文件夹下所有文件的路径
  function readDirSync(filePath: string) {
    const filePaths = fs.readdirSync(filePath);
    filePaths.forEach((item) => {
      const cur_path = `${filePath}/${item}`;
      const info = fs.statSync(cur_path);
      if (info.isDirectory()) {
        readDirSync(cur_path);
      } else {
        files.push(cur_path);
      }
    });
  }
  try {
    readDirSync(path.resolve(filePath));
  } catch (err) {
    onRejectCallback('文件读取失败，请检查文件路径是否正确！');
    return;
  }
  const total = files.length;

  co(function* () {
    try {
      for (let index = 0; index < total; index++) {
        const increment = (1 / total) * 100;
        const fileObj = files[index];

        // 提交文件到oss，这里要注意，阿里云不需要创建新文件夹，只要有路径，没有文件夹会自动创建
        const result = yield client.put(fileObj.replace(filePath, remotePath), fileObj);
        uploadFlagList.push(result);
        onProgress(increment, `${index + 1}/${total}`);
        if (!result) {
          break;
        }
      }
      const uplaodFlag = uploadFlagList.find((item) => item?.res?.statusCode !== 200);
      if (uplaodFlag) {
        onRejectCallback('上传失败！');
        return;
      }
      onResolveCallback();
    } catch (e) {
      onRejectCallback('上传失败！');
    }
  });
}

export default function Upload({
  filePath,
}: {
  /** 文件或者文件夹路径 */
  filePath: string;
}) {
  const config = getConfig();

  const { region, accessKeyId, accessKeySecret, bucketList } = config;

  const finalBucketList = bucketList.map((item) => ({ label: item.value, detail: item.label }));

  vscode.window
    .showQuickPick(finalBucketList, {
      title: 'bucket',
      placeHolder: '请选择存储桶',
    })
    .then((selectedBucket) => {
      if (!selectedBucket) {
        return;
      }

      vscode.window
        .showInputBox({
          title: `确定上传到${selectedBucket.detail}(${selectedBucket.label})吗？`,
          value: selectedBucket.label,
        })
        .then((finalSelectedBucket) => {
          if (!finalSelectedBucket) {
            return;
          }

          vscode.window.withProgress(
            {
              cancellable: true,
              title: '文件上传',
              location: vscode.ProgressLocation.Notification,
            },
            (progress) => {
              const onProgress: ProgressCallback = (increment = 0, message = '') =>
                progress.report({ increment, message });

              return new Promise<void>((resolve, reject) => {
                const onResolveCallback: ResolveCallback = (msg = '上传成功！') => {
                  resolve();
                  vscode.window.showInformationMessage(msg);
                };
                const onRejectCallback: RejectCallback = (reason = '') => {
                  reject(reason);
                  vscode.window.showErrorMessage(reason);
                };

                ossUpload(
                  {
                    region,
                    accessKeyId,
                    accessKeySecret,
                    filePath,
                    bucket: finalSelectedBucket,
                  },
                  {
                    onProgress,
                    onResolveCallback,
                    onRejectCallback,
                  },
                );
              });
            },
          );
        });
    });
}
