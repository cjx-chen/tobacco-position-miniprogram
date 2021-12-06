// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
    // list: [
    //   {
    //     licenceId: '440118102676',
    //     storeName: '广州市增城陈雨玲商店',
    //     address: '正果镇中心小学南(正果大道东)',
    //     head: '陈小玲',
    //     phone: '15089469522',
    //     schoolName: '乐怡幼儿园',
    //     distance: 74,
    //     longitude: '113.894517', // 经度
    //     latitude: '23.415712' // 纬度
    //   },
    //   {
    //     licenceId: '440118106107',
    //     storeName: '广州市增城泰继丰商店',
    //     address: '广州市增城区派潭镇榕林路67号',
    //     head: '陈泰锋',
    //     phone: '13392621128',
    //     schoolName: '派潭中学-西门',
    //     distance: 62,
    //     longitude: '113.783280', // 经度
    //     latitude: '23.488084' // 纬度
    //   }
    // ]
  },

  /**
   * 获取输入的经度
   * @param {*} event
   */
  readLongitude: function (event) {
    console.log(event.detail);
    const that = this;
    that.setData({
      longitude: event.detail
    });
  },

  /**
 * 获取输入的纬度
 * @param {*} event
 */
  readLatitude: function (event) {
    console.log(event.detail);
    const that = this;
    that.setData({
      latitude: event.detail
    });
  },

  /**
   * 查询
   */
  getResult: function () {
    const that = this;
    const longitude = that.data.longitude;
    const latitude = that.data.latitude;
    // 发起网络请求
    wx.request({
      url: 'https://superting.cn:8033/showLocation',
      method: 'get',
      data: {
        lng: longitude,
        lat: latitude
        
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          // console.log('信息获取成功！', res.data.message);
          const Datas = res.data;
          console.log('Datas', Datas);
          that.setData({
            list: Datas
          });
        } else {
          wx.showToast({
            title: '信息获取失败！', // 提示的内容,
            icon: 'none', // 图标,
            duration: 2000, // 延迟时间,
            mask: true, // 显示透明蒙层，防止触摸穿透,
            success: res => { }
          });
          console.log('信息获取失败！', res.data.message);
        }
      },
      complete: (msg) => {
        wx.hideLoading();
      },
      fail: (msg) => {
        wx.hideLoading();
        console.log(msg);
      }
    });
  },

  /**
   * 进入详情页
   * @param {*} options
   */
  gotoDetail: function (options) {
    // console.log(options);
    // console.log(options.currentTarget.dataset.item);
    const item = JSON.stringify(options.currentTarget.dataset.item);
    wx.navigateTo({
      url: `../detail/detail?list=${item}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getResult();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
