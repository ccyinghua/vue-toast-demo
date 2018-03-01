var path = require('path');

module.exports = {
    entry: './src/lib/index.js',  // 入口
    output: {
        // path:'./dist',   // 指定输出路径
        path:path.join(__dirname,'./dist'),   // 必须是绝对路径
        filename: 'vue-toast-demo.js',   // 插件的名字
        libraryTarget:'umd',   // 输出的文件格式,umd可适用各种规范(cmd/amd/commonjs...)
        library:'VueToastDemo'  // 输出的文件库的名字
    },

    module:{  // module模块；解析一些webpack不认识的文件
        // 放加载器
        rules:[
            {
                test:/\.vue$/,   // 处理vue文件
                loader:'vue-loader',
                exclude:/node_modules/,
                options:{    // 解析vue文件中一些其他的语法
                    loaders:{
                        scss:'style-loader!css-loader!sass-loader'  // loader解析从右到左，先用sass-loader处理成css，再用css-loader进行处理,再用style-loader插入到HTML中
                    }
                }
            },
            {
                test:/\.js$/,   // 处理js文件
                loader:'babel-loader',
                include:path.join(__dirname,'src'),  // 指定目录解析
                exclude:/node_modules/    // 过滤掉node_modules文件夹
            }
        ]
    },

    // js文件的合并，HTML的生成，插件等等
    plugins:[

    ]
};

