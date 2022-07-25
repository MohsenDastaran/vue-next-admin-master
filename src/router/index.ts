import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '/@/stores/index'
import jwt from '/@/modules/jwt'
import { storeToRefs } from 'pinia'
import { useKeepALiveNames } from '/@/stores/keepAliveNames'
import { useRoutesList } from '/@/stores/routesList'
import { useThemeConfig } from '/@/stores/themeConfig'
import { Session } from '/@/utils/storage'
import { staticRoutes, rxLangPath } from './routes'
import { initFrontEndControlRoutes } from '/@/router/frontEnd'
import { initBackEndControlRoutes } from '/@/router/backEnd'

const storesThemeConfig = useThemeConfig(pinia)
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isRequestRoutes } = themeConfig.value

export const router = createRouter({
	history: createWebHistory(),
	routes: staticRoutes
})

export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
		}
	}
	return arr
}

export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false
	const newArr: any = []
	const cacheList: Array<string> = []
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] })
		} else {
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true
				v.meta['isDynamicPath'] = v.path
			}
			newArr[0].children.push({ ...v })

			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name)
				const stores = useKeepALiveNames(pinia)
				stores.setCacheKeepAlive(cacheList)
			}
		}
	})
	return newArr
}

router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false })
	NProgress.start()
	jwt.getJwtFromLocalAndCheck()
	const localJWT = jwt.getJwt()

	if (to.path === '/login' && !localJWT) {
		console.log(1)
		next()
	} else {
		if (!localJWT) {
			router.push('login')
			Session.clear()
		} else if (localJWT && to.path === '/login') {
			next()
		} else {
			const storesRoutesList = useRoutesList(pinia)
			const { routesList } = storeToRefs(storesRoutesList)
			if (routesList.value.length === 0) {
				if (isRequestRoutes) {
					await initBackEndControlRoutes()
					next({ ...to, replace: true })
				} else {
					await initFrontEndControlRoutes()
					next({ ...to, replace: true })
				}
			} else {
				next()
			}
		}
	}

	_fixUrl(to.fullPath)
	let langCode = to.params.lang
	const pathWithoutLang = to.path.replace(`/${langCode}`, '')
	const fullPathWithoutLang = to.fullPath.replace(`/${langCode}`, '')
	const paths = router.getRoutes().map((route) => {
		return route.path.replaceAll(rxLangPath, '')
	})

	if (paths.includes(to.path)) {
		langCode = 'fa' || 'en'
		// i18n.setActiveLangCode(langCode)
		next()
	} else if (
		paths.includes(pathWithoutLang)
		//  && i18n.isSupportedLang(langCode)
	) {
		// @todo en move to .env
		if (langCode === 'en') {
			redirectRoute(fullPathWithoutLang)
		}
		// i18n.setActiveLangCode(langCode)
		next()
	} else {
		redirectError(404)
	}
})

router.afterEach(() => {
	NProgress.done()
})

function _fixUrl(url: string) {
	let fixedUrl = url
	const duplicateSlash = /\/{2,}/g
	if (url.match(duplicateSlash)) fixedUrl = url.replace(duplicateSlash, '/')
	const endSlash = /\/$/
	if (url.match(endSlash)) fixedUrl = url.replace(endSlash, '')
	if (url !== fixedUrl) {
		return redirectRoute(fixedUrl)
	}
}
function changePage({ to, query, isStatic }: { to: string; query?: {}; isStatic?: boolean }) {
	if (isStatic) {
		window.location.href = query ? to + query : to
	} else {
		router
			.push({
				name: to,
				path: to,
				//   params:
				//     i18n.activeLangCode !== process.env.VUE_APP_I18N_LOCALE
				//       ? { lang: i18n.activeLangCode }
				//       : undefined,
				query
			})
			.catch(() => true)
	}
}
function redirectError(errorCode: number) {
	window.location.href = window.location.origin + `/${errorCode}.html`
}
function redirectRoute(page: string) {
	router.push(page[0] == '/' ? page : '/' + page).catch(() => true)
}
function vueModulePaths() {
	router.getRoutes().map((route) => {
		return route.path.replaceAll(rxLangPath, '')
	})
}
export default router
