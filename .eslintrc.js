module.exports = {
  extends: "airbnb-base",
  plugins: ["html"],
  rules: {
    "max-len": ["error", { code: 120 }],
    "quotes": ["error", "double"],
    "quote-props": ["error", "consistent"],
    "class-methods-use-this": 0,
    "prefer-destructuring": 0,
    "no-plusplus": 0,
    "no-mixed-operators": 0,
    "prefer-arrow-callback": ["error"],
    "prefer-rest-params": 0,
    "no-console": 0,
  },
  env: {
    "browser": true,
  },
  globals: {
    "log": true,
    "L": true,
    "Utils": true,
    "MAPDATA": true,
  },
};
