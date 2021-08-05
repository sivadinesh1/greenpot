import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import useUser from '../../customHooks/useUser';

const AdminIndex = () => {
	const { user, loading, loggedIn } = useUser();
	return (
		<Layout>
			<Admin>
				<h2>Admin Dashboard</h2>
			</Admin>
		</Layout>
	);
};

export default AdminIndex;
