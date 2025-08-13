import { useState } from "react";
import { Button, Datagrid, DateField, DeleteButton, EditButton, List, ListContextProvider, TextArrayInput, TextField, TextInput, useDataProvider, useListContext, useListController } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import { Box } from "@mui/material";

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
    <AddNotice dataProvider={dataProvider} navigate={navigate}/>
    {data?.length > 0 ?
    <List>
        <Datagrid>
            <TextField source="id" label="공지 번호" />
            <TextField source="subject" label="공지 제목" />
            <TextField source="content" label="공지 내용" />
            <TextField source="noticeType" label="공지 종류" />
            <DateField source="writeDate" label="작성일" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
    :
    <h3>공지가 없습니다.</h3>
    }
    </>
    );
};

const AddNotice = ({ dataProvider, navigate }) => {

    const [ showAdd, setShowAdd ] = useState(false);

    const { showToast } = useToast();

    const [ notice, setNotice ] = useState({
        subject: "",
        content: "",
        noticeType: "",
    })

    const addNotice = async (e) => {
        e.preventDefault();

        try {
            await dataProvider.create("notices", {
                data: {
                    subject: notice.subject,
                    content: notice.content,
                    noticeType: notice.noticeType,
                }
            });

            alert("공지 등록 완료");
            navigate(0);
        } catch {
            showToast("통신에 문제가 발생했습니다.", "error")
        }
        
    }

    const handleInput = (e) => {
        const { id, value } = e.target;
        setNotice(prev => ({ ...prev, [id] : value, }));
    }

    return (
    <>
        <Button onClick={() => setShowAdd(true)}>공지 추가</Button>
        {showAdd && 
        <div style={{display: "flex", flexDirection: "column", margin: "10px auto", padding: "10px 20px", width: "50%", border: "3px solid #999", borderRadius: "10px" }}>
            <div style={{ width: "55px", margin: "10px 0px", border: "1px solid black" }}>
                <select id="noticeType" value={notice.noticeType} onChange={handleInput}>
                    <option value={''}>종류</option>
                    <option value={'0'}>공지</option>
                    <option value={'1'}>알림</option>
                </select>
            </div>
            <div>
                <label style={{ marginTop: "20px", marginBottom: "5px"}}>제목</label>
                <input id="subject" onChange={handleInput} style={{ width: "100%" }} />
            </div>
            <div>
                <label style={{ marginTop: "20px", marginBottom: "5px" }}>내용</label>
                <textarea id="content" onChange={handleInput} 
                    style={{ width: "100%", height: "150px", backgroundColor: "#ddd", borderRadius: "10px", padding: "15px", outline: "none", resize: "none" }}
                />
            </div>
            <Box margin={"8px auto"}>
                <Button variant="contained" size="big" onClick={addNotice}>작성 완료</Button>
                <Button variant="outlined" sx={{marginLeft: "20px"}} size="big" color="error" onClick={() => setShowAdd(false)}>작성 취소</Button>
            </Box>
        </div>
        }
    </>
    );
}



export default Notices;