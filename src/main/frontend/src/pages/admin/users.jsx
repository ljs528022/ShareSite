import { Datagrid, EmailField, List, TextField } from "react-admin"

const Users = () => {
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
        </Datagrid>
    </List>
}

export default Users;