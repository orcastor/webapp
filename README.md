![](https://github.com/orcastor/webapp/blob/master/demo.gif)

### 包体积优化：

- 首页尽量减少对外部包的依赖，使用AutoImport智能引用Element-Plus组件
- icon不再全部引入，减少了200+KB
- code split切chunk以优化并行下载pipeline
- 实际测试在3G弱网环境（chrome调试插件支持），最慢5秒可渲染出DOM
- 冷启动加载文件总大小低至100KB不到（背景图片额外100KB，logo额外17KB）
