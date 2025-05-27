<template>
  <el-main>
    <!-- Main content -->
    <el-form :model="searchParm" :inline="true" size="default">
    <el-form-item>
      <el-input aria-placeholder="请输入分类名称" v-model="searchParm.categoryName"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="Search" @click="searchBtn">搜索</el-button>
      <el-button icon="Close"  @click="resetBtn" type="danger" plain>重置</el-button>
      <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
    </el-form-item>
    </el-form>
      <!-- 表格 -->
      <el-table :height="tableHeight" :data="tableList" border stripe>
        <el-table-column prop="categoryName" label="名称"></el-table-column>
        <el-table-column prop="orderNum" label="序号"></el-table-column>
        <el-table-column label="操作" align ="center" width="200">
          <template #default="scope">
            <el-button type="primary" icon="Plus" size="default" @click="editBtn(scope.row)">编辑</el-button>
            <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="searchParm.currentPage"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="searchParm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchParm.total" background
      >
      </el-pagination>

    <!-- 弹框组件 -->
    <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="commit"
    >
      <template v-slot:content>
        <el-form :model="addModel" ref="addForm" :rules="rules" label-width="80px"  size="default">
          <el-form-item prop="categoryName" label="名称">
            <el-input v-model="addModel.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input type="number" v-model="addModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
        
      </template>
    </SysDialog>
  </el-main>
  
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import SysDialog from '@/components/SysDialog.vue'
import useDialog from '@/hooks/useDialog'
import { ElMessage, type FormInstance } from 'element-plus';
import {addCategoryApi,listApi,editCategoryApi,deleteCategoryApi} from '@/api/category/index'
import { Category } from '@/api/category/CategoryModel';
import { EditType } from '../../type/BaseEnum';
import useInstance from '../../hooks/useInstance';
import router from '../../router';
//获取全局属性
const {global} = useInstance()
//表单ref属性
const addForm = ref<FormInstance>();
//表单验证规则
const rules = reactive({
  categoryName: [
    { required: true, message: "请填写分类名称", trigger: "blur" },
  ],
  orderNum: [
   { required: true, message: "请填写分类序号", trigger: "blur" },
  ],
});
//弹框属性
const {dialog,onClose,onConfirm,onShow} = useDialog()
//搜索绑定的对象,列表查询的参数
const searchParm = reactive({
  currentPage:1,
  pageSize:10,
  categoryName:'',
  total:0
})
const addModel = reactive({
  categoryId:"",
  categoryName:"",
  orderNum:""
})
//0代表新增 1代表编辑
const tags = ref('')
const addBtn = ()=>{
  tags.value = '0'
  dialog.height=150;
  addForm.value?.resetFields()
  onShow()
}
//编辑
const editBtn=(row:Category)=>{
  tags.value = '1'
  dialog.height=150;
  addForm.value?.resetFields()
  onShow();
  //回显数据
  nextTick(()=>{
    Object.assign(addModel,row)
  })
}

//删除
const deleteBtn = async(row:Category)=>{
  //确定信息
  let confirm = await global.$myconfirm("确定删除该数据吗?")
  if(confirm){
    let res = await deleteCategoryApi(row)
    if(res && res.code == 200){
      ElMessage.success(res.msg)
      getList()
    }
  }
}
//搜索
const searchBtn = ()=>{
  getList()
}
//重置
const resetBtn = ()=>{
  searchParm.categoryName = ''
  getList()
}
//表单提交
const commit = ()=>{
  //表单验证
  addForm.value?.validate(async(valid)=>{
    if(valid){
      console.log('验证通过')
      //提交
      let res = null
      if(tags.value == EditType.ADD){
        res = await addCategoryApi(addModel)
      }else{
        res = await editCategoryApi(addModel)
      }
      if(res && res.code == 200){
        ElMessage.success(res.msg)
        //刷新表格数据
        getList()
        onClose()
      }
    }
  })
}
//表格数据
const tableList = ref([])
//表格高度
const tableHeight = ref(0)
//获取表格数据
const getList = async()=>{
  let res = await listApi(searchParm)
  if(res && res.code == 200){
    console.log(res)
    //设置表格数据
    tableList.value = res.data.records;
    //设置分页总条数
    searchParm.total = res.data.total;
 }
}
//页容量改变时触发
const sizeChange = (size:number)=>{
  searchParm.pageSize = size;
  getList()
}
//页数改变时触发
const currentChange = (page:number)=>{
  searchParm.currentPage = page;
  getList()
}
// 检查用户是否登录
  const checkSession = () => {
  const userid = sessionStorage.getItem('userid');
  if (!userid) {
    // 跳转到登录页面
    router.push({path:'/login'})
  }
  }
//加载数据
onMounted(()=>{
   checkSession(); // 检查 session
  getList()
  //计算表格高度
  nextTick(()=>{
    tableHeight.value = window.innerHeight - 200
  })
})
</script>

<style scoped>

</style>