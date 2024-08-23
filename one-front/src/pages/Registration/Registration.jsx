import './Registration.scss'
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AUTH_ACTION } from '../../store/actionCreators/isAuth';
import { useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .matches(/^[а-яА-Яa-zA-Z\s]+$/, 'Используйте только буквы и пробелы')
    .required('Обязательное поле'),
  city: Yup.string()
    .trim()
    .required("Обязательное поле")
    .min(10, "Адрес должен содержать минимум 10 символов")
    .max(255, "Адрес не должен превышать 255 символов")
    .matches(/^[a-zA-Zа-яА-ЯёЁ0-9,. -]+$/, "Адрес пользователя может содержать только буквы, цифры, пробелы, точки, запятые и дефис"),
  phoneNumber: Yup.string()
    .length(12, 'Номер телефона должен содержать ровно 12 цифр')
    .matches(/^[0-9]+$/, 'Используйте только цифры')
    .matches(/^996\d{9}$/, "Номер телефона должен начинаться с 996")
    .required('Номер телефона обязателен для заполнения'),
  email: Yup.string()
    .email('Неверный email')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .matches(
      /^[a-zA-Z0-9!@#$%^&*()_+=-?]+$/,
      'Пароль может содержать только латинские буквы, цифры и символы: !?@#$%^&*()_+='
    )
    .required('Пароль обязателен для заполнения'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
    .required('Обязателен для заполнения'),
})

export const Registration = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [step, setStep] = useState(1)
  const code = useRef('')
  const regData = useRef({})
  const passwordRef = useRef('')

  const [passwordVisible, setPasswordVisible] = useState({
    firstInput: false,
    secondInput: false,
  });

  const handleToggleVisibility = (inputName) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [inputName]: !prev[inputName],
    }))
  }

  const handleEmailCode = async (e) => {
    e.preventDefault()
    console.log(regData.current)
    try {
      const resp = await axios(`${process.env.REACT_APP_API_URL}/users/confirm/${code.current}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem('token'),
        }
      })
      console.log(resp)

      const auth = await axios(`${process.env.REACT_APP_API_URL}/test/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          email : regData.current.user.email,
          password: passwordRef.current
        })
      })
      console.log(auth)
      navigate('/profile')

    } catch(err) {
      alert(`Ошибка при подтверждении Email ${err}`)
      console.log(err)
    }
  }

  return (
    <section className="reg">
      <div className="reg__container">
        {step === 1 &&
          <div className="reg__wrapper">
            <h1 className="reg__title def-title">Зарегистрируйтесь</h1>
            <Formik
              initialValues={{
                firstName: '',
                city: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={async (values) => {
                values.name = values.firstName
                values.phone = values.phoneNumber
                values.residenceCity = values.city
                values.role = "user_role"
                delete values.phoneNumber
                delete values.confirmPassword
                delete values.firstName
                console.log(values)
                passwordRef.current = values.password
                try {
                  const resp = await axios(`${process.env.REACT_APP_API_URL}/users`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    data: JSON.stringify(values)
                  })
                  regData.current = resp.data
                  dispatch(AUTH_ACTION(`Bearer ${resp.data.access_token}`))
                  setStep(2)

                } catch(err) {
                  alert("Ошибка создания пользователя")
                  console.log(err)
                }
              }}
            >
              {({errors, touched}) => (
                <Form className="reg__form">
                  <div className="reg__inputs-wrapper">
                    <Field name="firstName" className={`reg__input def__input ${touched?.firstName && errors?.firstName ? 'reg__input-invalid' : ''}`} type="text" placeholder="ФИО" />
                    <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                  </div>
                  <div className="reg__inputs-wrapper">
                    <Field name="city" className={`reg__input def__input ${touched?.city && errors?.city ? 'reg__input-invalid' : ''}`} type="text" placeholder="Адрес проживания" />
                    <ErrorMessage name="city" component="div" className="invalid-feedback" />
                  </div>
                  <div className="reg__inputs-wrapper">
                    <Field name="phoneNumber" className={`reg__input def__input ${touched?.phoneNumber && errors?.phoneNumber ? 'reg__input-invalid' : ''}`} type="text" id="phone" placeholder="Номер телефона" />
                    <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                  </div>
                  <div className="reg__inputs-wrapper">
                    <Field name="email" className={`reg__input def__input ${touched?.email && errors?.email ? 'reg__input-invalid' : ''}`} type="email" placeholder="Почта" />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </div>
                  <div className="reg__inputs-wrapper">
                    <label className={passwordVisible.firstInput ? "verification__label new-pas__label--active" : "verification__label new-pas__label"} htmlFor="new-pass"
                      onClick={() => handleToggleVisibility('firstInput')}
                    >
                      {passwordVisible.firstInput ? (
                        <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.6801 6.35145C22.9644 6.66646 23.1218 7.0757 23.1218 7.50003C23.1218 7.92435 22.9644 8.3336 22.6801 8.6486C20.8801 10.5857 16.7829 14.3572 12.0001 14.3572C7.21723 14.3572 3.12008 10.5857 1.32008 8.6486C1.03579 8.3336 0.878418 7.92435 0.878418 7.50003C0.878418 7.0757 1.03579 6.66646 1.32008 6.35145C3.12008 4.41431 7.21723 0.642883 12.0001 0.642883C16.7829 0.642883 20.8801 4.41431 22.6801 6.35145Z" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.0001 10.9286C13.8937 10.9286 15.4287 9.39359 15.4287 7.50004C15.4287 5.6065 13.8937 4.07147 12.0001 4.07147C10.1066 4.07147 8.57153 5.6065 8.57153 7.50004C8.57153 9.39359 10.1066 10.9286 12.0001 10.9286Z" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : 
                        (
                          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.0687 7.25732C21.7202 7.84018 22.2687 8.4059 22.6802 8.85161C22.9645 9.16661 23.1218 9.57586 23.1218 10.0002C23.1218 10.4245 22.9645 10.8338 22.6802 11.1488C20.8802 13.0859 16.783 16.8573 12.0002 16.8573H11.3145" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.63437 15.3659C4.6486 14.2538 2.85433 12.8299 1.32008 11.1488C1.03579 10.8338 0.878418 10.4245 0.878418 10.0002C0.878418 9.57589 1.03579 9.16664 1.32008 8.85164C3.12008 6.91449 7.21723 3.14307 12.0001 3.14307C13.8854 3.18247 15.7306 3.69534 17.3658 4.63449" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21.4287 0.571533L2.57153 19.4287" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.58296 12.4172C8.9391 11.7772 8.57536 10.908 8.57153 10.0001C8.57153 9.09079 8.93276 8.21872 9.57574 7.57574C10.2187 6.93276 11.0908 6.57153 12.0001 6.57153C12.908 6.57536 13.7772 6.9391 14.4172 7.58296" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.9829 11.7144C14.6778 12.236 14.2401 12.6677 13.7144 12.9658" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )
                      }
                    </label>
                    <Field name="password" className={`reg__input def__input ${touched?.password && errors?.password ? 'reg__input-invalid' : ''}`} placeholder="Пароль (не менее 6 символов)" type={passwordVisible.firstInput ? "text" : "password"} />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </div>
                  <div className="reg__inputs-wrapper">
                    <label className={passwordVisible.secondInput ? "verification__label new-pas__label--active" : "verification__label new-pas__label"} htmlFor="pass-repeat"
                      onClick={() => handleToggleVisibility('secondInput')}
                    >
                      {passwordVisible.secondInput ? (
                        <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.6801 6.35145C22.9644 6.66646 23.1218 7.0757 23.1218 7.50003C23.1218 7.92435 22.9644 8.3336 22.6801 8.6486C20.8801 10.5857 16.7829 14.3572 12.0001 14.3572C7.21723 14.3572 3.12008 10.5857 1.32008 8.6486C1.03579 8.3336 0.878418 7.92435 0.878418 7.50003C0.878418 7.0757 1.03579 6.66646 1.32008 6.35145C3.12008 4.41431 7.21723 0.642883 12.0001 0.642883C16.7829 0.642883 20.8801 4.41431 22.6801 6.35145Z" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.0001 10.9286C13.8937 10.9286 15.4287 9.39359 15.4287 7.50004C15.4287 5.6065 13.8937 4.07147 12.0001 4.07147C10.1066 4.07147 8.57153 5.6065 8.57153 7.50004C8.57153 9.39359 10.1066 10.9286 12.0001 10.9286Z" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : 
                        (
                          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.0687 7.25732C21.7202 7.84018 22.2687 8.4059 22.6802 8.85161C22.9645 9.16661 23.1218 9.57586 23.1218 10.0002C23.1218 10.4245 22.9645 10.8338 22.6802 11.1488C20.8802 13.0859 16.783 16.8573 12.0002 16.8573H11.3145" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.63437 15.3659C4.6486 14.2538 2.85433 12.8299 1.32008 11.1488C1.03579 10.8338 0.878418 10.4245 0.878418 10.0002C0.878418 9.57589 1.03579 9.16664 1.32008 8.85164C3.12008 6.91449 7.21723 3.14307 12.0001 3.14307C13.8854 3.18247 15.7306 3.69534 17.3658 4.63449" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21.4287 0.571533L2.57153 19.4287" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.58296 12.4172C8.9391 11.7772 8.57536 10.908 8.57153 10.0001C8.57153 9.09079 8.93276 8.21872 9.57574 7.57574C10.2187 6.93276 11.0908 6.57153 12.0001 6.57153C12.908 6.57536 13.7772 6.9391 14.4172 7.58296" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.9829 11.7144C14.6778 12.236 14.2401 12.6677 13.7144 12.9658" stroke="#686A67" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )
                      }
                    </label>
                    <Field name="confirmPassword" className={`reg__input def__input ${touched?.confirmPassword && errors?.confirmPassword ? 'reg__input-invalid' : ''}`} placeholder="Повторите пароль" type={passwordVisible.secondInput ? "text" : "password"} />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                  </div>
                  <button className="reg__btn def__btn" type="submit">
                    Регистрация
                  </button>
                </Form>
              )}
            </Formik>
            <div className="code__text-wrapper">
              <span className="code__text">
                Уже есть аккаунт?
              </span>
              <Link to='/login' className="code__link">Войти</Link>
            </div>
          </div>
        }
        {step === 2 &&
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
              <button className="code__link" onClick={() => setStep(1)}>Ввести</button>
            </div>
          </div>
        }
      </div>
    </section>
  )
}