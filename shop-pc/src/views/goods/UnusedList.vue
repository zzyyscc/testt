<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          placeholder="请输入商品名称"
          v-model="searchParm.goodsName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtn" icon="Search">搜索</el-button>
        <el-button @click="resetBtn" type="danger" plain icon="Close">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="image" label="商品图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.image"
            style="width: 100px; height: 60px"
            :src="scope.row.image.split(',')[0]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag
            type="danger"
            v-if="scope.row.type == '0'"
            size="default"
            effect="dark"
          >闲置</el-tag>
          <el-tag
            type="success"
            v-if="scope.row.type == '1'"
            size="default"
            effect="dark"
          >求购</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
      <el-table-column prop="goodsDesc" label="商品描述"></el-table-column>
      <el-table-column prop="userName" label="发布人"></el-table-column>
      <el-table-column prop="phone" label="发布人电话"></el-table-column>
      <el-table-column prop="wxNum" label="发布人微信"></el-table-column>
      <el-table-column prop="address" label="商品地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-switch v-model="scope.row.status"
            :active-value="'0'"
            :inactive-value="'1'"
            :before-change="beforeStatus"
            @change = "changeStatus(scope.row.status,scope.row.goodsId)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="setIndex" label="推荐首页">
        <template #default="scope">
          <el-switch v-model="scope.row.setIndex"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="beforeSetIndex"
            @change = "changeSetIndex(scope.row.setIndex,scope.row.goodsId)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sellStatus" label="出售状态">
        <template #default="scope">
          <el-tag
            type="danger"
            v-if="scope.row.sellStatus == '0'"
            size="default"
            effect="dark"
          >未出售</el-tag>
          <el-tag
            type="success"
            v-if="scope.row.sellStatus == '1'"
            size="default"
            effect="dark"
          >已出售</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="danger"
            icon="Delete"
            size="default"
            @click="deleteBtn(scope.row.goodsId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="searchParm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchParm.total"
      background
    >
    </el-pagination>
  </el-main>
</template>
<script setup lang="ts">
  import { onMounted, reactive, ref, nextTick } from "vue";
  import { getGoodsListApi ,upanddownApi,setIndexApi,deleteApi} from "@/api/goods/index";
  import useInstance from "../../hooks/useInstance";
import router from "../../router";
  //获取全局对象
  const {global} = useInstance()
  //搜索栏绑定对象
  const searchParm = reactive({
    currentPage: 1,
    pageSize: 10,
    goodsName: "",
    total: 0,
  });
  //表格数据
  const tableList = ref([]);
  //获取表格数据
  const getGoodsList = async () => {
    let res = await getGoodsListApi(searchParm);
    if (res && res.code == 200) {
      console.log(res);
      tableList.value = res.data.records;
      searchParm.total = res.data.total;
    }
  };
  //删除
  const deleteBtn = async(goodsId: string) => {
    console.log(goodsId);
    let confirm = await global.$myconfirm('确定删除吗？');
    if(confirm){
      let res = await deleteApi({
        goodsId:goodsId
      })
      if(res && res.code == 200){
        getGoodsList();
      }
    }
  };
  //页容量改变时触发
  const sizeChange = (size: number) => {
    searchParm.pageSize = size;
    getGoodsList();
  };
  //页数改变时触发
  const currentChange = (page: number) => {
    searchParm.currentPage = page;
    getGoodsList();
  };
  //重置
  const resetBtn = ()=>{
    searchParm.goodsName = '';
    getGoodsList();
  }
  //搜索
  const searchBtn = ()=>{
    getGoodsList();
  }

  //上架下架操作之间的提醒事件
  const beforeStatus = async()=>{
    let confirm = await global.$myconfirm('确定上下架吗？')
    return new Promise((resolve,reject)=>{
      if(confirm){
        return resolve(confirm)
      }else{
        return reject(confirm)
      }
    })
  }
  //上下架
  const changeStatus = async(type:string,goodsId:string)=>{
    console.log(type)
    console.log(goodsId)
    let res = await upanddownApi({
      goodsId:goodsId,
      status:type
    })
    if(res && res.code == 200){
      getGoodsList();
    }
  }

  //主页推荐操作之间的提醒事件
  const beforeSetIndex = async()=>{
    let confirm = await global.$myconfirm('确定更改推荐吗？')
    return new Promise((resolve,reject)=>{
      if(confirm){
        return resolve(confirm)
      }else{
        return reject(confirm)
      }
    })
  }
  //推荐首页
  const changeSetIndex = async(type:string,goodsId:string)=>{
    console.log(type)
    console.log(goodsId)
    let res = await setIndexApi({
      goodsId: goodsId,
      setIndex: type
    })
    if(res && res.code == 200){
      getGoodsList();
    }
  }
  //表格高度
  const tableHeight = ref(0);

  // 检查用户是否登录
  const checkSession = () => {
  const userid = sessionStorage.getItem('userid');
  if (!userid) {
    // 跳转到登录页面
    router.push({path:'/login'})
  }
  }
  onMounted(() => {
     checkSession(); // 检查 session
    getGoodsList();
    nextTick(() => {
      //计算表格高度
      tableHeight.value = window.innerHeight - 200;
    });
  });
</script>
<style scoped></style>
