import { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index'
import { dynamicRoutes, notFoundAndNoPower } from './routes'
import pinia from '/@/stores/index'
import { useUserInfo } from '/@/stores/userInfo'
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes'
import { useRoutesList } from '/@/stores/routesList'
import { NextLoading } from '/@/utils/loading'
import storage, { StorageKey } from '../modules/storage'

export async function initFrontEndControlRoutes() {
	// loading animation
	if (window.nextLoading === undefined) NextLoading.start()
	//  jwt check
	if (!storage.get(StorageKey.jwt)) return false
	// Trigger to initialize user information  pinia
	await useUserInfo(pinia).setUserInfos()
	// Add dynamic routing
	await setAddRoute()

	await setFilterMenuAndCacheTagsViewRoutes()
}

export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		router.addRoute(route)
	})
}

export async function frontEndsResetRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		const routeName: any = route.name
		router.hasRoute(routeName) && router.removeRoute(routeName)
	})
}

export function setFilterRouteEnd() {
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))
	filterRouteEnd[0].children = [...setFilterRoute(filterRouteEnd[0].children), ...notFoundAndNoPower]
	return filterRouteEnd
}

export function setFilterRoute(chil: any) {
	const stores = useUserInfo(pinia)
	const { userInfos } = storeToRefs(stores)
	let filterRoute: any = []
	chil.forEach((route: any) => {
		if (route.meta.roles) {
			route.meta.roles.forEach((metaRoles: any) => {
				userInfos.value.roles.forEach((roles: any) => {
					if (metaRoles === roles) filterRoute.push({ ...route })
				})
			})
		}
	})
	return filterRoute
}

export function setCacheTagsViewRoutes() {
	const stores = useUserInfo(pinia)
	const storesTagsView = useTagsViewRoutes(pinia)
	const { userInfos } = storeToRefs(stores)
	let rolesRoutes = setFilterHasRolesMenu(dynamicRoutes, userInfos.value.roles)
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(rolesRoutes))[0].children)
}

export async function setFilterMenuAndCacheTagsViewRoutes() {
	const stores = useUserInfo(pinia)
	const storesRoutesList = useRoutesList(pinia)
	const { userInfos } = storeToRefs(stores)
	storesRoutesList.setRoutesList(setFilterHasRolesMenu(dynamicRoutes[0].children, userInfos.value.roles))
	setCacheTagsViewRoutes()
}

export function hasRoles(roles: any, route: any) {
	if (route.meta && route.meta.roles) return roles.some((role: any) => route.meta.roles.includes(role))
	else return true
}

export function setFilterHasRolesMenu(routes: any, roles: any) {
	const menu: any = []
	routes.forEach((route: any) => {
		const item = { ...route }
		if (hasRoles(roles, item)) {
			if (item.children) item.children = setFilterHasRolesMenu(item.children, roles)
			menu.push(item)
		}
	})
	return menu
}
