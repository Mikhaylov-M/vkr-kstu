import { AUTH, UNAUTH } from '../actions/isAuth'

const initialState = {
    isAuth : JSON.parse(localStorage.getItem("auth")) || "",
    token: localStorage.getItem("token") || "",
    status: localStorage.getItem("status") || ""
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH: return {...state, isAuth: true, token: action.value, status: action.status }
        case UNAUTH: return {...state, isAuth: false, token: "", status: ""}
        default: return state
    }
}

export default rootReducer