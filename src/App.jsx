import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { selectUser } from './redux/slices/authSlice';
import { setUser } from './redux/slices/authSlice';

import './assets/scss/main.scss';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { MainPage } from './pages/MainPage';

function App() {
	const dispatch = useDispatch();

	const user = useSelector(selectUser);

	useEffect(() => {
		const savedUser = JSON.parse(localStorage.getItem('userState'))?.auth?.user;
		if (savedUser) {
			dispatch(setUser(savedUser));
		}
	}, [dispatch]);

	return (
		<Routes>
			<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
			<Route
				path='/signup'
				element={user ? <Navigate to='/' /> : <Registration />}
			/>

			<Route
				path='/'
				element={user ? <MainLayout /> : <Navigate to='/login' />}
			>
				<Route path='' element={<MainPage />} />
			</Route>
		</Routes>
	);
}

export default App;
