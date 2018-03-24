// pages/users/user.js
var GLOBAL_URL = 'http://localhost:3000'
GLOBAL_URL = 'https://dbfooddelivery-emolli.c9users.io'
Page({

  /**
   * 页面的初始数据
   */
   data: {
     cell_phone_number: '',
     name: '',
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  phoneNumberInput:function (e) {
    this.setData({
      cell_phone_number: e.detail.value
    })
  },

  userNameInput:function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  register: function() {
    // TODO: register user
    var that = this
    console.log(this.data);
    wx.request({
        url: GLOBAL_URL + '/user/',
        method: "POST",
        data: that.data,
        success: function(response) {
          var phoneNumber = 'phoneNumber=' + response.data.cell_phone_number
          var name = '&name=' + response.data.name
          var balance_amount = '&balance_amount=' + response.data.balance_amount + ''
          wx.navigateTo({
            url: '../info/info?' + phoneNumber + name + balance_amount
          })
        }
    })

  },

  clear: function() {
    console.log(this.data.userName);
    console.log(this.data.phoneNumber);
    this.setData({
      userName: '',
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
