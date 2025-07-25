import { Admin, Resource } from 'react-admin';
import { FaCopy, FaExclamationTriangle, FaUser } from "react-icons/fa";
import Dashboard from './pages/admin/dashboard';
import dataProvider from './pages/admin/dataProvider';
import Users from './pages/admin/users';
import Items from './pages/admin/items';
import Reports from './pages/admin/reports';
import UserEdit from './pages/admin/userEdit';

const AdminApp = () => (
    <Admin basename='/admin' name="dashboard" dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="users" icon={FaUser} list={Users} edit={UserEdit} />
        <Resource name="items" icon={FaCopy} list={Items} />
        <Resource name="reports" icon={FaExclamationTriangle} list={Reports} />
    </Admin>
)

export default AdminApp;