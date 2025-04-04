import "../components/css/home.css";
import { useEffect, useState } from "react";
import Items from './items.jsx';
import { getData } from "../services/api.jsx";

const Home = () => {
    // 이번주 인기 카테고리 상품
    const [ weeklyItems, setWeeklyItems ] = useState([]);  
    // 방금 등록된 상품
    const [ latestItems, setLatestItems ] = useState([]);
    const [ test, setTest ] = useState([]);

    // 이번주 인기 카테고리 상품들 받아오기 (20개)
    useEffect(() => {
        getData("/home")
        .then(data => {
            console.log(data);
            setWeeklyItems(data);
        });
    }, [])

    // 방금 등록된 상품들 받아오기 (20개)
    useEffect(() => {
        getData("/home")
        .then(data => {
            console.log(data);
            setLatestItems(data);
        })  
    }, [])

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

    // tag => 표시 상품 분류용 값 (0: 이번주 인기 카테고리, 1: 방금 추가된 상품, ....)
    return (
        <>
        <main>
            <Items items={test} tag={0} />
            <Items items={test} tag={1} />
        </main>
        </>

    );
};


export default Home;