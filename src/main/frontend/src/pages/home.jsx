import "../components/css/home.css";
import { useEffect, useState } from "react";
import Items from './items.jsx';
import { getData } from "../services/api.jsx";

const Home = () => {
    // 이번주 인기 카테고리 상품
    const [ weeklyItems, setWeeklyItems ] = useState([]);  

    // 방금 등록된 상품
    const [ latestItems, setLatestItems ] = useState([]);

    // 상품들 받아오기
    useEffect(() => {
        const fetchHomeData = async () => {
            try{
                const data = await getData("/api/home");
                setWeeklyItems(data.weeklyItems || []);
                setLatestItems(data.latestItems || []);
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
            <Items items={weeklyItems} tag={0} />
            <Items items={latestItems} tag={1} />
        </main>
        </>

    );
};


export default Home;