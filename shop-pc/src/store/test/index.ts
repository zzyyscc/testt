import { defineStore } from "pinia";
//创建store
//defineStore第一个参数是唯一的，不能重复
//这里就是一个全局共享数据，与微信小程序中的Store类似，具有管程的效果
export const testStore = defineStore('testStore', {
  state: () => {
    return {
      count: 0
    }
  },
  //获取值
  getters: {
    getCount(state) {
      return state.count
    }
  },
  //改变state的值 
  actions: {
    setCount(count: number) {
      this.count = count;
    }
  }
})