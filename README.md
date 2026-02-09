# oss-upload - VSCode 阿里云OSS上传插件

一个方便的VSCode插件，支持将文件和文件夹快速上传到阿里云OSS存储桶。

## 功能特性

- ✅ **文件上传**：支持单个文件上传到OSS
- ✅ **文件夹上传**：支持递归上传整个文件夹及其内容
- ✅ **右键菜单**：在资源管理器中右键即可触发上传
- ✅ **多存储桶支持**：可配置多个存储桶，上传时选择目标
- ✅ **上传进度**：显示实时上传进度和状态
- ✅ **错误处理**：完善的错误提示和处理机制

### 上传流程

1. 在资源管理器中右键点击文件或文件夹
2. 选择"上传到OSS"选项
3. 选择目标存储桶
4. 输入或确认上传路径
5. 等待上传完成并查看结果

## 安装要求

- VSCode版本：1.109.0 或更高版本
- 阿里云OSS账号：需要有效的AccessKey和存储桶
- Node.js环境：开发和构建时需要（用户使用插件无需安装）

## 插件配置

在VSCode设置中搜索"OSS 上传配置"，并配置以下参数：

### 核心配置

- **region**：阿里云OSS服务区域（如：oss-cn-hangzhou）
- **accessKeyId**：阿里云AccessKey ID
- **accessKeySecret**：阿里云AccessKey Secret

### 存储桶配置

**bucketList**：存储桶列表，支持配置多个存储桶

每个存储桶配置包含：

- `label`：存储桶显示名称
- `value`：存储桶实际名称
- `remotePath`：默认远程上传路径

### 配置示例

```json
{
  "region": "oss-cn-hangzhou",
  "accessKeyId": "your-access-key-id",
  "accessKeySecret": "your-access-key-secret",
  "bucketList": [
    {
      "label": "测试环境",
      "value": "test-bucket",
      "remotePath": "/uploads/test"
    },
    {
      "label": "生产环境",
      "value": "prod-bucket",
      "remotePath": "/uploads/prod"
    }
  ]
}
```

## 已知问题

- 不支持上传超大文件（超过5GB的文件需要分块上传，当前版本未实现）
- 不支持符号链接文件上传
- 上传过程中网络中断会导致上传失败

## 版本历史

### 0.0.1

- 初始版本发布
- 支持文件和文件夹上传
- 支持多存储桶选择
- 右键菜单集成
- 上传进度显示

---

## 开发与贡献

如果您想参与开发或贡献代码，请按照以下步骤操作：

1. 克隆仓库：`git clone https://github.com/tchen-l/oss-upload.git`
2. 安装依赖：`yarn install`
3. 编译代码：`yarn compile`
4. 运行测试：`yarn test`
5. 打包插件：`yarn package`

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [https://github.com/tchen-l/oss-upload/issues](https://github.com/tchen-l/oss-upload/issues)
- Email: 895433995@qq.com

**感谢使用 oss-upload 插件！**
