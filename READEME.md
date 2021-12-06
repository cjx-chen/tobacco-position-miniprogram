## 使用
1. 执行npm install下载依赖包
2. 执行npm run dev 
3. 将生成的dist目录下的文件用微信开发者工具打开，可以实时查看效果
4. ui组件库使用vant，引入例子参考app.json

# 注意事项

1，除继承样式外， app.wxss 中的样式、组件所在页面的的样式对自定义组件无效。
参考文档：https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html

为了使组件能使用全局样式，需要设置：
```js
Component({
  options: {
    addGlobalClass: true,
  }
})
```
此时表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；

⚠️⚠️⚠️注意：

因为页面的样式会影响到组件，所以page,component的根class必须按照组件名称来命名。
<br/>
<br/>

2，使用slot的时候，如果slot设置了name，例如：<slot name="left">,此时，需要在组件中设置：
```js
options: {
  multipleSlots: true,
}
```

3，miniprogram-computed使用

参考文档：https://github.com/wechat-miniprogram/computed
<br/>
<br/>

4，mobx-miniprogram使用，参考文档：

https://github.com/wechat-miniprogram/mobx-miniprogram-bindings
