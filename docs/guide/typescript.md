# TypeScript 集成

> TypeScript 是基于 JavaScript 之上构建的强类型编程语言。

选择 TypeScript 的理由已经老生常谈了，总结概述如下：

- 为 JS 添加静态类型检查，提前发现运行时出现的类型错误，将大量错误扼杀在编译阶段，提高代码健壮性。
- 与编辑器结合，获得更好的代码提示，甚至实现“代码即文档”的效果（配合注释），代码可读性的提高可以大幅减少后人上手成本。

TypeScript 开始发力、获得收益的场景，都是在项目开发的中后期，而前期往往需要我们更多的努力与投入，这就决定了适合使用 TypeScript 的项目往往要有频繁迭代，长期维护的特点。

## 开始

首先安装 TypeScript 公共依赖

```bash
$ pnpm add -w -D typescript
```

然后进入 TypeScript 集成部分。在已经安装好 TypeScript 公共依赖的情况下，所谓集成其实就是填写 tsconfig.json 文件。大部分项目都用着相似的 tsconfig 预设，且稳定之后在迭代过程中很少修改。

## 规划 TypeScript 分治策略

对于每个 tsconfig.json 文件，我们主要从以下两个角度理解：

- 每个 tsconfig.json 将一个文件集合声明为一个 ts project(如果称为项目则容易产生概念混淆，故叫做 ts project)，通过 include 描述集合中包含的文件、exclude 字段声明了集合中需要排除的文件。注意，除了 node_modules 中的三方依赖，每个被引用的源码文件都要被包含进来。
- compilerOptions 是编译选项，决定了 TypeScript 编译器在处理该 ts project 包含的文件时所采取的策略与行为。

```json
{
  "compilerOptions": {
    // 项目的编译选项
  },
  "include": [
    // 项目包含哪些文件
  ],
  "exclude": [
    // 在 include 包含的文件夹中需要排除哪些文件
  ]
}
```
> include 与 exclude 字段通过 glob 语法进行文件匹配

我们会将整个工程划分为多个 ts project，应该采用什么样的划分策略呢？不是将每个子模块划分为一个 ts project，分散在各个包中管理。而是将功能相似的代码划分到一个 ts project 中，集中在根目录下管理。

```
alioth
├── apps
├── docs
├── packages
|   ├── component
|   └── utils
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── tsconfig.node.json
└── tsconfig.web.json
```

对于每个 TypeScript 项目而言，编译选项 compilerOptions 大部分都是重复的，因此我们需要建立一个基础配置文件 tsconfig.base.json，供其他配置文件继承。
```json
{
  "compilerOptions": {
    // 项目基础目录
    "baseUrl": "./",
    // 编译目标 js 的版本
    "target": "ES6",
    // 引入 ES 的功能库
    "lib": [],
    // 启用实验性的 ES 装饰器
    "experimentalDecorators": true,
    // 是否将 class 声明中的字段语义从 Set 变更到 Object.defineProperty
    "useDefineForClassFields": true,
    // 设定编译后的 JavaScript 文件使用的模块化方案
    "module": "ESNext",
    // 模块解析策略，是指编译器在查找导入模块内容时所遵循的流程
    "moduleResolution": "Node",
    "allowImportingTsExtensions": true,
    // 是否允许引入 JSON 文件
    "resolveJsonModule": true,
    // 是否不生成打包后的 JavaScript 文件
    "noEmit": true,
    // 在使用 const enum 或隐式类型导入时受到 TypeScript 的警告
    "isolatedModules": true,

    // 与 esModuleInterop: true 配合允许从 commonjs 的依赖中直接按 import XX from 'xxx' 的方式导出 default 模块。
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    // 代码中使用的模块文件名是否必须和文件系统中的文件名保持大小写一致
    "forceConsistentCasingInFileNames": true,
    // 严格模式类型检查，建议开启
    "strict": true,
    // 不允许有未使用的变量
    "noUnusedLocals": true,
    // 存在无用参数时，是否不进行编译
    "noUnusedParameters": true,
    // 不允许 switch 表达式中存在 fallthrough case，即如果某个 case 内不存在 break 或 return 关键字，会抛出错误。
    // 注意：只有当该 case 中存在代码逻辑但是无 break 或 return 时才会抛出错误。如果 case 内无逻辑代码则不会抛出错误。
    "noFallthroughCasesInSwitch": true,
    // 检查类型时是否跳过类型声明文件，一般在上游依赖存在类型问题时置为 true。
    "skipLibCheck": true
  }
}
```

将所有 node 环境下执行的脚本、配置文件划分为一个 project，准备其配置文件 tsconfig.node.json

```json
{
  // 继承基础配置
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    // 该 project 将被视作一个部分，通过项目引用(Project References)功能集成到一个 tsconfig.json 中
    "composite": true,
    // node 脚本没有 dom 环境，因此只集成 esnext 库即可
    "lib": ["ESNext"],
  },
  "include": [
    "scripts/**/*",
    // 配置文件，如：vite.config.ts
    "**/*.config.*"
  ]
}
```

对于所有模块中 src 目录下的源码文件，它们几乎都是组件库的实现代码，大多要求浏览器环境下特有的 API(例如 DOM API)，且相互之间存在依赖关系。我们创建 tsconfig.web.json 将它们划入同一个 ts project 中。

```json
{
  // 继承基础配置
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    // 该 project 将被视作一个部分，通过项目引用(Project References)功能集成到一个 tsconfig.json 中
    "composite": true,
    // 组件库依赖浏览器的 DOM API
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    // 支持 jsx 语法
    "jsx": "react-jsx"
  },
  "include": [
    "apps",
    "packages",
    "typings/env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "**/dist",
    "**/*.md"
  ]
}
```

我们最终还是要在根目录建立一个总的 tsconfig.json，通过 项目引用(Project References)功能 将多个 compilerOptions.composite = true 的 ts project 聚合在一起，这样 IDE 才能够识别。

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.web.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

项目引用(Project References) 特性，简单理解就是为项目的不同部分应用不同 tsconfig 的能力。

如果对 tsconfig 实际应用的编译选项或者包含的文件产生疑惑，可以通过以下命令去验证：

```bash
$ pnpm tsc -p tsconfig.web.json --showConfig
```
