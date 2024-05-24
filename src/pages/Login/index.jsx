import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import supabase from '../../config/supabaseConfig';
import { setUser } from '../../redux/slices/authSlice';

import styles from './Login.module.scss';

export const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChangeFormData = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmitLogin = async e => {
		e.preventDefault();
		const { email, password } = formData;

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				console.log(error);
			} else {
				dispatch(setUser(data.user));
				navigate('/');
			}
		} catch (error) {
			throw error;
		}
	};

	return (
		<div className={styles.login}>
			<form className={styles.loginForm} onSubmit={handleSubmitLogin}>
				<h3 className={styles.loginForm__title}>Авторизация</h3>
				<div className={styles.loginForm__inputs}>
					<input
						className={styles.loginForm__inputsItem}
						type='email'
						placeholder='Электронная почта'
						name='email'
						value={formData.email}
						onChange={handleChangeFormData}
					/>
					<input
						className={styles.loginForm__inputsItem}
						type='password'
						placeholder='Пароль'
						name='password'
						value={formData.password}
						onChange={handleChangeFormData}
					/>
				</div>
				<div className={styles.loginForm__links}>
					<Link to='/signup' className={styles.loginForm__linksItem}>
						Регистрация
					</Link>
					<Link to='#' className={styles.loginForm__linksItem}>
						Восстановление пароля
					</Link>
				</div>
				<button className={styles.loginForm__submit}>Войти</button>
			</form>
		</div>
	);
};
