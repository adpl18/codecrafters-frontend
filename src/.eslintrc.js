module.exports = {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "react"
    ],
    "rules": {
      "testing-library/prefer-screen-queries": "off"
    },
    "ignorePatterns": ["test/**"] // Ignorar todos los archivos dentro de la carpeta 'test'
  };
  