

<template>
  <div>{{ count }}</div>
  <div> 666</div>
  <el-button type="primary">Primary</el-button>
  <el-button @click="addBtn" type="success">新增</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
<script setup lang="ts">
  import { computed } from 'vue'
  import {testStore} from '@/store/test/index'
  //获取store
  const store = testStore()
  //使用computed，返回一个响应式的count
  const count = computed(()=>{return store.getCount})
  //改变count的值
  const addBtn = ()=>{
    store.setCount(++store.count)
  }
</script>
