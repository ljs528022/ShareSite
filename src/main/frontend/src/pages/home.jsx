import { useEffect, useState } from "react";
import { getData } from "../services/api.jsx";
import HomeItems from './homeItems.jsx';
import "../css/pages/home.css";

const Home = () => {
    // 이번주 인기 카테고리 상품
    // 나중에 상품 많이 추가하고, WHERE절 손봐야함
    const [ weeklyItems, setWeeklyItems ] = useState([]);

    // 방금 등록된 상품
    // 나중에 상품 많이 추가하고, WHERE절 손봐야함
    const [ latestItems, setLatestItems ] = useState([]);

    // 상품들 받아오기
    useEffect(() => {
        const fetchHomeData = async () => {
            try{
                const data = await getData("/api/home");
                setWeeklyItems(data.data.weeklyItems || []);
                setLatestItems(data.data.latestItems || []);
            } catch (err) {
                console.log("Failed Load Data...", err);
            }
        };

        fetchHomeData();
    }, []);

    // tag => 표시 상품 분류용 값 (0: 이번주 인기 카테고리, 1: 방금 추가된 상품, ....)
    return (
        <>
        <main>
            <HomeItems items={weeklyItems} content={"이번주 인기 카테고리 상품"} style={"Normal"} pageBtnStyle={""} />
            <HomeItems items={latestItems} content={"방금 추가된 상품들"} style={"Normal"} pageBtnStyle={""} />
        </main>
        </>

    );
};


export default Home;