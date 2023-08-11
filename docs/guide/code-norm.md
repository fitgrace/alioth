# 代码检查与代码规范

团队协作时，我们需要在代码提交前，统一团队代码风格，检查代码质量，并修复一些低级错误。最终期待项目中的开发人员提交的代码都符合代码规范、风格统一。

在实践之前，可以先关注下面的问题，看看有没有覆盖自己的疑惑。这些问题的答案将在下面的实践中逐步清晰：

- 如何集成 ESLint，控制代码风格？
- ESLint 如何与 React、Vue、TypeScript 配合使用？
- 如何集成 StyleLint，控制样式风格？
- StyleLint 如何与 React、Vue、SCSS 配合使用？
- Prettier 应该如何使用？
- 如何集成 commitlint，控制提交文件的检查？
- 如何实现增量 Lint 检查？更好地应对积重难返的“屎山”项目。

## ESLint

> [ESLint](https://zh-hans.eslint.org/docs/latest/use/getting-started) 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。

使用 ESLint 需要我们在项目的根目录下添加 .eslintrc.js 或 .eslintrc.json 文件，在其中导出配置对象。下面是个典型的配置文件，它结合了 typescript-eslint 实现了对 TypeScript 的支持，我们以它为例子帮助大家简单地理解重要的配置字段，并梳理 ESLint 的工作思路。

```json
{
  "root": true,

  // 继承已有配置对象
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],

  // 如何理解代码
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "project": ["./tsconfig.json"] },

  // 添加哪些规则
  "plugins": [
    "@typescript-eslint"
  ],

  // 已添加规则的开启 / 关闭
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": [
      2,
      {
        "allowString" : false,
        "allowNumber" : false
      }
    ]
  },

  // 对特殊文件应用特殊配置
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        // 所有 .vue 文件除了应用上面的公共规则配置外，还需应用的独特规则配置。
      },
    },
  ],
}
```

#### 1、ESLint 如何理解代码？
parser 和 parserOptions 选项与 ESLint 如何理解代码相关。这里分析器 @typescript-eslint/parser 负责解析 TypeScript 语言，将代码转化为 AST 语法树，便于进行分析。而 parserOptions 可以对解析器的能力进行详细设置。

#### 2、ESLint 如何判断代码是否规范？
ESLint 提供了自定义规则的接口，开发者需要遵照接口，根据分析器的 AST 产物，实现规范检查逻辑，再将实现的多条规范聚合为 plugin 插件的形式。plugin 字段指定了 ESLint 应用什么规则集，具有理解哪些规范的能力。

#### 3、规则的启用与禁用
有了规则集，能够理解规范，不代表 ESLint 就对不规范的内容做出响应，还需要进一步在 rules 字段中对这些规则进行开启或者关闭的声明，只有开启的规则才会生效。

#### 4、继承已有配置
面对琳琅满目的规则集，我们完全在项目中配置是不可取的。因此社区逐渐演进出了许多配置预设，可以一键继承，从而减少绝大多数手动配置的工作量。例如例子中的 eslint:recommended、plugin:@typescript-eslint/recommended 就代表继承了 eslint 和 typescript-eslint 的推荐配置。

#### 5、配置的重写
如果我们希望某些文件应用一些独特的配置，可以使用 overrides 字段实现。overrides 的每个成员对象都需要指定目标文件，除了应用所有父级配置之外，还要应用成员对象中声明的独有配置。ESLint 支持文件级别的重写。


### 规则集的选型
ESLint 有许多成熟的规则集，这些规则集都是成熟团队的实践。它们通过 plugin 实现了很多个性化的规则，又内置了海量的 rules 配置预设。只需简单的几行代码继承，就相当于拥有了这些优秀团队的优秀实践。

规则集推荐：
- eslint-config-airbnb: Airbnb 规则集
- eslint-config-alloy：腾讯 AlloyTeam 的规则集
- eslint-config-standard: StandardJS 规则集

采用什么样的规则集并不是最重要的，重要的是“正确引入，严格执行”，引导团队成员统一规范，写出整洁、可维护的代码。


### 依赖安装

首先我们需要安装 eslint 核心工具
```bash
$ pnpm add -w -D eslint
```

要具备解析 TypeScript 的能力，所以要安装 typescript-eslint 系列工具。
```bash
$ pnpm add -w -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

import 模块引入相关的规则并不包含在默认规则集、typescript-eslint 规则集以及 Airbnb 规则集中，所以我们要额外安装对应的 plugin，引入这些规则集。
```bash
$ pnpm add -w -D eslint-plugin-import
```

安装 Airbnb 规则集，便于我们一键继承
```bash
$ pnpm add -w -D eslint-config-airbnb
```

推荐 eslint-define-config，这个库能够让在我们编写 .eslintrc.js 配置文件时，提供完善的类型支持，大幅度提升体验，强烈推荐安装！
```bash
$ pnpm add -w -D eslint-define-config
```

### 配置

在根目录建立 .eslintrc.js 文件，作为 ESLint 的配置文件。
```javascript
const { defineConfig } = require('eslint-define-config');
const path = require('path');

module.exports = defineConfig({
  // 指定此配置为根级配置，eslint 不会继续向上层寻找
  root: true,

  // 将浏览器 API、ES API 和 Node API 看做全局变量，不会被特定的规则(如 no-undef)限制。
  env: {
    es6: true,
    browser: true,
    node: true,
  },

  // 设置自定义全局变量，不会被特定的规则(如 no-undef)限制。
  globals: {
    // 假如我们希望 jquery 的全局变量不被限制，就按照如下方式声明。
    // $: 'readonly',
  },

  // 集成 Airbnb 规则集
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],

  // 指定解析器
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 通过 tsconfig 文件确定解析范围，这里需要绝对路径，否则子模块中 eslint 会出现异常
    project: path.resolve(__dirname, 'tsconfig.eslint.json'),

    // 我们主要使用 esm，设置为 module
    sourceType: 'module',
  },

  // 在已有规则及基础上微调修改
  rules: {
    // 该规则检查您是否使用制表符进行缩进
    'no-tabs': 'error',
  },

  // 文件级别的重写
  overrides: [
    // 对于 vite 和 vitest 的配置文件，不对 console.log 进行错误提示
    {
      files: [
        '**/vite.config.*',
        '**/vitest.config.*',
      ],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
```

结合上文中对 ESLint 主要字段的讲解以及注释内容，不难理解这个配置文件的含义。这里我们需要注意一下 parserOptions.project 字段，TypeScript 解析器需要一个 tsconfig 文件来确认解析范围。

我们希望 ESLint 检查能覆盖所有源码文件，但是 tsconfig.json 已经被占用做其他用途(IDE 语言服务)，不能够迁就 ESLint，因此我们只得另外建立一个 ESLint 专用的文件 tsconfig.eslint.json，在其中包含所有希望被规范化的源码文件。这也是 typescript-eslint 官方为 monorepo 型工程推荐的一种解决方案。

```javascript
// eslint 检查专用，不要包含到 tsconfig.json 中
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    // 参考 https://typescript-eslint.io/linting/typed-linting/monorepos
    "noEmit": true
  },
  // 只检查，不构建，因此要包含所有需要检查的文件
  "include": [
    "**/*",
    // .xxx.js 文件需要单独声明，例如 .eslintrc.js
    "**/.*.*"
  ],
  "exclude": [
    "node_modules"
    // 排除产物目录
    "dist",
  ]
}
```

对于一些不希望应用 ESLint 检查的内容，可以通过 .eslintignore 文件将之排除，.eslintignore 的规则与 .gitignore 的规则完全相同。我们排除 ESLint 对依赖目录与产物目录的检查。
```bash
# Package Manager
node_modules

# Bundle
coverage
dist

# ESLint 默认忽略对 . 开头文件的检查，需要用 ! 反向声明忽略。
!.eslintrc.js
!.prettierrc.js
```

关于 .eslintignore 还有一点需要注意：ESLint 默认忽略对 . 开头文件的检查。 对于配置文件 .eslintrc.js 以及之后的 .stylelintrc.js 等都需要用 ! 反向声明忽略。

在 package.json 中加入 eslint 检查的脚本：
```json
{
  "scripts": {
    "lint:fix": "eslint --cache --quiet --ext .js,.jsx,.ts,.tsx --fix scripts apps/**/src packages/**/src",
    // ...
  }
}
```

尝试执行检查：
```bash
pnpm run lint:fix
```

正确配置后，ESLint 能检查出不少错误。


## Stylelint

> Stylelint 是一个强大的 CSS 格式化工具，可以帮助使用者避免语法错误并统一编码风格。

Stylelint 的原理与上面讲到的 ESLint 是一样的，只不过它是 CSS 样式领域的 Lint 工具。在上手了 ESLint 之后，我们理解 Stylelint 并不会有太大的困难。

首先，为项目安装 Stylelint，并结合我们的实际需求安装必要的插件：

```bash
$ pnpm add -w -D stylelint
```

- stylelint-config-standard：Stylelint 的标准可共享配置规则
- stylelint-config-recess-order：一种推荐的 css 属性排序的规则。
- stylelint-stylistic：Stylelint 升级到 15.0.0 大版本后，计划废弃风格相关的规则，这部分内容分离出来由社区维护，需要单独安装。

```bash
$ pnpm add -w -D stylelint-config-standard stylelint-config-recess-order stylelint-stylistic
```

在项目根目录建立 stylelint.config.js，编写配置文件。
```javascript
module.exports = {
  // 继承的预设，这些预设包含了规则集插件
  extends: [
    // stylelint 官方共享的标准规则集成
    'stylelint-config-standard',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
  ],
  plugins: [
    'stylelint-stylistic' // 代码风格规则
  ]
  rules: {
    // 禁止空块
    'block-no-empty': null,
  },
};
```

同样，.stylelintignore 文件也要忽略产物目录和依赖目录。
```bash
# Package Manager
node_modules

# Bundle
coverage
dist

!*.css
```

在 package.json 中加入 stylelint 检查的脚本
```json
{
  "scripts": {
    "lint:css": "stylelint --fix {apps,packages}/**/src/*.{css,html}",
    // ...
  }
}
```

执行检查
```bash
$ pnpm run lint:css
```

## Prettier

> Prettier 是一个固执己见的代码格式化工具。

它是一款只需进行简单配置，就能支持多种语言格式化的工具。由于它专注的方向是代码风格(换行、缩进)，并不涉及语法检查，因此很多实践中会让 Prettier 与 Lint 系列工具互相配合——将 Prettier 以插件规则集的方式集成到 Lint 中，并关闭原本内置的功能重复的规则。

但在我们的配置中，Prettier 是被边缘化的，理由如下：
- ESLint 和 Stylelint 本身就有控制代码风格的规则。只不过它们只针对 JS / TS / CSS，不如 Prettier 支持的语言种类多，但我们对其他语言支持的需求度不高。
- Prettier 与 Lint 结合使用时，所有的格式错误都会被标注为统一的 prettier/prettier，没法进一步细分错误。
- Prettier 比较固执己见，无法对规则进行更细粒度的控制，ESLint 和 Stylelint 这方面的潜力更大。

比较赞同 antfu 大佬的观点：[为什么我不使用 Prettier](https://antfu.me/posts/why-not-prettier-zh)。因此我们的组件库将使用 Prettier 完成 ESLint、Stylelint 不支持的文件类型的格式化， 例如 Markdown、json、yaml 等。

安装 Prettier
```
$ pnpm add -w -D prettier
```

在根目录增加 .prettierrc.js 文件，内容如下：
```javascript
module.exports = {
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 一行最多 140 字符
  printWidth: 140,
};
```

在根目录增加 .prettierignore 文件，内容如下：
```
# Package Manager
node_modules
pnpm-lock.yaml
package.json

# Bundle
coverage
dist

# docs
docs/

**/*.html
**/*.svg
**/*.md
*.lock

```

## lint-staged 实现增量检查

> lint-staged 包含一个可以执行任意 shell 任务的脚本，在执行脚本时以 暂存区 的文件列表作为参数，并支持按 glob 模式进行过滤。

一个新的项目，可以接受全量检查，但是对于很多大项目而言，全量检查的代码规范是无法落地的，存在以下问题：

- 项目体积过大，全量检查需要扫描的文件过多，导致检查花费的时间太多。如果这样的检查集成到了 CI 门禁中，将会大大降低构建效率。
- 项目历史有太多不规范的技术债，全量检查扫描出的问题过多，若要集成到 CI 门禁中，将使团队面临巨大的修改工作量和代码变更带来的风险。

为了让 Lint 检查能够在大多数情况下平滑地集成到项目中，我们需要实现增量检查。而 lint-staged 就适用于这样的场景。

首先我们安装 lint-staged：
```
$ pnpm add -w -D lint-staged
```

修改根目录下的 package.json，内容如下：

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm exec lint-staged --concurrent false",
    "commit-msg": "pnpm exec tsx scripts/verify-commit.ts $1"
  },
  "lint-staged": {
    "{apps,packages,scripts}/**/.{json,yaml,md}": [
      "prettier --write --cache --ignore-unknown"
    ],
    "{apps,packages,scripts}/**/.{ts?(x),js?(x)}": [
      "eslint --cache --fix"
    ],
    "{apps,packages}/**/.{css,html}": [
      "stylelint --cache --fix"
    ]
  }
}
```


## 实际步骤

Git Hook + lint-staged + Prettier + ESLint + Stylelint，组合来达到我们想要的结果，据体步聚如下：
1. 准备好待提交的代码
2. git add . 添加到暂存区
3. 执行 git commit
4. 注册在 git pre-commit 的钩子调起 lint-staged
5. lint-staged 取得所有被提交的文件依次执行写好的任务（ Prettier + ESLint + Stylelint）
6. 如果有错误（没通过 ESLint 检查）则停止任务，等待下次 commit，同时打印错误信息
7. 成功提交



<!--
参考：
  https://drylint.com/projectConfig/eslint/
  https://tech.meituan.com/2019/08/01/eslint-application-practice-in-medium-and-large-teams.html
-->
