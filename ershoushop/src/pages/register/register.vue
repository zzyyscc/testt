<!-- 注册页 -->
<template>
	<view class="u-p-t-40 u-p-r-60 u-p-b-30 u-p-l-60 logincontainer">
		<button class="avatarwrap" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
			 <image class="avatar" :src="avatarUrl"></image>
		</button>
		<!-- <u-avatar size="140" src="/static/user.jpg" mode="circle"></uavatar>
 -->
		<u-form class="forms" :model="loginModel" ref="form1">
			<u-form-item prop="phone" left-icon="phone" left-icon-style="fontsize:24px;color:#FF7670;">

				<u-input placeholder="请输入电话" v-model="loginModel.phone" />
			</u-form-item>
			<u-form-item prop="username" left-icon="account-fill" left-icon-style="fontsize:24px;color:#FF7670;">

				<u-input placeholder="请输入账户" v-model="loginModel.username" />
			</u-form-item>
			<u-form-item prop="password" left-icon="lock" left-icon-style="fontsize:24px;color:#FF7670;">

				<u-input  placeholder="请输入密码" v-model="loginModel.password" />
			</u-form-item>
			<u-form-item prop="confirm" left-icon="lock" left-icon-style="fontsize:24px;color:#FF7670;">

				<u-input placeholder="请输入确定密码" v-model="loginModel.confirm" />
			</u-form-item>
			<view class="passtext" @click="toLogin">
				已有账号，去登录
			</view>
			<u-button @click="commit" :custom-style="customStyle1">注册</u-button>


		</u-form>

	</view>
</template>
<script setup>
	// 在 Vue 3 中，reactive 和 ref 是用于创建响应式数据的两个核心 API。
	// 它们是 Vue 3 Composition API 的一部分，用于替代 Vue 2 中的 data 选项。
	// reactive 用于将一个对象转换为响应式对象。响应式对象是指当对象的属性发生变化时，Vue 会自动检测到这些变化，并更新相关的视图。
	import {
		reactive,
		ref
	} from 'vue';
	import {onReady} from '@dcloudio/uni-app'
	//表单ref属性
	const form1 = ref()
	import {registerApi} from '../../api/user.js'
	const loginModel = reactive({
		phone: '',
		username: '',
		password: '',
		confirm:''
	})
	const customStyle1 = reactive({
		marginTop: '40px',
		background: '#FF7670',
		color: '#FFF',
		width: '100%'
	})
	const customStyle2 = reactive({
		marginTop: '35px',
		// background:'#FF7670',
		color: '#FFF',
		width: '100%'
	})
	const onChooseAvatar = (e) => {

	}
	const avatarUrl = ref('/static/user.jpg')
	//去登陆
	const toLogin = ()=>{
		uni.navigateTo({
			url:'../login/login'
		})
	}
	//表单验证规则
	 const rules = reactive({
		 phone: [{
			 required: true,
			 message: '请输入电话',
			 // 可以单个或者同时写两个触发验证方式 
			 trigger: ['change', 'blur'],
		 }],
		 username: [{
			 required: true,
			 message: '请输入账号',
			 // 可以单个或者同时写两个触发验证方式 
			 trigger: ['change', 'blur'],
		 }],
		 password: [{
			 required: true,
			 message: '请输入密码',
			 // 可以单个或者同时写两个触发验证方式 
			 trigger: ['change', 'blur'],
		 }],
		 confirm: [{
			 required: true,
			 message: '请输入确定密码',
			 // 可以单个或者同时写两个触发验证方式 
			 trigger: ['change', 'blur'],
		 }],
	 })
	//注册提交
	const commit = ()=>{
		form1.value.validate(async (valid)=>{
			if(valid){
				if(loginModel.confirm != loginModel.password){
					uni.showToast({
						title:'密码和确定密码不一致',
						icon:'none',
						duration: 2000
					})
					return
				}
				let res = await registerApi(loginModel)
				console.log(111111)
				console.log(loginModel)
				if(res && res.code == 200){
					toLogin()
				}
			}
		})
	}
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady(()=>{
		form1.value.setRules(rules);
	})
</script>
<style lang="scss">
	.logincontainer {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;

		.forms {
			width: 100%;
		}
	}

	.passtext {
		display: flex;
		justify-content: flex-end;
		color: #FF7670;
		margin-top: 15px;
	}

	.avatarwrap {
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70px;
		width: 70px;
		padding: 0px;

		.avatar {
			border-radius: 100%;
			height: 70px;
			width: 70px;
		}
	}
</style>