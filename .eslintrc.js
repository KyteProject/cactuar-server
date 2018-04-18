module.exports = {
    "extends": "airbnb",
    "rules": {
        "no-console": "off",
        "indent": [
          "error",
          2,
          {
            "SwitchCase": 1
          }
        ],
        "linebreak-style": [
          "error",
          "unix"
        ],
        "quotes": [
          "warn",
          "single"
        ],
        "semi": [
          "warn",
          "always"
        ],
        "keyword-spacing": [
          "error", {
            "before": true,
            "after": true
          }
        ],
        "space-before-blocks": [
          "error", {
            "functions":"always",
            "keywords": "always",
            "classes": "always"
          }
        ],
        "space-before-function-paren": [
          "error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
          }
        ],
        "prefer-const": [
          "error", {
            "destructuring": "all",
            "ignoreReadBeforeAssign": false
          }
        ]
      }  
};

    // "extends": "eslint:recommended",