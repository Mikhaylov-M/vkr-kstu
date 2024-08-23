import './EmailVerefication.scss'
import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const EmailVerification = () => {

  const navigate = useNavigate()
  const code = useRef('')

  const handleEmailCode = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios(`${process.env.REACT_APP_API_URL}/users/confirm/${code.current}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem('token'),
        }
      })
      console.log(resp)
      alert('Email успешно подтверждён')
      navigate('/profile')

    } catch(err) {
      alert(`Ошибка при подтверждении Email ${err}`)
      console.log(err)
    }
  }

  return (
    <div className="verification">
      <h2 className="verification__title def__title">Подтвердите почту</h2>
      <form className="verification__form">
        <div className="verification__inputs-wrapper">
          <label className="verification__label" htmlFor="#">Введите код отправленный на указанную почту</label>
          <input className="verification__input def__input" type='text' placeholder='Введите код' onInput={(e) => {
            code.current = e.target.value
          }}
          />
        </div>
        <button className="verification__btn def__btn" onClick={handleEmailCode} >Отправить</button>
      </form>
      <div className="code__text-wrapper">
        <span className="code__text">
          Хотите указать другую почту?
        </span>
        <button className="code__link" >Ввести</button>
      </div>
    </div>
  )
}