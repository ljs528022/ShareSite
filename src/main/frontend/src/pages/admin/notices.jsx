import { Card, Input, Typography } from "@mui/material";
import { useState } from "react";
import { Button, Datagrid, DateField, List, ListContextProvider, TextField, TextInput, useDataProvider, useListContext, useListController } from "react-admin";
import { Radio } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Notices = () => {
    const controlProps = useListController({
        resource: "notices",
    });

    return (
    <ListContextProvider value={controlProps}>
        <FetchNotices />

    </ListContextProvider>
    );
};

const FetchNotices = () => {
    const { data } = useListContext();
    const dataProvider = useDataProvider();
    const navigate = useNavigate();

    return (
    <>
    <AddNotice dataProvider={dataProvider}/>
    {data?.length > 0 ?
    <List>
        <Datagrid>
            <TextField source="id" label="공지 번호" />
            <TextField source="subject" label="공지 제목" />
            <TextField source="content" label="공지 타입" />
            <DateField source="writeDate" label="작성일" />
        </Datagrid>
    </List>
    :
    <h3>공지가 없습니다.</h3>
    }
    </>
    );
};

const AddNotice = ({ dataProvider }) => {

    const [ showAdd, setShowAdd ] = useState(false);

    const addNotice = () => {
        
    }

    return (
    <>
        <Button onClick={() => setShowAdd(true)}>공지 추가</Button>
        {showAdd && 
        <div>
            <div>
                
            </div>
            <div>
                <label>제목</label>
                <input />
            </div>
            <div>
                <label>내용</label>
                <textarea />
            </div>
        </div>
        }
    </>
    );
}



export default Notices;