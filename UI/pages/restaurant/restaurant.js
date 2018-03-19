// pages/restaurant/restaurant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    restaurants: [],
    phoneNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phoneNumber: options.phoneNumber,
    })
    var that = this
    wx.request({
        url: 'http://127.0.0.1:5000/',
        success: function(response) {
          var list = []
          for(var i = 0; i < response.data.list.length; i ++) {
            console.log(response.data.list[i]);
            list.push(response.data.list[i])
          }
          console.log(list);
          that.setData({
            restaurants: list
          })
          console.log(that.data.restaurants);
        }
    });

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
})
