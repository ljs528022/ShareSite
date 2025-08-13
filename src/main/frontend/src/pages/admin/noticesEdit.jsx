import { DateField, Edit, SelectInput, SimpleForm, TextInput } from "react-admin"

const NoticeEdit = () => {

    return (
        <Edit title="공지 정보 수정">
            <SimpleForm>
                <TextInput source="subject" label="공지 제목" />
                <TextInput source="content" label="공지 내용" />
                <SelectInput source="noticeType" label="공지 종류" choices={[
                    { noticeType: 0, label: "공지"},
                    { noticeType: 1, label: "알림"},
                ]}
                optionValue="noticeType"
                optionText="label"
                />
                <DateField source="writeDate" label="작성일" />
            </SimpleForm>
        </Edit>
    )
}

export default NoticeEdit;