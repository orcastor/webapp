![](https://github.com/orcastor/webapp/blob/master/demo.gif)

### 包体积优化：

- 首页减少依赖
  - AutoImport智能引用Element-Plus组件
  - Icons不再全部引入，减少了200+KB
  - CodeSplit切chunk以优化并行下载时间线
  - 冷启动加载总大小低至82KB（额外图片：背景33KB，logo 6.7KB）

- 优化结果
  - 3G弱网环境（Chrome调试插件开启节流器）：5.4秒可渲染出DOM，7.5秒完成加载（包括图片）
