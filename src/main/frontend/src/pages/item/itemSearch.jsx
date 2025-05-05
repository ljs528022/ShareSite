import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory } from "../../services/getCategory";
import { getData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import ItemCard from "../../components/itemCard";
import "../../components/css/itemSearch.css";
import EmptyBox from "../../components/EmptyBox";


const ItemSearch = () => {

    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const { showToast } = useToast();

    // 카테고리 검색 란
    const [ allCate, setAllCate ] = useState([]);
    const [ itemCateKey, setItemCateKey ] = useState(0);
    const parCateKey = Math.floor(itemCateKey / 100) * 100;
    const parCate = allCate.find(c => c.cateKey === parCateKey);
    const subCate = allCate.find(c => c.cateKey === itemCateKey);

    // 카테고리 선택란 보기/숨기기
    const [ showCateQuery, setShowCateQuery ]= useState(false);

    // 가격대 검색 란
    const [ minPrice, setMinPrice ] = useState('');
    const [ maxPrice, setMaxPrice ] = useState('');

    // 검색한 상품들 관련
    const [ queriedItems, setQueriedItem ] = useState([]);
    const [ sortOption, setSortOption ] = useState("recent");
    const { avg, max, min } = getPriceStats(queriedItems);

    // 카테고리를 전부 받아오기
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await getCategory();
            setAllCate(data);
        };
        
        fetchCategories();
    }, []);

    // 카테고리 버튼에서 누른 카테고리가 있으면 받아오기
    useEffect(() => {
        const cateKey = Number(searchParams.get("category")) || 0;

        if(cateKey > 0 && cateKey !== itemCateKey) {
            setItemCateKey(cateKey);
        }
    }, [searchParams]);

    // 검색 값에 해당되는 상품들 받아오기
    useEffect(() => {
        const params = {
            keyword: searchParams.get("keyword") || undefined,
            category: itemCateKey || undefined,
            min: minPrice || undefined,
            max: maxPrice || undefined,
        };

        const queryItems = async () => {
            try {
                const response = await getData("/search", { params });
                showToast("검색한 상품들을 불러왔습니다!", "default");
                setQueriedItem(response.data);
            } catch (err) {
                showToast("통신에러가 발생했습니다...", "error");
                console.log(err);
            }
        };

        queryItems();
    }, [ itemCateKey, minPrice, maxPrice, searchParams.get("keyword") ]);

    // 카테고리 선택 란
    const renderCateQuery = () => {
        const cates = allCate.filter((cate) => {
            if(itemCateKey === 0) {
                return cate.cateKey % 100 === 0;
            }
            else if(itemCateKey % 100 === 0) {
                return Math.floor(cate.cateKey / 100) === Math.floor(itemCateKey / 100) && cate.cateKey !== itemCateKey;
            } 
            else {
                return Math.floor(cate.cateKey / 100) === Math.floor(itemCateKey / 100) && cate.cateKey !== itemCateKey && cate.cateKey !== parCate.cateKey;
            }
        });

        return (
            <div className="item-inner-box">
                <div className="item-select-box">
                    {itemCateKey === 0 ? 
                    ""
                    :
                    <label>{parCate?.catename}</label>
                    }
                    <div className="item-select-category">
                    {cates.map((cate) => {
                        return (
                            <p key={cate.cateKey} onClick={() => {
                                setItemCateKey(cate.cateKey)
                                navigate(`/search?category=${cate.cateKey}`)}}>
                                {cate.catename}
                            </p>
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }

    // 최소, 최대 금액 입력 란
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        
        if(rawValue === "") {
            if(e.target.name === 'min-price') setMinPrice('');
            if(e.target.name === 'max-price') setMaxPrice('');
            return;
        }
        
        const formatted = Number(rawValue).toLocaleString("ko-KR").toString();

        if(e.target.name === 'min-price') {
            setMinPrice(formatted);
        }
        if(e.target.name === 'max-price') {
            setMaxPrice(formatted);
        }
    }

    // 상품 정렬 기능
    const sortedItems = [...queriedItems].sort((a, b) => {
        switch (sortOption) {
            case "recent" :
                return new Date(b.writeDate) - new Date(a.writeDate);
            case "price-asc" :
                return a.price - b.price;
            case "price-desc" :
                return b.price - a.price;
            default:
                return 0;
        }
    });

    // 검색 버튼
    const handleSubmit = (e) => {
        e.preventDefault();

        const query = new URLSearchParams();

        if(itemCateKey > 0) query.append("category", itemCateKey);

        const min = minPrice.replace(/,/g, "");
        const max = maxPrice.replace(/,/g, "");

        if(min !== 0) query.append("min", min);
        if(max !== 0) query.append("max", max);

        navigate(`/search?${query.toString()}`);
    }

    return (
        <main>
            <div className="item-search-container">
                <form>
                <div className="item-search-row">
                    <div className="item-search-box">
                        <label>검색 결과</label>
                        <div className="item-inner-box">
                            <div className="item-search-category">
                                {/* 카테고리 선택 란 */}
                                <label>카테고리
                                    <button type="button" onClick={() => setShowCateQuery(prev => !prev)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.5" viewBox="0 0 448 512">
                                            {showCateQuery ?
                                            <path fill="#707070" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                                            :
                                            <path fill="#707070" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                                        }
                                        </svg>
                                    </button>
                                </label>
                                <p onClick={() => {
                                    setItemCateKey(0)
                                    navigate("/search")}}>메인</p>
                                {parCate &&
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="13"  viewBox="0 0 320 512">
                                        <path fill="#555" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                                <p onClick={
                                    () => { navigate(`/search`)
                                            setItemCateKey(0)}}>
                                    {parCate.catename}
                                </p>
                                    {subCate !== parCate &&
                                    <>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512">
                                        <path fill="#555" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                    </svg>
                                    <p onClick={() => navigate(`/search?category=${parCate.cateKey}`)}>{subCate.catename}</p>
                                    </>
                                    }
                                </>
                                }
                            </div>
                        </div>  

                        {showCateQuery && renderCateQuery()}

                        {/* 가격대 검색 란 */}
                        <div className="item-inner-box">
                            <div className="item-search-price">
                                <label>가격대</label>
                                <input type="text" autoComplete="off" value={minPrice} onChange={handlePriceChange} placeholder="최소 금액" className="item-price-input" name="min-price"/>
                                <p>~</p>
                                <input type="text" autoComplete="off" value={maxPrice} onChange={handlePriceChange} placeholder="최대 금액" className="item-price-input" name="max-price"/>
                                <button type="submit" onClick={handleSubmit}>
                                    검색
                                </button>
                            </div>
                        </div>                    
                    </div>
                </div>
                </form>
                {/* 검색한 상품들 표시 란 */}
                <div className="item-result-box">
                        <label>검색한 상품들을 비교해봤습니다!</label>
                        <div className="item-result-price">
                            <label>평균 가격</label>
                            <p>{avg.toLocaleString()}원</p>
                            <a></a>
                            <label>가장 높은 가격</label>
                            <p>{max.toLocaleString()}원</p>
                            <a></a>
                            <label>가장 낮은 가격</label>
                            <p>{min.toLocaleString()}원</p>
                        </div>
                </div>
                <div className="item-result-sort">
                    <button 
                        onClick={() => setSortOption("recent")}
                        className={sortOption === "recent" ? "sort-button-selected" : "sort-botton"}
                    >최신순</button>
                    <p> / </p>
                    <button 
                        onClick={() => setSortOption("price-desc")}
                        className={sortOption === "price-desc" ? "sort-button-selected" : "sort-botton"}
                    >높은가격순</button>
                    <p> / </p>
                    <button 
                        onClick={() => setSortOption("price-asc")}
                        className={sortOption === "price-asc" ? "sort-button-selected" : "sort-botton"}
                    >낮은가격순</button>
                </div>
                <div className="item-result-row">
                    {sortedItems.length !== 0 ? 
                    sortedItems.map(item => (
                        <ItemCard 
                            key={item.itemKey}
                            item={item} 
                            style={"Normal"}
                        />
                    ))
                    :
                    <EmptyBox content={"관련된 상품이 없습니다..! 나중에 다시 확인해주세요!"} />
                    }
                </div>
            </div>
        </main>
    )
}

// 불러온 상품들의 평군 가격, 최대 가격, 최소 가격 구하기
const getPriceStats = (items) => {
    if(!items || items.length === 0) return { avg : 0, min : 0, max : 0};

    const prices = items.map(item => Number(item.price));
    const total = prices.reduce((sum, price) => sum + price, 0);
    const avg = Math.round(total / prices.length);
    const max = Math.max(...prices);
    const min = Math.min(...prices);

    return { avg, max, min };
}


export default ItemSearch;