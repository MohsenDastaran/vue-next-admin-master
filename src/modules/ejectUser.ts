import jwt from '/@/modules/jwt'

export default function () {
	jwt.delJwt()
	window.location.reload()
}
