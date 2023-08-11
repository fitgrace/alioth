# 用 VitePress 搭建项目文档

## 初始化
在文档目录（docs）执行 pnpm init 创建 package.json 文件。

```bash
$ pnpm init
```

修改目录下的 package.json 文件，内容如下：

```json
{
  "name": "@alioth/docs",
  "private": true,
  "scripts": {}
}
```

添加 vitepress 为开发依赖：
```bash
$ pnpm add -D vitepress
```

## 设置向导

VitePress 附带一个命令可帮助构建基本项目。 安装后，通过运行以下命令启动向导：

```bash
$ pnpm dlx vitepress init
```
