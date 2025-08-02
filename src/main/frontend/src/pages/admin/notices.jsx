import { Datagrid, DateField, List, TextField } from "react-admin";

const Notices = () => {

    return (
        <List title="공지사항">
            <Datagrid rowClick="edit">
                <TextField source="id" label="글 번호" />
                <TextField source="subject" label="제목" />
                <TextField source="content" label="내용" />
                <DateField source="writedAt" label="작성일" />
            </Datagrid>
        </List>
    );
}

export default Notices;