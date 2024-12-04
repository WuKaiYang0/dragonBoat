// @ts-nocheck
const eslint = require('eslint-plugin-vue')
const tsEslint = require('typescript-eslint')
const eslintConfigPrettier = require('eslint-config-prettier')
module.exports = [
  ...eslint.configs['flat/strongly-recommended'],
  tsEslint.config,
  //关闭所有与prettier规则冲突的Eslint规则
  eslintConfigPrettier,
  {}
]
