
var GLOBAL_URL = 'http://localhost:3000'
GLOBAL_URL = 'https://dbfooddelivery-emolli.c9users.io'

// pages/users/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '5142455267',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  phoneNumberInput:function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  login: function() {
    var that = this
    wx.request({
        url: GLOBAL_URL + '/user/' + that.data.phoneNumber,
        
        success: function(response) {
          console.log(response.data.length == 0 )
          if (response.data.length == 0 ) {
            wx.showToast({
              title: 'user does not exisit',
              icon: 'loading',
              duration: 2000,
              mask: true
            })
            return
          }
          var phoneNumber = 'phoneNumber=' + response.data.cell_phone_number
          var name = '&name=' + response.data.name
          var balance_amount = '&balance_amount=' + response.data.balance_amount + ''
          console.log(response.data.balance_amount);
          wx.navigateTo({
            url: '../info/info?' + phoneNumber + name + balance_amount
          })
        }
    });

  },

  clear: function() {
    console.log(this.data.phoneNumber);
    this.setData({
      phoneNumber: '',
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
