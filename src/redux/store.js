import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const saveToLocalStorage = state => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('userState', serializedState);
	} catch (e) {
		console.warn('Could not save state', e);
	}
};

const loadFromLocalStorage = () => {
	try {
		const serializedState = localStorage.getItem('userState');
		if (serializedState === null) return undefined;
		return JSON.parse(serializedState);
	} catch (e) {
		console.warn('Could not load state', e);
		return undefined;
	}
};

const persistedState = loadFromLocalStorage();

const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	preloadedState: persistedState,
});

store.subscribe(() => {
	saveToLocalStorage({
		auth: store.getState().auth,
	});
});

export default store;
