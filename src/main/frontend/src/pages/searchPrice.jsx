import { useEffect, useState } from "react";
import { useToast } from "../util/ToastContext";
import { getData } from "../services/api";
import { FaSearch } from "react-icons/fa";

const SearchPrice = () => {

    // 시세 검색용 키워드
    const [ keyword, setKeyword ] = useState("");
    
    // 검색으로 불러온 상품들의 최저, 최고, 평균 가격들
    const [ prices, setPrices ] = useState(null);

    const { showToast } = useToast();

    const getPrices = async () => {
        if(keyword === "") { showToast("검색할 상품을 입력해주세요", "error"); return; }

        try {
            const response = await getData(`/seach/price?keyword=${keyword}`);
            if(response.status === 200) {
                const { avg, max, min } = response.data;
                setPrices({
                    avg: avg,
                    max: max,
                    min: min
                })
            }
        } catch  {
            showToast("통신 장애가 발생했습니다...", "error");
        }
    }

    const handleKeyword = (e) => {
        const { value } = e.target;
        setKeyword(value);
    }

    return (
    <main>
        <h3>지금 그 물건의 가격은 얼마일까?</h3>
        <form onSubmit={getPrices}>
            <div className="searchPrice-wrapper">
                <div className="searchPrice-input">
                    <FaSearch size={20} />
                    <input type="text" id="keyword" value={keyword} placeholder="원하시는 상품을 검색해주세요" onChange={(e) => handleKeyword(e)}/>
                </div>
            </div>
        </form>
        {prices &&
        <div>

        </div>
        }
    </main>
    );
}

export default SearchPrice;