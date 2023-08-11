# Git 提交规范

规范的 Commit message 有很多好处：
- 方便快速浏览查找，回溯之前的工作内容
- 可以直接从commit 生成Change log(发布时用于说明版本差异)

为了实现规范，当执行 git commit 时可以在对应的 git 钩子上做校验，只有符合格式的 Commit message 才能提交成功。

## picocolors
picocolors，包的作用是修改控制台中字符串的样式，包括：
- 字体样式(加粗、隐藏等)
- 字体颜色
- 背景颜色

```bash
# 安装
$ pnpm add -w -D picocolors
```

为什么选择 picocolors：
* 无依赖包；
* 比 chalk 体积小 14 倍，速度快 2 倍；
* 支持 CJS 和 ESM 项目

新建 scripts/verify-commit.ts，内容如下：

```javascript
import { readFile } from 'fs/promises';
import pc from 'picocolors';

async function main() {
  // get $1 from commit-msg script
  const msgPath = process.argv[2];
  const msg = (await readFile(msgPath, 'utf-8')).trim();

  /**
   * 校验提交信息格式
   * 示例：feat(compiler): add comments option
   *   - type must be one of [feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, types，workflow
   *   - 括号+冒号+空格 (括号内一般描述修改模块的名称)
   *   - 输入一些描述信息
   */
  const commitRE = /^(revert: )?(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|types|workflow)(\(.+\))?: .{1,50}/;

  if (!commitRE.test(msg)) {
    console.log();
    console.error(
      `  ${pc.bgRed(pc.white(' ERROR '))} ${pc.red('invalid commit message format.')}\n\n${pc.red(
        '  Proper commit message format is required for automated changelog generation.\n\n'
      )}  ${pc.green('Examples: feat(compiler): add \'comments\' option')}\n` +
        `  ${pc.green(
          '  - type must be one of [feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, types，workflow]'
        )}\n` +
        `  ${pc.green('  - subject must not be longer than 50 characters')}\n` +
        `  ${pc.green('  - subject may not be empty')}\n`
    );
    process.exit(1);
  }
}

main();
```

## simple-git-hooks

对 git 的使用只有 hook 的话，没有必要去安装 husky，只需要安装更加简便的 simple-git-hooks 即可
```
$ pnpm add -w -D tsx simple-git-hooks
```

在根目录下的 package.json 文件增加配置，内容如下：

```json
{
  "scripts": {
    ...
    "postinstall": "simple-git-hooks"
  },
  "simple-git-hooks": {
    "commit-msg": "pnpm exec tsx scripts/verify-commit.ts $1"
  }
}
```

大功告成，试探性操做：

```
$ git commit -m 'test'
```

