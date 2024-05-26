import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseConfig';

import styles from './Registration.module.scss';

export const Registration = () => {
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleChangeFormData = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const navigate = useNavigate();

	const handleSubmitRegistration = async e => {
		e.preventDefault();
		const { email, password, fullName } = formData;

		try {
			const { data, error } = await supabase.auth.signUp({
				email: email,
				password: password,
				full_name: fullName,
			});
			console.log(error);
			navigate('/');
		} catch (error) {
			throw error;
		}
	};

	return (
		<div className={styles.registration}>
			<form
				className={styles.registrationForm}
				onSubmit={handleSubmitRegistration}
			>
				<h3 className={styles.registrationForm__title}>Регистрация</h3>
				<div className={styles.registrationForm__inputs}>
					<input
						className={styles.registrationForm__inputsItem}
						type='text'
						placeholder='Фамилия и имя'
						name='fullName'
						value={formData.fullName}
						onChange={handleChangeFormData}
					/>
					<input
						className={styles.registrationForm__inputsItem}
						type='email'
						placeholder='Электронная почта'
						name='email'
						value={formData.email}
						onChange={handleChangeFormData}
					/>
					<input
						className={styles.registrationForm__inputsItem}
						type='password'
						placeholder='Пароль'
						name='password'
						value={formData.password}
						onChange={handleChangeFormData}
					/>
					<input
						className={styles.registrationForm__inputsItem}
						type='password'
						placeholder='Подтвердите пароль'
						name='confirmPassword'
						value={formData.confirmPassword}
						onChange={handleChangeFormData}
					/>
				</div>
				<div className={styles.registrationForm__links}>
					<Link to='/login' className={styles.registrationForm__linksItem}>
						Авторизация
					</Link>
				</div>
				<button className={styles.registrationForm__submit}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
