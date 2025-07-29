import { Card, CardContent, Divider, Grid, List, ListItem, ListItemButton, ListItemText, Table, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getData } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [ stats, setStats ] = useState({
        users: 0,
        items: 0,
        reports: 0,
        latestItems: [],
        latestReports: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getData("/api/admin/dashboard");
                const data = res.data;
                setStats(data);
            } catch (e) {
                console.error("대시보드 로딩 실패...", e);
            }
        };
        fetchStats();
    }, []);

    return (
    <>
        <Grid container spacing={2} padding={2}>
            <Grid size={{ xs:12, md:4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">전체 사용자 수</Typography>
                        <Typography variant="h4">{stats.users}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs:12, md:4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">전체 게시글 수</Typography>
                        <Typography variant="h4">{stats.items}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs:12, md:4 }}>      
                <Card>
                    <CardContent>
                        <Typography variant="h6">신고 접수 수</Typography>
                        <Typography variant="h4">{stats.reports}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
            <Grid size={{ xs:12, md:6 }}>
                <Typography variant="h6" gutterBottom>월별 상품 등록수</Typography>    
                {/* 그래프 넣을 예정 */}
            </Grid>
            <Grid size={{ xs:12, md:6 }}>
                <Typography variant="h6" gutterBottom>월별 신고수</Typography>
                {/* 그래프 넣을 예정 */}
            </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={10}>
            {/* 상품 게시글 */}
            <Grid size={{ xs:12, md:6 }}>
                <Typography variant="h6" gutterBottom>최근 등록된 상품</Typography>
                <ListItemButton onClick={() => navigate("/admin/items")}>관리하기</ListItemButton>
                <List dense>
                {stats?.latestItems.length > 0 ?
                stats.latestItems.map((i) => (
                    <div key={i.itemKey}>
                        <ListItem>
                            <ListItemText primary={i.subject} secondary={new Date(i.writeDate).toLocaleDateString()}/>
                        </ListItem>
                        <Divider />
                    </div>
                ))
                :
                <Typography variant="h6">데이터 로딩에 문제가 발생했습니다...</Typography>
                }
                </List>
            </Grid>
            {/* 신고 접수글 */}
            <Grid size={{ xs:12, md:6 }}>
                <Typography variant="h6" gutterBottom>최근 접수된 신고</Typography>
                <ListItemButton onClick={() => navigate("/admin/reports")}>관리하기</ListItemButton>
                <List dense>
                {stats.latestReports.length > 0 ?
                stats.latestReports.map((r, index) => (
                <div key={index}>
                    <ListItem>
                        <ListItemText primary={r.subject}/>
                    </ListItem>
                    <Divider />
                </div>
                ))
                :
                <Typography variant="h6">데이터 로딩에 문제가 발생했습니다...</Typography>
                }
                </List>
            </Grid>
        </Grid>
    </>
    );
}

export default Dashboard;
