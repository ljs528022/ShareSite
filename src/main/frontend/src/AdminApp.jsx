import { Admin, Resource } from 'react-admin';
import Dashboard from './pages/admin/dashboard';
import dataProvider from './pages/admin/dataProvider';
import Users from './pages/admin/users';

const AdminApp = () => (
    <Admin basename='/admin' dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="users" list={Users} />
    </Admin>
)

export default AdminApp;