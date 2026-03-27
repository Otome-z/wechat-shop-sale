import uniHelper from '@uni-helper/eslint-config'

export default uniHelper(
  {
    rules: {
      'style/quotes': 'off',
      'style/semi': 'off',
      'style/brace-style': 'off',
      'style/quote-props': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
)
