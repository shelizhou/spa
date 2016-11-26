#文件规范

### 如何使用

* 安装nodejs、npm

* 执行：npm install

* 执行：node server.js
 
### 构建相关文件

* buildweb

* node_modules,package.json (nodejs模块依赖)

* file.js、gulpfile.js

* server.js (构建主入口)

### 源代码工程

* src:

    * main 模块化的js,包括框架、业务、插件等（详情请看js规范）

    * staic 样式资源 （详情请看样式规范）
        * img 所有图片都放在这里

        * iconfont 字体图标资源

        * js 项目依赖非模块的js资源，现只有requirejs和zepto

        * sass sass文件

    * topic 专题独立页面

### 构建后的工程

* dist
