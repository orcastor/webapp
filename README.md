![](https://github.com/orcastor/webapp/blob/master/demo.gif)

### 包体积优化：

- 首页尽量减少对外部包的依赖
  - AutoImport智能引用Element-Plus组件
  - icon不再全部引入，减少了200+KB
  - code split：切chunk以优化并行下载pipeline
  - 冷启动加载总大小低至82KB（额外图片：背景33KB，logo 6.7KB）
  - 3G弱网环境（chrome调试），5.4秒可渲染出DOM，完成加载7.5秒（包括图片）
