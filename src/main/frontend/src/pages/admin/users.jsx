import { Datagrid, DeleteButton, EditButton, EmailField, List, TextField } from "react-admin"

const Users = () => {
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="auth" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
}

export default Users;