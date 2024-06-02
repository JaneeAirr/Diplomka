module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    // отключение правила на длину строки
    'max-len': ['off'],
    // отключение правила на отступы
    'indent': ['off'],
    // отключение правила на использование кавычек
    'quotes': ['off'],
    // отключение правила на точки с запятой
    'semi': ['off'],
    // добавить другие правила по необходимости
  },

  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
