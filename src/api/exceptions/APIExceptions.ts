import { IntfExBase } from './IntfExBase'
import { AxiosError } from 'axios'

export abstract class IntfExAPI extends IntfExBase {
	constructor(error: AxiosError) {
		super(error.response ? error.response.data.error.message : error.message)
	}
}

export class ExAPIBadRequest extends IntfExAPI {
	name = 'ExAPIBadRequest'
}

export class ExAPIAccessDenied extends IntfExAPI {
	name = 'ExAPIAccessDenied'
}

export class ExAPINotFound extends IntfExAPI {
	name = 'ExAPINotFound'
}

export class ExAPINetwork extends IntfExAPI {
	name = 'ExAPINetwork'
}

export class ExAPIUnauthorized extends IntfExAPI {
	name = 'ExAPIUnauthorized'
}

export class ExAPIPreconditionRequired extends IntfExAPI {
	name = 'ExAPIPreconditionRequired'
}

export class ExAPIAConflict extends IntfExAPI {
	name = 'ExAPIAConflict'
}
export class ExAPIA50x extends IntfExAPI {
	name = '50x'
}
