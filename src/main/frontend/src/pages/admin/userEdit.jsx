import { Edit, SelectField, SimpleForm, TextInput } from "react-admin";

const UserEdit = () => {

    return (
    <Edit title="유저 정보 수정">
        <SimpleForm>
            <TextInput source="id" label="유저번호" disabled/>
            <TextInput source="username" label="아이디" disabled/>
            <TextInput source="useralias" label="비밀번호" />
            <TextInput source="email" label="이메일" />
            <SelectField source="auth" label="권한" choices={[
                { authKey: 1, auth: 'ADMIN' },
                { authKey: 2, auth: 'MEMBER' },
            ]} />
            <SelectField source="state" label="상태" choices={[
                { state: 'S' }
            ]} />

        </SimpleForm>
    </Edit>
    );
}

export default UserEdit;