import { Link, useNavigate } from 'react-router-dom';
import './Info.scss';
import axios from 'axios';

export const Info = ({ personalcode, personalId, emailConfirmStatus, personalEmail }) => {

  const navigate = useNavigate()

	const copyToClipboard = () => {
		const codeText = personalcode;
		navigator.clipboard
			.writeText(codeText)
			.then(() => {
				console.log('Скопировано в буфер обмена: ' + codeText);
			})
			.catch((err) => {
				console.error('Не удалось скопировать в буфер обмена: ', err);
			});
	}

  const handleEmailConfirm = async () => {
    try {
      const resp = await axios.post(`${process.env.REACT_APP_API_URL}/users/forgot-code`, {
          "email": personalEmail
      })
      console.log(resp)

      navigate('/emailconfirm')

    } catch(err) {
      alert("Ошибка при подтверждении Email. Попробуйте ещё раз")
      console.log(err)
    }
  }
	return (
		<section className='info' id='info'>
      {emailConfirmStatus === 0 && (
        <div className="info__email-approve">
          <h3 className="info__email-approve-title">Ваша учётная запись ограничена. <button className='info__email-approve-link' onClick={handleEmailConfirm}>Пожалуйста, подтвердите свой адрес электронной почты</button></h3>
        </div>
      )}
			<div className='info__container'>
				<h2 className='info__title'>Личный профиль</h2>
				<div className='info__wrapper'>
          <div className="info__row">
            <Link to={`/forgot/${personalId}`} className="info__row-title info__row-forgot info__code-title">сменить пароль</Link>
            <h3 className='info__row-title info__code-title'>Персональный код</h3>
          </div>
					<span className='info__code' onClick={copyToClipboard}>
						ONE-{personalcode}
					</span>
				</div>
			</div>
		</section>
	)
}