// pages/restaurant/restaurant.js
var GLOBAL_URL = 'http://localhost:3000'
GLOBAL_URL = 'https://dbfooddelivery-emolli.c9users.io'

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
    var that = this
    wx.request({
      url: GLOBAL_URL + '/restaurants',
        success: function(response) {
          var list = []
          for(var i = 0; i < response.data.length; i ++) {
            list.push(response.data[i])
          }
          that.setData({
            restaurants: list
          })
          console.log(that.data.restaurants);
        }
    });
  },
  selectRestaurant: function(item) {
    var that = this
    var index = item.currentTarget.dataset.index
    wx.navigateTo({
      url: '../dish/dish?license_id=' + that.data.restaurants[index].license_id,
    })  },

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
