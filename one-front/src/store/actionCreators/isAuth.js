import { AUTH, UNAUTH } from '../actions/isAuth';

export const AUTH_ACTION = (value, status) => {
	localStorage.setItem('auth', JSON.stringify(true))
	localStorage.setItem('token', value)
	localStorage.setItem('status', status)
	return {
		type: AUTH,
		value,
    status
	}
}

export const UNAUTH_ACTION = () => {
	localStorage.clear()
	return {
		type: UNAUTH
	}
}

