import { useState } from "react";
import { Button, Datagrid, DateField, List, ListContextProvider, TextField, TextInput, useDataProvider, useListContext, useListController } from "react-admin";
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

    const [ notice, setNotice ] = useState({
        subject: "",
        content: "",
        noticeType: '0',
    })

    const addNotice = () => {
        
    }

    const handleInput = (e) => {
        const { id, value } = e.target;
        setNotice(prev => ({ ...prev, [id] : value, }));
        console.log(notice);
    }

    return (
    <>
        <Button onClick={() => setShowAdd(true)}>공지 추가</Button>
        {showAdd && 
        <div style={{display: "flex", flexDirection: "column", margin: "10px auto", width: "50%", }}>
            <div style={{ width: "55px", margin: "10px 0px", border: "1px solid black" }}>
                <select id="noticeType" onChange={handleInput}>
                    <option id="noticeType" value={0}>공지</option>
                    <option id="noticeType" value={1}>알림</option>
                </select>
            </div>
            <div>
                <label style={{ marginTop: "20px", marginBottom: "5px"}}>제목</label>
                <input id="subject" onChange={handleInput} value={notice.subject} style={{ width: "100%" }} />
            </div>
            <div>
                <label style={{ marginTop: "20px", marginBottom: "5px" }}>내용</label>
                {/* 다른 입력창으로 변경 필요함 */}
                <textarea id="content" value={notice.content} style={{ width: "100%" }}/>
            </div>
            <div style={{display: "flex", margin: "20px auto", width: "100%", justifyContent: "space-evenly"}}>
                <button type="button" onClick={addNotice} style={{ border: "3px solid #5582ff", color: "#5582ff", borderRadius: "10px", padding: "5px 20px"}}>공지 등록</button>
                <button type="button" onClick={() => setShowAdd(false)} style={{ border: "3px solid red", color: "red", borderRadius: "10px", padding: "5px 20px" }}>작성 취소</button>
            </div>
        </div>
        }
    </>
    );
}



export default Notices;