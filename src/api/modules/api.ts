import axios, { AxiosResponse, AxiosRequestConfig, Method } from 'axios'
import ejectUser from '/@/modules/ejectUser'
import {
	ExAPIAccessDenied,
	ExAPIBadRequest,
	ExAPINetwork,
	ExAPINotFound,
	ExAPIUnauthorized,
	ExAPIPreconditionRequired,
	ExAPIAConflict,
	ExAPIA50x
} from '/@/api/exceptions/APIExceptions'
// import { ErrorModule } from '@/store/error'
// import i18n from '@/modules/i18n'
import jwt from '/@/modules/jwt'
import { apiPaths } from '/@/api/apiPaths'
// import t from './i18n.json'
import router from '/@/router'
// const $t = i18n.makeTranslator(t)

export type ApifireParams = {
	[key: string]: number | string | boolean | ApifireParams | null | Array<unknown> | FormData
}

export enum Methods {
	'GET' = 'get',
	'DELETE' = 'delete',
	'HEAD' = 'head',
	'OPTIONS' = 'options',
	'POST' = 'post',
	'PUT' = 'put',
	'PATCH' = 'patch',
	'PURGE' = 'purge',
	'LINK' = 'link',
	'UNLINK' = 'unlink'
}

class ApiFactory {
	public constructor(
		private path: string,
		private httpMethod: Method,
		private headerParams: any = {},
		private queryParams: ApifireParams = {},
		private bodyParams: ApifireParams = {},
		private requirement: ApifireParams = {}
	) {}

	public fire<T>() {
		let pathParams = ''
		const paramArray = []
		for (const [key, value] of Object.entries(this.queryParams)) {
			paramArray.push(
				`${encodeURIComponent(key)}=${typeof value === 'object' ? encodeURIComponent(JSON.stringify(value)) : encodeURIComponent(value)}`
			)
		}
		pathParams = `?${paramArray.join('&')}`

		const options = {
			method: this.httpMethod,
			url: `${this.path}${pathParams}`,
			data: this.bodyParams,
			withCredentials: false,
			headers: this.headerParams,
			requirement: this.requirement
		}
		function updateJwtIfRequired(response: AxiosResponse<any>) {
			if (response.headers['x-auth-new-token']) {
				jwt.set(response.headers['x-auth-new-token'])
			}
		}

		return axios
			.request<T>(options)
			.then((response) => {
				updateJwtIfRequired(response)
				return response
			})
			.catch(async (err) => {
				console.error(err)
				if (err.response) {
					updateJwtIfRequired(err.response)
					switch (err.response.status) {
						case 400:
							throw new ExAPIBadRequest(err)
						case 401: {
							if (!this.requirement.throw401) {
								ejectUser()
							}
							throw new ExAPIUnauthorized(err)
						}
						case 403:
							throw new ExAPIAccessDenied(err)
						case 404: {
							// if (!this.requirement.throw404) {
							// 	ErrorModule.setErrorModalData({
							// 		header: $t('errorStatus').toString(),
							// 		body: $t('errorBody').toString(),
							// 		footer: $t('errorFooter').toString()
							// 	})
							// }
							throw new ExAPINotFound(err)
						}
						case 408: {
							const retryResponse = await this.retryRequest(options, 5)
							if (retryResponse === null) {
								throw new ExAPINetwork(err)
							}
							return retryResponse
						}
						case 409:
							throw new ExAPIAConflict(err)
						case 428: {
							throw new ExAPIPreconditionRequired(err)
						}
						case 500: {
							throw new ExAPIA50x(err)
						}
						default: {
							throw new Error(err)
						}
					}
				} else if (err.request) {
					const retryResponse = await this.retryRequest(options, 3)
					if (retryResponse === null) {
						throw new ExAPINetwork(err)
					}
					return retryResponse
				} else {
					throw new Error(err)
				}
			})
	}

	async retryRequest(option: AxiosRequestConfig, retryCount: number) {
		let response: null | AxiosResponse<any> = null
		for (let counter = 0; counter < retryCount; counter++) {
			if (!response) {
				await axios
					.request(option)
					.then((data) => {
						response = data
					})
					.catch(() => (response = null))
			}
		}
		return response
	}
}

async function apiClientBody<T>(
	httpMethod: Method,
	postFixPath: string,
	requirement: {
		auth: boolean
		throw404: boolean
		throw401: boolean
	},
	queryParams: ApifireParams = {},
	bodyParams: ApifireParams = {}
) {
	const isDeleteOrGet = httpMethod === Methods.GET || httpMethod === Methods.DELETE

	const headerParams: ApifireParams = {}

	if (requirement.auth) {
		try {
			const authenticatedJwt = await jwt.returnAvailableJwt()
			headerParams['Authorization'] = `Bearer ${authenticatedJwt}`
		} catch (error) {
			alert(postFixPath)
			router.push('login')
			// router.changePage({ to: Login.name })
		}
	}
	if (!isDeleteOrGet) headerParams['Content-type'] = 'application/json'
	const API: ApiFactory = new ApiFactory(`${apiPaths.apiUrl}/${postFixPath}`, httpMethod, headerParams, queryParams, bodyParams, requirement)
	return API.fire<T>()
}

export default {
	patch: function (
		postFixPath: string,
		requirement: {
			auth: boolean
			throw404: boolean
			throw401: boolean
		},
		bodyParams: ApifireParams = {}
	) {
		return apiClientBody(Methods.PATCH, postFixPath, requirement, {}, bodyParams)
	},
	get: function <T>(
		postFixPath: string,
		requirement: {
			auth: boolean
			throw404: boolean
			throw401: boolean
		},
		queryParams: ApifireParams = {}
	) {
		return apiClientBody<T>(Methods.GET, postFixPath, requirement, queryParams, {})
	},
	delete: function (
		postFixPath: string,
		requirement: {
			auth: boolean
			throw404: boolean
			throw401: boolean
		},
		queryParams: ApifireParams = {}
	) {
		return apiClientBody(Methods.DELETE, postFixPath, requirement, queryParams, {})
	},
	post: function <T>(
		postFixPath: string,
		requirement: {
			auth: boolean
			throw404: boolean
			throw401: boolean
		},
		bodyParams: ApifireParams = {}
	) {
		return apiClientBody<T>(Methods.POST, postFixPath, requirement, {}, bodyParams)
	},
	put: function (
		postFixPath: string,
		requirement: {
			auth: boolean
			throw404: boolean
			throw401: boolean
		},
		bodyParams: ApifireParams = {}
	) {
		return apiClientBody(Methods.PUT, postFixPath, requirement, {}, bodyParams)
	}
}
