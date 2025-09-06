import { useForm } from 'react-hook-form'
import styles from './App.module.css'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef } from 'react'

const sendFormData = (formData) => {
	console.log(formData)
}

const fieldsSchema = yup.object()
	.shape({
		email: yup.string()
			.matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/, 'Неверный email. Проверьте ваш email на соответствие RFC 5322'),
		password: yup.string()
			.matches(/(?=.*[a-z])(?=.*[A-Z])/, 'Некорректный пароль. Пароль должен содержать хотя бы 1 строчную и 1 заглавную букву')
			.matches(/(?=.*\d)(?=.*[!@#$%^&*])/, 'Некорректный пароль. Пароль должен содержать хотя бы 1 цифру и символ !@#$%^&*')
			.min(8, 'Некорректный пароль. Пароль должен быть не менее 8 символов'),
		repeatPassword: yup.string()
			.required('Ошибка. Повторите пароль')
			.oneOf([yup.ref('password')], 'Некорректный повтор пароля. Пароли должны совпадать')
	})

export function App() {
	const submitButtonRef = useRef(null)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid, touchedFields },
		trigger,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			repeatPassword: ''
		},
		resolver: yupResolver(fieldsSchema)
	})

	const repeatPassword = watch('repeatPassword')
	const password = watch('password')

	useEffect(() => {
		if (touchedFields.repeatPassword) {
			trigger('repeatPassword')
		}
	}, [password, touchedFields.repeatPassword, trigger])

	useEffect(() => {
		if (repeatPassword && isValid) {
			submitButtonRef.current?.focus()
		}
	}, [repeatPassword, isValid])

	const emailError = errors.email?.message
	const passwordError = errors.password?.message
	const repeatPasswordError = errors.repeatPassword?.message

  return (
    <div className={styles.app}>
		<form className={styles.formLabel} onSubmit={handleSubmit(sendFormData)}>Новый пользователь
			{emailError && <div className={styles.errorLabel}>{emailError}</div>}
			{passwordError && <div className={styles.errorLabel}>{passwordError}</div>}
			{repeatPasswordError && <div className={styles.errorLabel}>{repeatPasswordError}</div>}
			<input name='email' type="text" placeholder='Email' {...register('email')} />
			<input name='password' type="password" placeholder='Пароль' {...register('password')} />
			<input name='repeatPassword' type="password" placeholder='Повторите пароль' {...register('repeatPassword')} />
			<button ref={submitButtonRef} type='submit' disabled={!!emailError || !!passwordError || !!repeatPasswordError}>Зарегистрироваться</button>
		</form>
	</div>
  )
}
