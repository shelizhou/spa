#样式规范

### 设计稿

* 宽高度：750px * 1254px（ip6 plus大小）

* 采用rem布局，所有的大小都不能用px值（除了字体大小)，页面宽度分为10个rem

* 扁平化设计，采用iconfont，少用图片

### 命名规范

* 一切用*class*写样式，除需要特殊情况可用id

* *单行*编写css，表示继承关系需换行

* *_*单下划线隔开命名

* 与js相关的采用*J_*开头命名

### 需注意

* 不管html或css引用图片的时候应该使用*绝对路径*(即是用/开头)

* \_xxx.scss   *_*开头的表示不会被编译生成


### sass结构

* frameset.scss 框架的样式,还有一些首屏需要立即显示的样式(小文件)

* main.scss 所有其它的样式

* _base.scss reset样式
    - 以*m_*开头

* _config.scss 配置变量

* _method.scss 公用方法(包括mixin和function)

* _modules.scss 常用公用模块（蒙板、弹出框等）
    - 以*m_*开头

* _iconfont.scss 字体图标
    - 以*icon-*开头

* pages/_xxx.scss 自定义业务模块
    - 以*p_*开头

### 框架命名的

* 样式的class以 *s_* 开头，例如：s\_wrap，s\_page，s\_menu

* 与js相关的以 *J__* 开头，例如：J\_\_wrap， J\_\_pages， J\_\_page， J\_\_m\_loading，J\_\_load，J\_\_back，J\_\_menu


### 一些常用方法

* rem() px转换为rem值

* @include box()、flex() 弹性布局

* @include box-sizing() 盒子模型

* @include transform(translate(100px,200px)); 变形

* @include transition(all 0.3s ease-in); 过度

* @include animation(animationName 0.5s forwards ease-in 0s 1 normal); 指定动画

* @include keyframes(animationName) { 0% { background-color: #ffccf2; } } 定义动画

* @include boxalign(both/x/y); 局中
* @include transalign(both/x/y); 局中

* @include notSelect(); 禁止长按字体选中

### 一些常用class

* .on (无样式)，表示状态，常被模块继承复写

* .none 隐藏 display:none;

* .clearfix 清楚浮动

* .tc .tl .tr text-align

* .fl .fr 浮动

* .m\_box .m\_box\_v .m\_flex1

* .m_over 垂直滚动

* .m_text 字体溢出
