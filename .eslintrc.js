module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jasmine": true,
    "node": true
  },
  "parser": "babel-eslint",
  "parserOptions": { "sourceType": "module"},
  "plugins": ["jasmine", "react"],
  "extends": ["eslint:recommended", "plugin:jasmine/recommended"],
  "ecmaFeatures": { "jsx": true },
  "rules": {
    "indent": [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    "quotes": [ "warn", "single" ],
    "semi": [ "warn", "never" ],
    "no-unused-vars": [ "warn" ],
    "jasmine/no-focused-tests": 0,
    "jasmine/new-line-before-expect": 0,
    "jasmine/no-suite-dupes": 0,
    "jasmine/no-spec-dupes": 0,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/react-in-jsx-scope": 2
  },
  globals: {
    "React": true,
    "_": true,
    "Adapters": true,
    "Calculator": true,
    "Constants": true,
    "Models": true,
    "Services": true
  }
};
