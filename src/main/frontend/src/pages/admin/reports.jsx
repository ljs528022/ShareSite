import { Datagrid, DeleteButton, EditButton, EmailField, List, TextField } from "react-admin";

const Reports = () => {

    return (
    <List>
        <Datagrid>
            <TextField source="id" label="ID"/>
            <TextField source="name" label="회원명"/>
            <EmailField source="email" label="이메일"/>
            <TextField source="auth" label="권한"/>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
    );
}

export default Reports;