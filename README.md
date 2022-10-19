![](https://github.com/orcastor/webapp/blob/master/demo.gif)

做了code split切chunk以优化并行下载pipeline，实际测试在3G弱网环境（chrome调试插件支持）下，最慢5秒可渲染出DOM，冷启动加载文件总大小低至1*0KB。
