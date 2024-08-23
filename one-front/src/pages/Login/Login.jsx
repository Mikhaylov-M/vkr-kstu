import { useEffect, useState } from 'react'
import './Login.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_ACTION } from '../../store/actionCreators/isAuth'

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selector = useSelector((state) => state)

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState(false)

  useEffect(() => {
    if (selector.isAuth) {
      navigate('/')
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(data)
      try {
        console.log('auth');
        const auth = await axios(`${process.env.REACT_APP_API_URL}/test/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(data)
        })
        console.log(auth);
        dispatch(AUTH_ACTION(`Bearer ${auth.data.access_token}`, data.email))

        if (auth.status === 201) {
          if (data.email === 'admin') {
            navigate('/admin')
          } else {
            navigate('/profile')
          }
        }
        
      } catch(err) {
        console.log(err)
        if (err) {
          if (err?.response?.status === 500 || err?.response?.status === 401) {
            setError(true)
          }
        }
      }
  }

  return (
    <section className="login" id="login">
      <div className="login__container">
        <h2 className="login__title def__title">Авторизируйтесь</h2>
        <form className="login__form">
          <input className="login__input def__input" autoComplete='email' type="email" placeholder="Почта" onInput={(e) => {
            setData({...data, email: e.target.value})
          }} />
          <input
            className="login__input def__input"
            type="password"
            autoComplete='current-password'
            placeholder="Пароль"
            onInput={(e) => {
              setData({ ...data, password: e.target.value })
            }}
          />
          <Link to='/recovery' className="login__forgot">Забыли пароль?</Link>
          <button className="login__btn def__btn" type='submit' onClick={handleLogin}>ВОЙТИ</button>
        </form>
        {error && <p style={{ fontSize: "22px", color: "red", fontWeight: "300", marginBottom: "15px" }}>Неправильный логин или пароль!</p> }
        <p className="login__reg">Еще не зарегистрированы? <Link
        to='/registration' className='login__reg-link'>Зарегистрироваться</Link></p>
      </div>
    </section>
  )
}