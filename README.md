## 实现npm插件vue-toast-m实例练习

npm插件原地址： [https://www.npmjs.com/package/vue-toast-m](https://www.npmjs.com/package/vue-toast-m) <br>
webpack官网：[https://webpack.js.org/](https://webpack.js.org/)

```javascript
|-- readme文件夹 --// 放置README.md说明文件的图片，项目中可删除的
    |-- index.html --// 静态文件备份
|-- src
    |-- lib
        |-- index.js  --// 入口文件
        |-- vue-toast.vue
    |-- index.html  -- // 静态文件
|-- .babelrc
|-- package.json
|-- webpack.config.js --// 配置文件
```

### 一、新建vue-toast-demo文件夹

```javascript
cd vue-toast-demo   // 进入文件夹
npm init  // 初始化npm,生成package.json

```
输入npm init之后生成package.json<br>
![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/1.jpg?raw=true)

package.json

```javascript
{
  "name": "vue-toast-demo",
  "version": "1.0.0",   // 版本
  "description": "a toast plugin for mobile",
  "main": "index.js",   // 入口文件
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {   // github
    "type": "git",
    "url": "git+https://github.com/ccyinghua/vue-toast-demo.git"
  },
  "keywords": [    // 关键词
    "toast",
    "vue-toast"
  ],
  "author": "ccyinghua",  // 作者
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ccyinghua/vue-toast-demo/issues"
  },
  "homepage": "https://github.com/ccyinghua/vue-toast-demo#readme"
}
```
### 二、编写静态页面 
vue-toast-demo/src文件夹下建立index.html静态页面(readme备份一份)

![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/2.jpg?raw=true)

### 三、插件功能实现
vue-toast-demo/src/lib/vue-toast.vue组件页面，将静态文件搬到vue文件中

```html
<template>
    <section class="toast-container">
        <div class="toast" v-bind:class="[visible?'fade-in':'fade-out']">
            <span>{{message}}</span>
        </div>
    </section>
</template>

<script>
export default{
    data(){
        return {
            message:'',
            visible:false
        }
    }
}
</script>

<style scoped lang="scss">
    ......
</style>

```
src/lib/index.js入口文件

```javascript
// 入口文件
import ToastComponent from './vue-toast.vue'

let Toast = {}
Toast.install = function(Vue,options){   // 必须定义一个install方法，才可以在使用时Vue.use()
    // 默认配置
    var opt = {
        duration:3000
    }

    // 用户配置覆盖默认配置
    for(var key in options){
        opt[key] = options[key];
    }

    // 在vue的原型上面拓展一个$toast函数
    Vue.prototype.$toast = function(message,option){
        let callback = '';
        // 配置覆盖,设置局部配置
        if(typeof option == 'object'){
            for(var key in option){
                opt[key] = option[key];
            }
        }else if(typeof option == 'function'){
            callback = option;
        }

        // 用Vue.extend()继承ToastComponent组件，构成一个ToastController实例
        const ToastController = Vue.extend(ToastComponent);

        //new ToastController()相当于一个新的Vue对象
        //这个对象挂载到空的div里面，类似于vue组件中 var vm = new Vue({ data:{} ... }).$mount("#app")功能
        var instance = new ToastController().$mount(document.createElement("div"));

        instance.message = message;
        instance.visible = true;

        document.body.appendChild(instance.$el);

        setTimeout(()=>{
            instance.visible = false;
            setTimeout(()=>{
                document.body.removeChild(instance.$el);
                callback && callback();
            },500)
        }, opt.duration)
    };

    // Vue.prototype.$toast['show'] = function(message,option){
    //      Vue.prototype.$toast(message,option);
    // }
    // Vue.prototype.$toast['success'] = function(message,option){
    //      Vue.prototype.$toast(message,option);
    // }
    // Vue.prototype.$toast['info'] = function(message,option){
    //      Vue.prototype.$toast(message,option);
    // }
    // Vue.prototype.$toast['error'] = function(message,option){
    //      Vue.prototype.$toast(message,option);
    // }

    // 简化上面代码
    ['show','success','info','error'].forEach(function(type){
        Vue.prototype.$toast[type] = function(message,option){
            return Vue.prototype.$toast(message,option);
        }
    });

}

// if(window.Vue){
//     Vue.use(Toast);
// }

if(typeof window !== 'undefined' && window.Vue){
    window.Vue.use(Toast);
}

// 导出
export default Toast;

```

### 四、webpack打包功能实现

> ##### webpack准备

```javascript
cnpm install webpack --save // 安装webpack
            
```

vue
```javascript
cnpm install --save vue-template-compiler vue-loader 

```

支持es6  [http://babeljs.io/](http://babeljs.io/) 安装`babel-preset-env`后要建立`.babelrc`文件写配置
```javascript
cnpm install --save babel-core babel-loader babel-preset-env // babel-core是es6核心的文件，一定要有

```

> ##### 新建webpack.config.js配置文件

```javascript
var path = require('path');

module.exports = {
    entry: './src/lib/index.js',  // 入口
    output: {
        // path:'./dist',   // 指定输出路径
        path:path.join(__dirname,'./dist'),   // 必须是绝对路径
        filename: 'vue-toast-demo.js'   // 插件的名字
    },

    module:{  // module模块；解析一些webpack不认识的文件
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            }
        ]
    },
    // js文件的合并，HTML的生成，插件等等
    plugins:[
        .....
    ]
};
```

> ##### 打包命令

```javascript
webpack  // 如果文件不叫webpack.config.js   webpack --config ...

```
如果成功会生成dist/vue-toast-demo.js文件，如果报错根据报错提示安装缺少的插件等<br>
![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/3.jpg)<br>
比如上图就是缺少`vue-template-compiler`插件，安装一下就行<br>
![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/4.jpg)<br>
上图是缺少处理css样式的，`vue-toast.vue`是用sass处理样式<br>
安装sass
```javascript
cnpm install node-sass sass-loader --save  // sass-loader依赖于node-sass
cnpm install css-loader style-loader --save
```
> ##### webpack.config.js详细配置

安装了各插件后还需配置

```javascript
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
        ......
    ]
};

```
> ##### src/index.html修改


```
cnpm install vue --save  // 安装vue
```


```html
<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script type="text/javascript" src="../node_modules/vue/dist/vue.js"></script>
<script type="text/javascript" src="../dist/vue-toast-demo.js"></script>

<div id="app" class="text-center">
    <h2>vue-toast for mibile</h2>
    <div class="form-group row">
        <a class="btn btn-primary" href="javascript:;" @click="toast">默认toast</a>
    </div>
    <div class="form-group row">
        <a class="btn btn-info" href="javascript:;" @click="toast2">5秒后关闭toast</a>
    </div>
    <div class="form-group row">
        <a class="btn btn-success" href="javascript:;" @click="toast3">关闭toast后，执行回调</a>
    </div>
</div>
<script type="text/javascript">
    new Vue({
        el:"#app",
        methods:{
            toast:function(){
                this.$toast.show("当前点击了标签");
            },
            toast2:function(){
                this.$toast.show("当前点击了标签",{
                    duration:5000
                });
            },
            toast3:function(){
                this.$toast.show("当前点击了标签",function(){
                    alert("这里是回掉函数")
                });
            }
        }
    })
</script>

```
执行打包命令后运行index.html

![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/5.jpg)<br>

未完待续.....















