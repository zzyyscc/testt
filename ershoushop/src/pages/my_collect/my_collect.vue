<!-- 我的收藏 -->
<template>
	<view class="page-box">
		<view class="order" v-for="(item, index) in list" :key="item.goodsId">
			<view class="top">
				<view class="left">
					<!-- <u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon> -->
					<view class="store">{{ item.goodsName }}</view>
					<!-- <u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon> -->
				</view>
				<view v-if="item.type == '0'" class="right">闲置</view>
				<view style="color: #FF7670;" v-if="item.type == '1'" class="right">求购</view>
			</view>
			<view class="item">
				<view class="left">
					<image :src="item.image.split(',')[0]" mode="aspectFill"></image>
				</view>
				<view class="content">
					<view class="title u-line-2">{{ item.goodsDesc }}</view>
					<view class="delivery-time">发布时间 {{ item.createTime }}</view>
				</view>
				<view class="right">
					<view class="price">
						￥{{ item.goodsPrice }}
					</view>
					<view class="number">x1</view>
				</view>
			</view>
			<view class="bottom">
				<view @click="toLook(item)" class="logistics btn">查看</view>
				<view @click="cancelBtn(item)" class="evaluate btn">取消收藏</view>
			</view>
		</view>
		<!-- 取消收藏 -->
		<u-popup :mask-close-able="false" border-radius="15" width="70%" height="120px" v-model="show" mode="center">
			<view style="padding: 20px 15px 20px 15px;">
				确定取消吗?
			</view>
			<view class="conBtn">
				<u-button @click="cancel" style="margin-right: 15px;" type="info">取消</u-button>
				<u-button @click="confirm" style="margin-left: 15px;" :custom-style="customStyle"
					type="error">确定</u-button>
			</view>
		</u-popup>
		<u-loadmore :status="status" @loadmore="loadmore" bgColor="#f2f2f2"></u-loadmore>
	</view>
</template>

<script setup>
	import {
		onReachBottom,
		onReady
	} from '@dcloudio/uni-app';
	import {
		reactive,
		ref
	} from 'vue';
	import {
		getMyCollectApi,
		cancelCollectApi
	} from '../../api/goods.js'
	const show = ref(false)
	const list = ref([])
	//列表参数
	const parm = reactive({
		userId: uni.getStorageSync("userId"),
		currentPage: 1,
		pageSize: 10
	})
	//总页数
	const pages = ref(0)
	//获取列表数据
	const getMyCollect = async () => {
		let res = await getMyCollectApi(parm)
		if (res && res.code == 200) {
			console.log(res)
			pages.value = res.data.pages;
			list.value = list.value.concat(res.data.records)
		}
	}
	const status = ref('loadmore')
	//加载更多
	const loadmore = () => {
		console.log('点击加载更多')
		if (parm.currentPage >= pages.value) {
			status.value = "nomore";
			return;
		}
		status.value = "loading"
		parm.currentPage = ++parm.currentPage;
		getMyCollect()
	}
	//触底加载
	onReachBottom(() => {
		console.log('触底加载')
		if (parm.currentPage >= pages.value) {
			status.value = "nomore";
			return;
		}
		status.value = "loading"
		parm.currentPage = ++parm.currentPage;
		getMyCollect()
	})
	//查看
	const toLook = (item) => {
		if (item.type == '0') { //跳转闲置
			uni.navigateTo({
				url: "../look_unused/look_unused?goods=" + JSON.stringify(item)
			})
		} else { //跳转求购
			uni.navigateTo({
				url: "../look_buy/look_buy?goods=" + JSON.stringify(item)
			})
		}
	}
	//取消收藏按钮
	const collectId = ref('')
	const cancelBtn = (item) => {
		console.log(item)
		collectId.value = item.collectId
		show.value = true;
	}
	//确定取消
	const confirm = async () => {
		console.log(collectId.value)
		let res = await cancelCollectApi({
			collectId: collectId.value
		})
		if (res && res.code == 200) {
			parm.currentPage = 1;
			list.value = []
			getMyCollect()
			show.value = false;
		}

	}
	//取消
	const cancel = () => {
		show.value = false;
	}
	onReady(() => {
		getMyCollect()
	})
</script>

<style lang="scss">
	.conBtn {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-type-warning-dark;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: flex-end;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
				margin-right: 10px;
			}

			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}
</style>