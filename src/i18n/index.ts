import { createI18n } from 'vue-i18n'

import pinia from '/@/stores/index'
import { ISO639 } from './ISO639'
import { storeToRefs, defineStore } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import zhcnLocale from 'element-plus/lib/locale/lang/zh-cn'
import faLocale from 'element-plus/lib/locale/lang/fa'
import enLocale from 'element-plus/lib/locale/lang/en'

import translations from './lang/translations'

import login from '/@/pages/login/i18n.js'
import pagesFormI18nZhcn from '/@/i18n/pages/formI18n/zh-cn'
import pagesFormI18nEn from '/@/i18n/pages/formI18n/en'

export const i18nStore = defineStore('i18n', {
	state: () => ({
		isRTL: isRTLLang() as boolean
	}),
	actions: {
		rtlManager() {
			this.isRTL = isRTLLang()
			console.log(this.isRTL)
		}
	}
})
const messages = {
	[faLocale.name]: {
		...faLocale,
		message: {
			...translations.fa,
			...login['zh-cn'],
			...pagesFormI18nZhcn
		}
	},
	[enLocale.name]: {
		...enLocale,
		message: {
			...translations.en,
			...login.en,
			...pagesFormI18nEn
		}
	}
}

const stores = useThemeConfig(pinia)
const { themeConfig } = storeToRefs(stores)

export const rtlLanguages: Array<ISO639> = [ISO639.Persian, ISO639.Arabic, ISO639.Hebrew]
function isRTLLang(): boolean {
	for (const rtlLang in rtlLanguages) {
		if (rtlLanguages[rtlLang] == getLocale()) return true
	}
	return false
}

export const i18n = createI18n({
	silentTranslationWarn: true,
	missingWarn: false,
	silentFallbackWarn: true,
	fallbackWarn: false,
	locale: themeConfig.value.globalI18n,
	fallbackLocale: zhcnLocale.name,
	messages
})

export const getLocale = () => {
	return i18n.global.locale
}
