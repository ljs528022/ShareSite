import { Datagrid, DateField, DeleteButton, EditButton, EmailField, List, NumberField, TextField } from "react-admin"

const Users = () => {

    return (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="userNum" label="회원코드" />
            <TextField source="id" label="ID"/>
            <TextField source="name" label="회원명"/>
            <EmailField source="email" label="이메일"/>
            <TextField source="regType" label="가입 유형"/>
            <TextField source="state" label="상태"/>
            <NumberField source="visitcnt" label="방문 수"/>
            <NumberField source="tradecnt" label="거래 수"/>
            <DateField source="regDate" label="가입일"/>
            <DateField source="editedDate" label="회원 정보 수정일"/>
            <TextField source="auth" label="권한"/>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
    );
}

export default Users;