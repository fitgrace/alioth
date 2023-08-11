module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],

  plugins: ['stylelint-stylistic'],

  rules: {
    // 禁止空块
    'block-no-empty': null,
  },
};
