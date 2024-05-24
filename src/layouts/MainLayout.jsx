import { Outlet } from 'react-router-dom';

import { NavMenu } from '../components/NavMenu';

export const MainLayout = () => {
	return (
		<>
			<NavMenu />
			<main className='main'>
				<div className='container'>
					<Outlet />
				</div>
			</main>
		</>
	);
};
