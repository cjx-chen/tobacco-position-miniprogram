Component({
  options: {
    addGlobalClass: true, // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面
  },

  /** 组件的属性列表 */
  properties: {},

  /** 组件的初始数据 */
  data: {},

  /** 组件的生命周期 */
  lifetimes: {
    /**
     * 在组件实例刚刚被创建时执行
     */
    created() {},
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached() {},
    /**
     * 在组件在视图层布局完成后执行
     */
    ready() {},
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached() {},
  },

  /** 组件的方法列表 */
  methods: {},
});
