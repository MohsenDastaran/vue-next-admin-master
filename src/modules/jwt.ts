// import { UserDetails, UserModule } from '@/store/user'
import storage, { StorageKey } from './storage'
// import messageHandler from '@/modules/toast'
// import i18n from '@/modules/i18n'
// import t from './i18n.json'
import { apiPaths } from '/@/api/apiPaths'
import ApiClient from '/@/api/modules/api'

// const $t = i18n.makeTranslator(t)

interface BaseJWT {
	exp: number
}

class Jwt {
	private jwt: string | null = null

	//just parse jwt
	private parse(jwt: string) {
		try {
			const splitedJWT: string[] = jwt.split('.')
			return JSON.parse(atob(splitedJWT[1]))
		} catch (error) {
			return null
		}
	}
	public getJwt() {
		return this.jwt
	}
	public delJwt() {
		this.jwt = null
		storage.wipeLocalStorage()
	}

	public set(jwt: string) {
		this.jwt = jwt
		storage.save(StorageKey.jwt, this.jwt)
		this.isValidAvailableJwt()
	}

	// private setUserInfo(data: UserDetails) {
	// 	UserModule.infoFromJwt.rolName = data.rolName
	// 	UserModule.infoFromJwt.usrName = data.usrName
	// 	UserModule.infoFromJwt.usrApproval = data.usrApproval
	// 	UserModule.infoFromJwt.usrID = data.usrID
	// 	UserModule.infoFromJwt.rolID = data.rolID
	// 	UserModule.infoFromJwt.usrLogin = data.usrLogin
	// 	UserModule.infoFromJwt.usrStatus = data.usrStatus
	// 	UserModule.infoFromJwt.privs = data.privs
	// 	UserModule.infoFromJwt.canChangePass = data.canChangePass
	// 	UserModule.infoFromJwt.usrFamily = data.usrFamily
	// }

	getJwtFromLocalAndCheck() {
		if (!this.jwt) {
			this.jwt = storage.get(StorageKey.jwt) as string
			this.isValidAvailableJwt()
		}
	}
	private isValidAvailableJwt() {
		if (this.jwt) {
			try {
				const parsedJwt = this.parse(this.jwt)
				console.log(parsedJwt)
				// this.setUserInfo(parsedJwt)
				return true
			} catch {
				this.jwt = null
				// messageHandler.error($t('illegalAccess'))
			}
		}
		return false
	}

	public returnAvailableJwt() {
		return new Promise((resolve, reject) => {
			if (this.jwt) {
				resolve(this.jwt)
			} else {
				reject(Error('Session expired!'))
			}
		})
	}

	public async validateJwt() {
		try {
			const response = await ApiClient.get(apiPaths.validateJwt, {
				auth: true,
				throw404: false,
				throw401: false
			})
		} catch (error) {
			throw new Error()
		}
	}
}
const jwt = new Jwt()
export default jwt
