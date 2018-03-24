// pages/review/review.js
var GLOBAL_URL = 'http://localhost:3000'
GLOBAL_URL = 'https://dbfooddelivery-emolli.c9users.io'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.oid);
    console.log(options.license_id);
    this.setData({
      oid: options.oid,
      license_id: options.license_id,
    })
  },

  slideChange: function(e) {
    var value = e.detail.value
    this.setData({
      rating: value,
    })
  },

  bindFormSubmit: function(e) {
    this.setData({
      comment: e.detail.value.textarea
    })
    if(this.data.rating == null) {
      this.setData({
        rating: 1
      })
    }
    var that = this
    wx.request({
        url: GLOBAL_URL + '/orders/review/',
        method: "POST",
        data: that.data,
        success: function(response) {
          console.log(response.data);
          that.setData({
            feedback: JSON.stringify(response.data)
          })
        }
    })

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
