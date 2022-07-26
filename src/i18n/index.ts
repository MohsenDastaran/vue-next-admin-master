import { createI18n } from 'vue-i18n'
import pinia from '/@/stores/index'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import zhcnLocale from 'element-plus/lib/locale/lang/zh-cn'
import faLocale from 'element-plus/lib/locale/lang/fa'
import enLocale from 'element-plus/lib/locale/lang/en'

import translations from './lang/translations'

import login from '/@/i18n/pages/login/en'
import pagesFormI18nZhcn from '/@/i18n/pages/formI18n/zh-cn'
import pagesFormI18nEn from '/@/i18n/pages/formI18n/en'

const messages = {
	[zhcnLocale.name]: {
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
console.log(messages)

// 读取 pinia 默认语言
const stores = useThemeConfig(pinia)
const { themeConfig } = storeToRefs(stores)

// https://vue-i18n.intlify.dev/guide/essentials/fallback.html#explicit-fallback-with-one-locale
export const i18n = createI18n({
	silentTranslationWarn: true,
	missingWarn: false,
	silentFallbackWarn: true,
	fallbackWarn: false,
	locale: themeConfig.value.globalI18n,
	fallbackLocale: zhcnLocale.name,
	messages
})
