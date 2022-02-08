(function(modules){
            function require(module){
                function pathRequire(relativePath){
                    return require(modules[module].rely[relativePath])
                }
                const exports = {};
                (function(require,exports,code){
                    eval(code) 
                })(pathRequire,exports,modules[module].code)
                return exports;
            }
            require('./src/index.js')
        })({"./src/index.js":{"rely":{"./a.js":"./src/a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nconsole.log('hello webpack' + _a.str);"},"./src/a.js":{"rely":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\nvar str = 'good';\nexports.str = str;"}})