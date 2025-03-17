import "../components/css/home.css";
import { useEffect, useState } from "react";
import Items from './items.jsx';

const Home = () => {
    const [ weekCateItems, setWeekCateItems ] = useState([]);           // 이번주 인기 카테고리 상품
    const [ latestItems, setLatestItems ] = useState([]);              // 방금 등록된 상품
    

    // 이번주 인기 카테고리 상품들 받아오기 (20개)
    // useEffect(() => {

    // })

    // 방금 등록된 상품들 받아오기 (20개)
    // useEffect(() => {

    // })

    return (
        <>
        <main>
            <Items weekCateItems={weekCateItems}/>
            <Items latestItems={latestItems}/>
        </main>
        </>

    );
};

// function getWeekItems() {

// } 

export default Home;