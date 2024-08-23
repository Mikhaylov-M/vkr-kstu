import './Forgot.scss'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .matches(
      /^[a-zA-Z0-9!@#$%-?^&*()_+=]+$/,
      'Пароль может содержать только латинские буквы, цифры и символы: !@#$%^&*()_+=-'
    )
    .required('Пароль обязателен для заполнения'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
    .required('Обязателен для заполнения'),
})

export const Forgot = () => {

  const { id } = useParams()

  const navigate = useNavigate()

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

  return (
    <section className="forgot" id="forgot">
      <div className="forgot__container">
        <div className="recovery">
          <h2 className="recovery__title def__title">
            Придумайте новый пароль
          </h2>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: ''
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              delete values.confirmPassword
              console.log(values)
              try {
                const resp = await axios(`${process.env.REACT_APP_API_URL}/users/changePass/${id}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token'),
                  },
                  data: {
                    "newPassword": values.password
                  }
                })
                console.log(resp)
                alert('Пароль успешно изменён')
                navigate('/profile')
              } catch(err) {
                alert("Ошибка при смене пароля. Попробуйте ещё раз")
                console.log(err)
              }
            }}
          >
            {({errors, touched}) => (
              <Form className="recovery__form">
                <div className="recovery__inputs-wrapper">
                <label className={passwordVisible.firstInput ? "recovery__label new-pas__label--active" : "recovery__label new-pas__label"} htmlFor="new-pass"
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
                  <Field name="password" autoComplete="new-password" className={`recovery__input def__input ${touched?.password && errors?.password ? 'def__input-invalid' : ''}`} placeholder="Пароль (не менее 6 символов)" type={passwordVisible.firstInput ? "text" : "password"} />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>
                <div className="recovery__inputs-wrapper">
                  <label className={passwordVisible.secondInput ? "recovery__label new-pas__label--active" : "recovery__label new-pas__label"} htmlFor="pass-repeat"
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
                  <Field name="confirmPassword" className={`recovery__input def__input ${touched?.confirmPassword && errors?.confirmPassword ? 'def__input-invalid' : ''}`} placeholder="Повторите пароль" type={passwordVisible.secondInput ? "text" : "password"} />
                  <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                </div>
                <button className="reg__btn def__btn" type="submit">
                  Подтвердить
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  )
}