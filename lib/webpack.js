
const fs = require('fs')
const path =require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const {transformFromAst} = require('@babel/core')


module.exports= class Webpack{
    constructor(options){
        const {entry, output} = options
        this.entry = entry;
        this.output = output;
        this.module = [];
    }
    run(){
        const info = this.parse(this.entry)
        this.module.push(info)

        for(var i = 0; i< this.module.length; i++){
            const item = this.module[i]

            const {rely} = item;

            if(rely){
                for(let j in rely){
                    this.module.push(this.parse(rely[j]))
                }
            }
        }

        //数据结构转换 arr-> object
        const obj = {};
        this.module.forEach(item => {
            obj[item.entryFile] = {
                rely:item.rely,
                code: item.code
            }
        })

        this.file(obj)

    }
    parse(entryFile){
        const content = fs.readFileSync(entryFile,'utf-8')
        const ast = parser.parse(content,{sourceType:'module'})

        const dirname = path.dirname(entryFile)
        const rely = {}
        traverse(ast,{
            ImportDeclaration:(({node}) => {
                const newPathName = './'+path.join(dirname,node.source.value)
                rely[node.source.value] = newPathName
            })
        })

        const { code } = transformFromAst(ast,null,{
            presets:['@babel/preset-env']
        })

        return {
            entryFile,
            rely,
            code
        }

    }

    file(code){
         // 生成文件，放入dist目录
         const filePath = path.join(this.output.path, this.output.filename)

        // 生成bundle内容
        // webpackBootstrap

        const newCode = JSON.stringify(code)
        const bundle = `(function(modules){
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
            require('${this.entry}')
        })(${newCode})`

        fs.writeFileSync(filePath,bundle,'utf-8')
    }
}