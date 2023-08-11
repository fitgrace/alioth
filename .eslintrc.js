const path = require('node:path');
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  // 指定此配置为根级配置，eslint 不会继续向上层寻找
  root: true,

  // node 或者浏览器中的全局变量很多，如果我们一个个进行声明显得繁琐，因此就需要用到 env，这是对环境定义的一组全局变量的预设
  env: {
    es6: true,
    browser: true,
    node: true,
  },

  /**
   * extends 可以看做是去集成一个个配置方案的最佳实践
   * eslint 开头的 ESLint 官方扩展，有两个：eslint:recommended（推荐规范）和eslint:all（所有规范）。
   * plugin 开头的扩展是插件类型扩展
   * eslint-config 开头的来自npm包，使用时可以省略 eslint-config-
   * @开头的扩展,是在 npm 包上面加了一层作用域scope
   * 需要注意的是：多个扩展中有相同的规则，以后面引入的扩展中规则为准。
   */
  extends: ['airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],

  /**
   * 插件是一个 npm 包，通常输出规则。要确保这个包安装在 ESLint 能请求到的目录下。plugins属性值可以省略包名的前缀eslint-plugin-。
   * 插件一个主要的作用就是补充规则，比如eslint:recommended中没有有关react的规则，则需要另外导入规则插件eslint-plugin-react
   */
  plugins: ['react', 'babel', '@typescript-eslint/eslint-plugin'],

  // 指定 vue 解析器
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 通过 tsconfig 文件确定解析范围，这里需要绝对路径，否则子模块中 eslint 会出现异常
    project: path.resolve(__dirname, 'tsconfig.eslint.json'),

    /**
     * 你可以通过指定 sourceType 属性来指定你的代码要在哪种模式下运行。这个属性可以被设置为 "module"、"commonjs" 或 "script"。
     * 默认情况下，.js 和 .mjs 文件的 sourceType 是 "module"，而 .cjs 文件则是 "commonjs"
     */
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true, // enable JSX
    },
  },

  /**
   * 0 or 'off'：close rule(关闭规则)。
   * 1 or 'warn'：enable the rule，treat it as a warning(does not cause the program to fail) 并将其视为一个警告（不会导致程序失败)
   * 2 or 'error'：enable the rule, treat it as a bug (which will cause the program to fail if not fixed) 打开规则，并将其视为一个错误（如果不修复，将导致程序失败）
   */
  rules: {
    /**
     * 这个规则要求 React 组件文件的扩展名必须是 .js 或者 .jsx。如果你希望允许使用 .tsx 扩展名的 TypeScript 文件需要更改此规则
     */
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    /**
     * 该规则要求你在 React 组件中定义 propTypes 属性
     */
    'react/prop-types': 0,
    /**
     * 该规则要求你在 React 组件中定义 displayName 属性
     */
    'react/display-name': 0,
    /**
     * 是否允许target属性是blank
     */
    'react/jsx-no-target-blank': 0,
    /**
     * jsx遍历需要写key属性
     */
    'react/jsx-key': 1,
    /**
     * 该规则是针对 React 项目的，检查您是否使用了 findDOMNode 方法。该方法被认为是一种反模式
     */
    'react/no-find-dom-node': 0,
    /**
     * 该规则检查您在 JSX 属性中使用的引号类型是否符合指定的配置。
     */
    'jsx-quotes': [2, 'prefer-double'],

    /**
     * 该规则检查您是否在同一个文件中同时使用空格和制表符进行缩进。
     */
    'no-mixed-spaces-and-tabs': 2,
    /**
     * 该规则检查您是否使用制表符进行缩进
     */
    'no-tabs': 2,
    /**
     * 该规则检查您的代码行末尾是否存在多余的空格
     */
    'no-trailing-spaces': 2,
    /**
     * 该规则检查您在代码中使用的引号类型是否符合指定的配置。
     */
    quotes: [2, 'single'],
    /**
     * 单行长度不能超过140
     */
    'max-len': [0, { code: 140 }],
    /**
     * 该规则检查您在代码块前是否存在空格
     */
    'space-before-blocks': 2,
    /**
     * 该规则检查您在括号内是否存在空格。
     */
    'space-in-parens': 2,
    /**
     * 该规则检查您在操作符周围是否存在空格
     */
    'space-infix-ops': 2,
    /**
     * 该规则检查您的 TypeScript 函数是否显式指定了返回类型
     */
    '@typescript-eslint/explicit-function-return-type': 0,
    /**
     * 该规则检查您是否在 TypeScript 代码中使用了 any 类型
     */
    '@typescript-eslint/no-explicit-any': 0,
    /**
     * 该规则检查您是否在 TypeScript 代码中使用了非空断言操作符
     */
    '@typescript-eslint/no-non-null-assertion': 0,
    /**
     * 此规则不允许使用 // @ts-ignore 注释来抑制 TypeScript 错误
     */
    '@typescript-eslint/ban-ts-ignore': 0,
    /**
     * 此规则禁止在定义变量或函数之前使用它们。
     */
    '@typescript-eslint/no-use-before-define': 0,
    /**
     * 此规则对导出的函数和方法强制执行显式返回类型。
     */
    '@typescript-eslint/explicit-module-boundary-types': 0,
    /**
     * 它要求在函数中使用 return 语句时，要么总是返回一个值，要么总是不返回值
     */
    'consistent-return': 0,
    /**
     * 此规则不允许在变量和函数名称中使用悬挂下划线。
     */
    'no-underscore-dangle': 0,
    /**
     * 当一个模块只有一个导出时，此规则强制使用默认导出。
     */
    'import/prefer-default-export': 0,
    /**
     * 此规则强制在导入语句中使用文件扩展名
     */
    'import/extensions': 0,
    /**
     * 此规则不允许导入无法由配置的解析器解析的模块。
     */
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    /**
     * 此规则强制使用 camelcase 变量和函数命名约定
     */
    camelcase: 0,
    /**
     * 这条规则不允许使用一元运算符++和--
     */
    'no-plusplus': 0,
    /**
     * 此规则不允许重新分配函数参数
     */
    'no-param-reassign': 0,
    /**
     * 要求在模块顶部调用 require()
     */
    'global-require': 0,
    /**
     * 禁止在数组中使用数组索引作为 React 元素的 key 属性值
     */
    'react/no-array-index-key': 0,
    /**
     * 强制数组方法的回调函数中有 return 语句
     */
    'array-callback-return': 0,
    /**
     * 要求在 JSX 元素周围使用括号，以避免遇到自动插入分号的情况
     */
    'react/jsx-wrap-multilines': 0,
    /**
     * 要求命名的函数表达式。
     */
    'func-names': 0,
    /**
     * 要求在注释前有空白。
     */
    'spaced-comment': 0,
    /**
     * 禁止在循环中使用函数字面量。
     */
    'no-loop-func': 0,
    /**
     * 要求在可选的 props 上使用 defaultProps 属性。
     */
    'react/require-default-props': 0,
    /**
     * 建议在使用 props 和 state 时使用对象解构赋值。
     */
    'react/destructuring-assignment': 0,
    /**
     * 要求使用键盘事件处理程序代替 click 事件处理程序，以确保可访问性。
     */
    'jsx-a11y/click-events-have-key-events': 0,
    /**
     * 禁止非交互式元素上使用交互式事件处理程序，以确保可访问性。
     */
    'jsx-a11y/no-static-element-interactions': 0,
    /**
     * 要求在 JSX 中每行只包含一个表达式。
     */
    'react/jsx-one-expression-per-line': 0,
    /**
     * 建议在需要字符串连接时使用模板字面量
     */
    'prefer-template': 1,
    /**
     * 禁止在变量声明之前使用它们
     */
    'no-use-before-define': 0,
    /**
     * 禁止在非交互式元素上使用交互式事件处理程序，以确保可访问性。
     */
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    /**
     * 强制类方法使用 this。
     */
    'class-methods-use-this': 0,
    /**
     * 禁用位运算符。
     */
    'no-bitwise': 0,
    /**
     * 禁用 continue 语句。
     */
    'no-continue': 0,
    /**
     * 要求 a 元素具有内容
     */
    'jsx-a11y/anchor-has-content': 0,
    /**
     * 要求 a 元素的 href 属性有效
     */
    'jsx-a11y/anchor-is-valid': 0,
    /**
     * 禁止将 props 展开到组件中
     */
    'react/jsx-props-no-spreading': 0,
    /**
     * 要求 button 元素的 type 属性始终被声明
     */
    'react/button-has-type': 0,
    /**
     * 规定对象字面量中花括号换行格式的规则
     */
    'object-curly-newline': 0,
    /**
     * 用于检查代码中对象或数组字面量末尾是否存在额外的逗号
     */
    'comma-dangle': 0,
    /**
     * @zh 用于检查代码没有使用的变量
     * @en Check for unused variable
     */
    'no-unused-vars': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'no-shadow': 0,
    'function-paren-newline': 0,
    'react/default-props-match-prop-types': 0,
    'react/static-property-placement': 0,
    'react/jsx-no-bind': 0,
    'no-unused-expressions': 0,
    'no-nested-ternary': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/jsx-no-constructed-context-values': 0,
    'react/no-unescaped-entities': 0,
    'no-restricted-syntax': 0,
    'react/jsx-no-useless-fragment': 0,
  },

  // 文件级别的重写
  overrides: [
    // 对于 vite 和 vitest 的配置文件，不对 console.log 进行错误提示
    {
      files: ['**/vite.config.*', '**/vitest.config.*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
