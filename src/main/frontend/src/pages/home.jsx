import "../components/css/home.css";
import { useEffect, useState } from "react";
import Items from './items.jsx';

const Home = () => {
    const [ weekCateItems, setWeekCateItems ] = useState([]);           // 이번주 인기 카테고리 상품
    const [ latestItems, setLatestItems ] = useState([]);            // 방금 등록된 상품
    const [ test, setTest ] = useState([]);

    // 이번주 인기 카테고리 상품들 받아오기 (20개)
    // useEffect(() => {

    // })

    // 방금 등록된 상품들 받아오기 (20개)
    // useEffect(() => {

    // })

    // 테스트 용
    useEffect(() => {
        fetch("/items.json")
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.d1_item)) {
                    setTest(data.d1_item);
                    // console.log(data.d1_item);
                } else {
                    throw new Error('Is Not Array Type');
                }
            })
            .catch((e) => console.error('데이터 로딩 실패...', e));
    }, []);


    return (
        <>
        <main>
            <Items items={test} />
            {/* <Items weekCateItems={weekCateItems}/>
            <Items latestItems={latestItems}/> */}
        </main>
        </>

    );
};

// function getWeekItems() {

// } 

export default Home;