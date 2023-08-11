# 起步

## pnpm 安装

> Pnpm：快速的，节省磁盘空间的包管理工具

```bash
# 通过 npm 安装
$ npm install -g pnpm

# 通过 Homebrew 安装 pnpm
$ brew install pnpm

# 升级
$ pnpm add -g pnpm
```


## 初始化项目

在根目录下执行 pnpm init -y 命令，创建 package.json 文件。
```bash
$ pnpm init
```

我们的项目不需要在 npm 公开发布，设置 private 为 true

```json
{
  "private": true,
}
```

## Corepack「管理包管理器的管理器」

Corepack 是一个实验性工具，在 Node.js v16.13 版本中引入，它可以指定项目使用的包管理器以及版本，即『包管理器的管理器』。

主要作用：
* 不再需要专门全局安装 yarn pnpm 等工具。
* 可以强制团队项目中使用他特定的包管理器版本，而无需他们在每次需要进行更新时手动同步它，如果不符合配置将在控制台进行错误提示。

在项目 package.json 文件中新增属性 "packageManager"

```json
{
  "packageManager": "pnpm@8.0.0",
}
```


限制只能用 pnpm 来作为包管理器

```json
// 在根目录的 package.json 中添加如下脚本
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```
>现在，只要有人运行 npm install 或 yarn，就会发生错误并且不会继续安装。如果您使用 npm v7，请改用 npx -y

修改完成后根目录下的 package.json 文件，内容如下：

```json
{
  "name": "alioth",
  "private": true,
  "packageManager": "pnpm@8.0.0",
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```


## 配置 .npmrc
.npmrc 文件是包管理工具的配置文件，用来存储包管理工具的配置信息。

```bash
# 提升所有依赖到根 node_modules 目录下
shamefully-hoist=true

# 如果启用了此选项，那么在依赖树中存在缺失或无效的 peer 依赖关系时，命令将执行失败
strict-peer-dependencies=false

# 当安装某个依赖时，会自动安装该包 peerDependencies 中的依赖。
auto-install-peers=false

# 设置为 true 时，pnpm 将使用类 bash shell 的 JavaScript 实现来执行脚本
shell-emulator=true
```


## Workspace 配置

要使用 PNPM 的 Monorepo 很简单，只需要在项目的工作区下新建 pnpm-workspace.yaml 文件并配置：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'docs'
```

## 全局共用的依赖

对于使用比较频繁的依赖，在多个子项目中都有用到的情况，比如我们当前技术栈为vue2，那么核心库 vue、vue-router基本都会用到，以及一些通用工具，如 lodash、dayjs等，此时，就可以采用全局安装的方式，这样做的好处是所有的子项目都可以直接引入使用（此时的依赖是安装在主目录下的 node_modules 中的）。

```bash
$ pnpm add -w typescript
```
- -D：作为开发依赖使用
- -w：表示把包安装在 root 下，该包会放置在 root/node_modules 下

## 单一子项目的依赖

作为一个多包项目，肯定会存在某个项目独有的一些依赖，这个时候我们就可以针对性的安装到指定子目录。

```bash
# 语法
$ pnpm add <package-name> --filter <target-package-name>

# 比如要将 lodash 装到 utils 下
# --filter 后面可以为目录名称也可以为 package.josn 的 name 名称
# 比较推荐的做法是根据 package.josn 的 name 名称进行区别
$ pnpm add lodash --filter @alioth/utils
```

## 项目的目录结构如下：

```
alioth
├── apps
├── docs
├── packages
|   ├── component
|   └── utils
├── package.json
└── pnpm-workspace.yaml

```
