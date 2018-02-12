## 实现npm插件vue-toast-m实例练习

npm插件原地址： [https://www.npmjs.com/package/vue-toast-m](https://www.npmjs.com/package/vue-toast-m)


```javascript
|-- lib
    |-- index.js  --// 入口文件
    |-- vue-toast.vue
|-- readme文件夹 --// 放置README.md说明文件的图片，项目中可删除的
|-- index.html  --// 静态文件
|-- package.json

```

#### 一、新建vue-toast-demo文件夹

```javascript
cd vue-toast-demo   // 进入文件夹
npm init  // 初始化npm,生成package.json

```
输入npm init之后<br>
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
#### 二、编写静态页面 
vue-toast-demo文件夹下建立index.html静态页面

![image](https://github.com/ccyinghua/vue-toast-demo/blob/master/readme/2.jpg?raw=true)

#### 三、插件功能实现
vue-toast-demo/lib/vue-toast.vue组件页面，将静态文件搬到vue文件中

```html
<template>
    <section class="toast-container">
        <div class="toast">
            <span>{{message}}</span>
        </div>
    </section>
</template>

<script>
export default{
    data(){
        return {
            message:"hello,Toast"
        }
    }
}
</script>

<style scoped lang="scss">
    ......
</style>

```
lib/index.js入口文件

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
        // 配置覆盖
        if(typeof option == 'object'){
            for(var key in option){
                opt[key] = option[key];
            }
        }

        // 用Vue.extend()继承ToastComponent组件，构成一个ToastController实例
        const ToastController = Vue.extend(ToastComponent);

        //new ToastController()相当于一个新的Vue对象
        //这个对象挂载到空的div里面，类似于vue组件中 var vm = new Vue({ data:{} ... }).$mount("#app")功能
        var instance = new ToastController().$mount(document.createElement("div"));

        instance.message = message;
        instance.visible = true;

        setTimeout(()=>{
            instance.visible = false;
            document.body.removeChild(instance.$el);
        }, opt.duration)
    }

    Vue.prototype.$toast['show'] = function(message,option){
         Vue.prototype.$toast(message,option);
    }
    Vue.prototype.$toast['success'] = function(message,option){
         Vue.prototype.$toast(message,option);
    }
    Vue.prototype.$toast['info'] = function(message,option){
         Vue.prototype.$toast(message,option);
    }
    Vue.prototype.$toast['error'] = function(message,option){
         Vue.prototype.$toast(message,option);
    }
}

// 导出
export default Toast;

```

未完待续.....















