import "../components/css/home.css";
import { useEffect, useState } from "react";

const Home = () => {
    const [ items, setItems ] = useState([]);

    

    return (
        <>
            <div className="Contents_wrapper">
                <div className="Contents_label">
                    <h3>이번주 인기 카테고리 상품</h3>
                </div>
                <div className="Contents_swapper">
                    <div className="Contents">

                    </div>
                    <button></button>
                    <button></button>
                </div>
                <div></div>
            </div>
        </>

    );
};

// function getWeekItems() {

// } 

export default Home;