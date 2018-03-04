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













