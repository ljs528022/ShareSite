import { Datagrid, DateField, DeleteButton, EditButton, EmailField, List, TextField } from "react-admin";

const Reports = () => {

    return (
    <List>
        <Datagrid>
            <TextField source="id" label="신고 코드"/>
            <TextField source="reporterKey" label="신고자 코드"/>
            <TextField source="targetKey" label="신고 대상 코드"/>
            <TextField source="reason" label="신고 이유"/>
            <DateField source="createdAt" label="신고 접수 날짜"/>
        </Datagrid>
    </List>
    );
}

export default Reports;