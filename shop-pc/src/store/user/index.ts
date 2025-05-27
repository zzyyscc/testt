import { defineStore } from "pinia";
//创建store
//defineStore第一个参数是唯一的，不能重复
//这里就是一个全局共享数据，与微信小程序中的Store类似，具有管程的效果
export const userStore = defineStore('userStore', {
  state: () => {
    return {
      userId: '',
      nickName: ''
    }
  },
  //获取值
  getters: {
    getUserId(state) {
      return state.userId
    }
  },
  //改变state的值 
  actions: {
    setUserId(userId: string) {
      this.userId = userId;
    }
  }
})