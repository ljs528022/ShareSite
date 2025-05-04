import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory } from "../../services/getCategory";
import { getData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import ItemCardList from "../../components/itemCardList";
import "../../components/css/itemSearch.css";


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

    console.log(queriedItems);

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
                <div className="item-reslt-row">
                    <label></label>
                    <div className="item-result-box">
                        <div>

                        </div>
                    </div>
                </div>
                <div className="item-result-sort">
                        <p></p> / <p></p> / <p></p>
                </div>
                <div className="item-result-row">
                    <ItemCardList 
                        items={queriedItems} 
                        style={"Normal"} 
                        pageBtnStyle={"search_"}
                        perItems={50}
                    />
                </div>
            </div>
        </main>
    )
}



export default ItemSearch;