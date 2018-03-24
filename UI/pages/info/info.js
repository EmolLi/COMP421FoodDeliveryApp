// pages/info/info.js
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
    this.setData({
      phoneNumber: options.phoneNumber,
      name: options.name,
      balance_amount: options.balance_amount,
    })
    console.log(this.data);

    var that = this
    wx.request({
        url: GLOBAL_URL + '/orders/' + that.data.phoneNumber,
        success: function(response) {
          

          var order_history = []
          for(var key in response.data) {
            console.log(response.data[key])
            var entry = response.data[key]
            var dishesInfo = JSON.stringify(entry.dishes)
            console.log(dishesInfo);

            entry.dishes = dishesInfo
            entry.oid = key
            order_history.push(response.data[key])
          }
          that.setData({
            orderHistoryList: order_history
          })
          console.log(that.data.orderHistoryList);
        },
        fail: function(response) {
          
        }
    })

  },

  updateReview: function(item) {
    var index = item.currentTarget.dataset.index
    var payload='oid=' + this.data.orderHistoryList[index].oid + "&license_id=" + this.data.orderHistoryList[index].restaurant
    wx.navigateTo({
      url: '../review/review?' + payload,
    })
  },

  listRestaurant: function() {
    wx.navigateTo({
      url: '../restaurant/restaurant',
    })
  },

  balanceInput:function (e) {
    this.setData({
      amount_to_add: e.detail.value
    })
  },

  updateBalance: function() {
    console.log(this.data.amount_to_add);
    var payload = {
      'cell_phone_number': this.data.phoneNumber,
      'balance_add_amount': this.data.amount_to_add
    }
    var that = this
    wx.request({
      url: GLOBAL_URL + '/user/addBalance/',
        method: "POST",
        data: payload,
        success: function(response) {
          console.log(response.data);
          if (response.data.error != null) {
            wx.showToast({
              title: response.data.error,
              icon: 'loading',
              duration: 2000,
              mask: true
            })
            return
          }
          that.setData({
            balance_amount: response.data.new_amount
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
    var that = this
    wx.request({
      url: GLOBAL_URL + '/orders/' + that.data.phoneNumber,
        success: function(response) {
          console.log(response.data);
          var order_history = []
          for(var key in response.data) {
            console.log(response.data[key])
            var entry = response.data[key]
            var dishesInfo = JSON.stringify(entry.dishes)
            console.log(dishesInfo);

            entry.dishes = dishesInfo
            entry.oid = key
            order_history.push(response.data[key])
          }
          that.setData({
            orderHistoryList: order_history
          })
          console.log(that.data.orderHistoryList);
        }
    })
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
    var that = this
    wx.request({
        url: GLOBAL_URL + '/orders/' + that.data.phoneNumber,
        success: function(response) {
          console.log(response.data);
          var order_history = []
          for(var key in response.data) {
            console.log(response.data[key])
            var entry = response.data[key]
            var dishesInfo = JSON.stringify(entry.dishes)
            console.log(dishesInfo);

            entry.dishes = dishesInfo
            entry.oid = key
            order_history.push(response.data[key])
          }
          that.setData({
            orderHistoryList: order_history
          })
          console.log(that.data.orderHistoryList);
        }
    })
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
