<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input
				:type="isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')"
				v-model="ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="isShowPassword = !isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-col :span="15">
				<el-input
					type="text"
					maxlength="4"
					:placeholder="$t('message.account.accountPlaceholder3')"
					v-model="ruleForm.code"
					clearable
					autocomplete="off"
				>
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button class="login-content-code">1234</el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" round @click="onSignIn" :loading="loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import { initFrontEndControlRoutes } from '/@/router/frontEnd'
import { initBackEndControlRoutes } from '/@/router/backEnd'
import { Session } from '/@/utils/storage'
import { formatAxis } from '/@/utils/formatTime'
import { NextLoading } from '/@/utils/loading'

export default defineComponent({
	name: 'loginAccount',
	setup(props, context) {
		const { t } = useI18n()
		const storesThemeConfig = useThemeConfig()
		const { themeConfig } = storeToRefs(storesThemeConfig)
		const route = useRoute()
		const router = useRouter()
		const state = reactive({
			isShowPassword: false,
			ruleForm: {
				userName: 'admin',
				password: '123456',
				code: '1234'
			},
			loading: {
				signIn: false
			}
		})
		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date())
		})
		// 登录
		const onSignIn = async () => {
			context.emit('signIn', state.ruleForm)

			// state.loading.signIn = true;
			// Session.set('token', Math.random().toString(36).substr(0));
			// Cookies.set('userName', state.ruleForm.userName);
			// if (!themeConfig.value.isRequestRoutes) {
			// 	await initFrontEndControlRoutes();
			// 	signInSuccess();
			// } else {
			// 	await initBackEndControlRoutes();
			// 	signInSuccess();
			// }
		}
		const signInSuccess = () => {
			let currentTimeInfo = currentTime.value
			if (route.query?.redirect) {
				router.push({
					path: <string>route.query?.redirect,
					query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : ''
				})
			} else {
				router.push('/')
			}

			state.loading.signIn = true
			const signInText = t('message.signInText')
			ElMessage.success(`${currentTimeInfo}，${signInText}`)
			NextLoading.start()
		}
		return {
			onSignIn,
			...toRefs(state)
		}
	}
})
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
