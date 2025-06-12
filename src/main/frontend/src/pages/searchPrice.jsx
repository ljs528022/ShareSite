import { useState } from "react";
import { useToast } from "../util/ToastContext";
import { getData } from "../services/api";
import { FaSearch } from "react-icons/fa";
import "../css/pages/searchPage.css";
import ItemCard from "../components/itemCard";

const SearchPrice = () => {

    // 시세 검색용 키워드
    const [ keyword, setKeyword ] = useState("");
    
    // 검색으로 불러온 상품들의 최저, 최고, 평균 가격들 + 상품들
    const [ prices, setPrices ] = useState([]);
    const [ items, setItems ] = useState([]);

    const { showToast } = useToast();

    const getPrices = async (e) => {
        e.preventDefault();

        if(keyword === "") { 
            showToast("검색할 상품을 입력해주세요", "error");
            return; 
        }

        try {
            const response = await getData(`/search/price?keyword=${keyword}`);
            if(response.status === 200) {
                const { prices, items } = response.data;
                setPrices(prices);
                setItems(items);
            }
        } catch  {
            showToast("통신 장애가 발생했습니다...", "error");
        }
    }

    const fetchPrices = (price) => {
        if(price.length === 0) return;

        const { AVG, MAX, MIN } = price[0];

        return (
            <>
            <h3 style={{marginTop: "30px"}}>{`검색한 상품에 대한 최근 시세입니다.`}</h3>
            <div className="searchPrice-info-wrapper">    
                <div className="searchPrice-info-box">
                    <label>평균 가격대</label>
                    <p>{AVG ? AVG.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "원"
                    : "-"}</p>
                </div>
                <div></div>
                <div className="searchPrice-info-box">
                    <label>최대 가격</label>
                    <p>{MAX ? MAX.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "원"
                    : "-"}</p>
                </div>
                <div></div>
                <div className="searchPrice-info-box">
                    <label>최소 가격</label>
                    <p>{MIN ? MIN.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "원"
                    : "-"}</p>
                </div>
            </div>
            </>
        )
    };

    const fetchItems = (item) => {
        if(item.length === 0) return;

        return (
            <>
            {item.map(i => (
                <ItemCard key={i.itemKey} item={i} style={"Normal"}/>    
            ))}
            </>
        )
    };

    const handleKeyword = (e) => {
        const { value } = e.target;
        setKeyword(value);
    }

    return (
    <main>
        <div className="searchPrice-wrapper">
            <h3>지금 그 물건의 시세은 얼마일까?</h3>
            <form onSubmit={(e) => getPrices(e)}>
                <div className="searchPrice-input">
                    <FaSearch size={20} />
                    <input type="text" id="keyword" value={keyword} autoComplete="off" placeholder="원하시는 상품을 검색해주세요" onChange={(e) => handleKeyword(e)}/>
                </div>
            </form>

            {/* 여기에 가격대 표시 해야 함 */}
            {fetchPrices(prices)}

            <h4 style={{fontSize: '20px'}}>검색한 시세의 상품들</h4>
            <a style={{border: '1px solid rgba(0,0,0,0.3)', marginBottom: "20px"}}></a>
            
            {/* 여기에 검색한 상품들 불러와야 함 */}
            {fetchItems(items)}

        </div>
    </main>
    );
}

export default SearchPrice;