// import axios, { AxiosResponse } from 'axios'
// import ejectUser from '@/modules/ejectUser'
// import {
// 	ExAPIAccessDenied,
// 	ExAPIBadRequest,
// 	ExAPINetwork,
// 	ExAPINotFound,
// 	ExAPIUnauthorized,
// 	ExAPIPreconditionRequired,
// 	ExAPIAConflict,
// 	ExAPIA50x
// } from '@/exceptions/APIExceptions'
// import { ErrorModule } from '@/store/error'
// import i18n from '@/modules/i18n'
// import { apiPaths } from '@/constants/apiPaths'
// import t from './i18n.json'
// import router from '/@/'
// import Login from '@/auth/login/view.vue'

// const $t = i18n.makeTranslator(t)

// export type ApifireParams = {
// 	[key: string]: number | string | boolean | ApifireParams | null | Array<unknown> | FormData
// }

// export enum METHODS {
// 	'GET' = 'get',
// 	'DELETE' = 'delete',
// 	'HEAD' = 'head',
// 	'OPTIONS' = 'options',
// 	'POST' = 'post',
// 	'PUT' = 'put',
// 	'PATCH' = 'patch',
// 	'PURGE' = 'purge',
// 	'LINK' = 'link',
// 	'UNLINK' = 'unlink'
// }

// class ApiFactory {
// 	public constructor(
// 		private path: string,
// 		private httpMethod: METHODS,
// 		private headerParams: ApifireParams = {},
// 		private queryParams: ApifireParams = {},
// 		private bodyParams: ApifireParams = {},
// 		private requirement: ApifireParams = {}
// 	) {}

// 	public fire<T>() {
// 		let pathParams = ''
// 		const paramArray = []
// 		for (const [key, value] of Object.entries(this.queryParams)) {
// 			paramArray.push(
// 				`${encodeURIComponent(key)}=${typeof value === 'object' ? encodeURIComponent(JSON.stringify(value)) : encodeURIComponent(value)}`
// 			)
// 		}
// 		pathParams = `?${paramArray.join('&')}`

// 		const options = {
// 			method: this.httpMethod,
// 			url: `${this.path}${pathParams}`,
// 			data: this.bodyParams,
// 			withCredentials: false,
// 			headers: this.headerParams,
// 			requirement: this.requirement
// 		}
// 		function updateJwtIfRequired(response: AxiosResponse<any>) {
// 			if (response.headers['x-auth-new-token']) {
// 				jwt.set(response.headers['x-auth-new-token'])
// 			}
// 		}

// 		return axios
// 			.request<T>(options)
// 			.then((response) => {
// 				updateJwtIfRequired(response)
// 				return response
// 			})
// 			.catch(async (err) => {
// 				console.error(err)
// 				if (err.response) {
// 					updateJwtIfRequired(err.response)
// 					switch (err.response.status) {
// 						case 400:
// 							throw new ExAPIBadRequest(err)
// 						case 401: {
// 							if (!this.requirement.throw401) {
// 								ejectUser()
// 							}
// 							throw new ExAPIUnauthorized(err)
// 						}
// 						case 403:
// 							throw new ExAPIAccessDenied(err)
// 						case 404: {
// 							if (!this.requirement.throw404) {
// 								ErrorModule.setErrorModalData({
// 									header: $t('errorStatus').toString(),
// 									body: $t('errorBody').toString(),
// 									footer: $t('errorFooter').toString()
// 								})
// 							}
// 							throw new ExAPINotFound(err)
// 						}
// 						case 408: {
// 							const retryResponse = await this.retryRequest(options, 5)
// 							if (retryResponse === null) {
// 								throw new ExAPINetwork(err)
// 							}
// 							return retryResponse
// 						}
// 						case 409:
// 							throw new ExAPIAConflict(err)
// 						case 428: {
// 							throw new ExAPIPreconditionRequired(err)
// 						}
// 						case 500: {
// 							throw new ExAPIA50x(err)
// 						}
// 						default: {
// 							throw new Error(err)
// 						}
// 					}
// 				} else if (err.request) {
// 					const retryResponse = await this.retryRequest(options, 3)
// 					if (retryResponse === null) {
// 						throw new ExAPINetwork(err)
// 					}
// 					return retryResponse
// 				} else {
// 					throw new Error(err)
// 				}
// 			})
// 	}

// 	async retryRequest(
// 		option: {
// 			method: METHODS
// 			url: string
// 			data: ApifireParams
// 			withCredentials: boolean
// 			headers: ApifireParams
// 		},
// 		retryCount: number
// 	) {
// 		let response: null | AxiosResponse<any> = null
// 		for (let counter = 0; counter < retryCount; counter++) {
// 			if (!response) {
// 				await axios
// 					.request(option)
// 					.then((data) => {
// 						response = data
// 					})
// 					.catch(() => (response = null))
// 			}
// 		}
// 		return response
// 	}
// }

// async function apiClientBody<T>(
// 	httpMethod: METHODS,
// 	postFixPath: string,
// 	requirement: {
// 		auth: boolean
// 		throw404: boolean
// 		throw401: boolean
// 	},
// 	queryParams: ApifireParams = {},
// 	bodyParams: ApifireParams = {}
// ) {
// 	const isDeleteOrGet = httpMethod === METHODS.GET || httpMethod === METHODS.DELETE

// 	const headerParams: ApifireParams = {}

// 	if (requirement.auth) {
// 		try {
// 			const authenticatedJwt = await jwt.returnAvailableJwt()
// 			headerParams['Authorization'] = `Bearer ${authenticatedJwt}`
// 		} catch (error) {
// 			alert(postFixPath)
// 			router.changePage({ to: Login.name })
// 		}
// 	}
// 	// @todo
// 	// headerParams["locale"] = i18n.locale

// 	if (!isDeleteOrGet) headerParams['Content-type'] = 'application/json'
// 	const API: ApiFactory = new ApiFactory(`${apiPaths.apiUrl}/${postFixPath}`, httpMethod, headerParams, queryParams, bodyParams, requirement)
// 	return API.fire<T>()
// }

// export default {
// 	patch: function (
// 		postFixPath: string,
// 		requirement: {
// 			auth: boolean
// 			throw404: boolean
// 			throw401: boolean
// 		},
// 		bodyParams: ApifireParams = {}
// 	) {
// 		return apiClientBody(METHODS.PATCH, postFixPath, requirement, {}, bodyParams)
// 	},
// 	get: function <T>(
// 		postFixPath: string,
// 		requirement: {
// 			auth: boolean
// 			throw404: boolean
// 			throw401: boolean
// 		},
// 		queryParams: ApifireParams = {}
// 	) {
// 		return apiClientBody<T>(METHODS.GET, postFixPath, requirement, queryParams, {})
// 	},
// 	delete: function (
// 		postFixPath: string,
// 		requirement: {
// 			auth: boolean
// 			throw404: boolean
// 			throw401: boolean
// 		},
// 		queryParams: ApifireParams = {}
// 	) {
// 		return apiClientBody(METHODS.DELETE, postFixPath, requirement, queryParams, {})
// 	},
// 	post: function <T>(
// 		postFixPath: string,
// 		requirement: {
// 			auth: boolean
// 			throw404: boolean
// 			throw401: boolean
// 		},
// 		bodyParams: ApifireParams = {}
// 	) {
// 		return apiClientBody<T>(METHODS.POST, postFixPath, requirement, {}, bodyParams)
// 	},
// 	put: function (
// 		postFixPath: string,
// 		requirement: {
// 			auth: boolean
// 			throw404: boolean
// 			throw401: boolean
// 		},
// 		bodyParams: ApifireParams = {}
// 	) {
// 		return apiClientBody(METHODS.PUT, postFixPath, requirement, {}, bodyParams)
// 	}
// }
