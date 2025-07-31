import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { ListContextProvider, useDataProvider, useListContext, useListController } from "react-admin";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Reports = () => {
    const controlProps = useListController({ 
            resource: "reports",
            sort: { field: "id", order: "DESC" },
            pagination: { page: 1, perPage: 6 },
        });
    

    return (
    <ListContextProvider value={controlProps}>
        <ReportCardList />
    </ListContextProvider>
    );
}

const ReportCardList = () => {
    const { data, page, setPage, perPage, setPerPage, total } = useListContext();
    const dataProvider = useDataProvider();
    const navigate = useNavigate();

    const [ selectedReport, setSelectedReport ] = useState(null);

    const renderReason = (reason) => {
        if(reason === "" || reason === undefined) return "이유 없음";

        const reasonMap = {
            1: "거래 불이행",
            2: "허위 매물 등록",
            3: "정보 도용 의심",
            4: "욕설 및 비난",
            5: "협박 및 무리한 요구",
        };

        return reasonMap[reason] || "기타";
    }

    return (
    <>
    <Typography variant="h5">{`총 상품 : ${total} 개`}</Typography>

    {/* 신고 내용 카드리스트 */}
    <Grid container spacing={2} marginTop={3}>
        {data?.map(r => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id}>
            <div onDoubleClick={() => setSelectedReport(r)} style={{cursor: "pointer"}}>
                <Card>
                    <CardHeader title={renderReason(r.reason)} />
                    <CardContent>
                        <Typography variant="body1">신고자: {r.reporterKey}</Typography>
                        <Typography variant="body2">{r.content}</Typography>
                    </CardContent>
                </Card>
            </div>
            </Grid>
        ))}
    </Grid>

    {selectedReport && <ReportCard report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </>
    );
}

const ReportCard = ({ report, onClose }) => {

    return (
    <>
    <div style={{position: "fixed", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px", top: "100px", padding:"20px", backgroundColor: "#ccc", width: "95.5%", height: "85%", overflow: "auto", zIndex: 1}}>
        <button type="button" onClick={onClose} style={{width: "100%", textAlign: "right", cursor: "pointer"}}><FaTimes size={25} /></button>
        <Grid container spacing={0} mt={2}>
            
        </Grid>
    </div>
    </>
    );
}

export default Reports;