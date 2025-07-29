import { DateInput, Edit, NumberInput, SelectInput, SimpleForm, TextInput } from "react-admin";

const UserEdit = () => {

    return (
    <Edit title="유저 정보 수정">
        <SimpleForm>
            <TextInput source="userKey" label="회원 번호" disabled/>
            <TextInput source="id" label="아이디" disabled/>
            <TextInput source="useralias" label="회원 닉네임" />
            <TextInput source="email" label="이메일" />
            <SelectInput source="auth" label="권한" choices={[
                { auth: 'ADMIN', label: "ADMIN" },
                { auth: 'MEMBER', label: "MEMBER" },
            ]} 
            optionValue="auth"
            optionText="label"
            />
            <SelectInput source="state" label="상태" choices={[
                { state: 'N', label: "일반(N)"},
                { state: 'R', label: "탈퇴 예정(R)"},
                { state: 'S', label: "탈퇴 완료(S)"},
            ]} 
            optionValue="state"
            optionText="label"
            />
            <NumberInput source="visitcnt" label="방문 수" disabled />
            <NumberInput source="tradecnt" label="거래 수" disabled />
            <TextInput source="userIntro" label="방명록" />
            <DateInput source="regDate" label="가입일" disabled />
        </SimpleForm>
    </Edit>
    );
}

export default UserEdit;