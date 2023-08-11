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
