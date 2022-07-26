<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="i18nLocale">
		<router-view :dir="rtl ? 'rtl' : 'ltr'" v-show="themeConfig.lockScreenTime > 1" />
		<LockScreen v-if="themeConfig.isLockScreen" />
		<Setings ref="setingsRef" v-show="themeConfig.lockScreenTime > 1" />
		<CloseFull v-if="!themeConfig.isLockScreen" />
	</el-config-provider>
</template>

<script lang="ts">
import { computed, ref, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, nextTick, defineComponent, watch, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes'
import { useThemeConfig } from '/@/stores/themeConfig'
import other from '/@/utils/other'
import { Local, Session } from '/@/utils/storage'
import setIntroduction from '/@/utils/setIconfont'
import LockScreen from '/@/layout/lockScreen/index.vue'
import Setings from '/@/layout/navBars/breadcrumb/setings.vue'
import CloseFull from '/@/layout/navBars/breadcrumb/closeFull.vue'
import { i18nStore } from './i18n'

export default defineComponent({
	name: 'app',
	components: { LockScreen, Setings, CloseFull },
	setup() {
		const { proxy } = <any>getCurrentInstance()
		const setingsRef = ref()
		const route = useRoute()
		const stores = useTagsViewRoutes()
		const storesThemeConfig = useThemeConfig()
		const { themeConfig } = storeToRefs(storesThemeConfig)
		const state = reactive({
			i18nLocale: null
		})
		const getGlobalComponentSize = computed(() => {
			return other.globalComponentSize()
		})
		const rtl = computed(() => {
			return i18nStore().isRTL
		})
		const openSetingsDrawer = () => {
			setingsRef.value.openDrawer()
		}
		onBeforeMount(() => {
			setIntroduction.cssCdn()
			setIntroduction.jsCdn()
		})
		onMounted(() => {
			nextTick(() => {
				proxy.mittBus.on('openSetingsDrawer', () => {})
				proxy.mittBus.on('getI18nConfig', (locale: string) => {
					;(state.i18nLocale as string | null) = locale
				})
				if (Local.get('themeConfig')) {
					storesThemeConfig.setThemeConfig(Local.get('themeConfig'))
					document.documentElement.style.cssText = Local.get('themeConfigStyle')
				}
				if (Session.get('isTagsViewCurrenFull')) {
					stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'))
				}
			})
		})
		onUnmounted(() => {
			proxy.mittBus.off('openSetingsDrawer', () => {})
			proxy.mittBus.off('getI18nConfig', () => {})
		})
		watch(
			() => route.path,
			() => {
				other.useTitle()
			},
			{
				deep: true
			}
		)
		return {
			themeConfig,
			setingsRef,
			rtl,
			getGlobalComponentSize,
			...toRefs(state)
		}
	}
})
</script>
