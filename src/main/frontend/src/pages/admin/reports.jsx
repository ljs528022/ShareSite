import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ListContextProvider, useDataProvider, useListContext, useListController } from "react-admin";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import dataProvider from "./dataProvider";

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
    useEffect(() => {
        const getUsersData = async () => {
            const reporterKey = report?.reporterKey;
            const targetKey = report?.targetKey;

            const response = await getData(`/report/users?reporter=${reporterKey}&target=${targetKey}`);
            if(response.status === 200) {
                const { reporter, target } = response.data;
                setReporter(reporter);
                setTarget(target);
            }
        }
        getUsersData();
    }, [ report ]);

    const [ reporter, setReporter ] = useState(null);
    const [ target, setTarget ] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

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

    const handleDelte = async (e) => {
        e.preventDefault();

        try {
            await dataProvider.delete("reports", { id: report?.id });

            alert("신고 삭제 됨");
            navigate(0);
        } catch {
            showToast("삭제 중 문제가 발생했습니다", "error");
        }
    }

    if(!reporter && !target) return;

    return (
    <>
    <div style={{position: "fixed", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px", top: "100px", padding:"20px", backgroundColor: "#ccc", width: "50%", height: "60%", overflow: "auto", zIndex: 1}}>
        <button type="button" onClick={onClose} style={{width: "100%", textAlign: "right", cursor: "pointer"}}><FaTimes size={25} /></button>
        <Grid container spacing={0}>
            <Grid size={{xs: 12, sm: 12}}>
                <Typography variant="h7" mb={0} padding={2}>신고 날짜</Typography>
                <Typography variant="h5" mt={0} padding={2}>{report?.createdAt}</Typography>
            </Grid>
        </Grid>
        <Grid container spacing={0} mt={2}>
            <Grid size={{xs: 12, sm: 4}}>
                <Typography variant="h7" mb={0} padding={2}>신고 사유</Typography>
                <Typography variant="h5" mt={0} padding={2}>{renderReason(report?.reason)}</Typography>
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
                <Typography variant="h7" mb={0} padding={2}>신고자</Typography>
                <Typography variant="h5" mt={0} padding={2}>
                    <a href={`/user/${reporter.userKey}`} style={{textDecoration: "underline"}}>
                        {reporter.useralias}
                    </a>
                </Typography>
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
                <Typography variant="h7" mb={0} padding={2}>신고 대상</Typography>
                <Typography variant="h5" mt={0} padding={2}>
                    <a href={`/user/${target.userKey}`} style={{textDecoration: "underline"}}>
                        {target.useralias}
                    </a>    
                </Typography>
            </Grid>
        </Grid>
        <Grid container spacing={0} mt={2}>
            <Grid size={{xs: 12, sm: 12}}>
                <Typography variant="h7" mb={0} padding={2}>신고 내용</Typography>
                <Typography variant="h5" mt={0} padding={2}>{report?.content}</Typography>
            </Grid>
        </Grid>
        
        <Box mt={1} ml={2}>
            <Button variant="contained" onClick={() => {}}>처리 완료</Button>
            <Button variant="outlined" sx={{marginLeft: "10px"}} color="error" onClick={handleDelte}>삭제</Button>
        </Box>
    </div>
    </>
    );
}

export default Reports;