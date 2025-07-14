import { Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getData } from "../../services/api";
import { Grid } from "react-bootstrap";

const Dashboard = () => {
    const [ stats, steStats ] = useState({
        users: 0,
        posts: 0,
        reports: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getData("/api/admin/dashboard");
                const data = res.json();
                steStats(data);
            } catch (e) {
                console.error("대시보드 로딩 실패...", e);
            }
        };
        fetchStats();
    }, []);

    <Grid container spacing={2} padding={2}>
        <Grid item xs={12} md={4}>
            
        </Grid>
        <Grid item xs={12} md={4}>

        </Grid>
        <Grid item xs={12} md={4}>

        </Grid>
    </Grid>
}

export default Dashboard;
