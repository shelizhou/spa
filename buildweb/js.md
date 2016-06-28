#js规范

### 框架规范

* 单页面，只有一个入口index.html

* 框架全局依赖zepto、requirejs


### 文件说明

* static/js： 放zeptp、requirejs，head.js 一般不会变动

* main
    * index.js，pages.js，kload.js 框架层js

    * common/ 公用模块

        * modules.js 常用大模块（modules/下面的合集） (不常改动)

        * vue.js、template.js 是插件的过度，因需要添公用的东西  (不常改动)

        * config.js 业务配置

        * method.js 业务常用方法


    * pages/ 页面模块

        * xxx/index.html

        * xxx/index.js

    * plugins/ 第三方依赖的模块化插件

        * defer   https://github.com/shelizhou/defer

        * vue  http://cn.vuejs.org/guide/

        * artTemplate(使用<%%>语法) http://aui.github.io/artTemplate/


### 页面模块

* 每添加一个页面模块，需要到config.js配置，并且以文件名作为该模块的唯一标志，文件夹里面放置index.html和index.js

* index.js会抛出三个方法

    * init 第一次进入页面执行，只执行一次。(参数$p表示该模块的html节点, parms表示url接收过来的参数?)

    * active 每次进入页面都会执行 (参数同上)

    * deactive 离开页面会执行


### 常用方法

* 框架kload 有 load, back方法，或者用下面的方法

    * 标签跳转 <div class="J__load" data-page="index"></div>

    * 标签返回 <div class="J__back">返回</div>

* method

    * METHOD.ajax，返回defer

    * METHOD.alert("xxx")， 提示

    * METHOD.loading.show(), METHOD.loading.hide()， 菊花图

* modules

    * dialog 弹出框，具体可看temp里面怎么写

    * scroll 分页加载，具体可看temp里面怎么写

    * tab tab页，具体可看temp里面怎么写
