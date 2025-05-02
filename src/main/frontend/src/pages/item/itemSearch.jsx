import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory } from "../../services/getCategory";
import "../../components/css/itemSearch.css";


const ItemSearch = () => {

    const navigate = useNavigate();
    const [ serchParams ] = useSearchParams();

    const [ allCate, setAllCate ] = useState([]);
    const [ itemCateKey, setItemCateKey ] = useState(0);
    const parCateKey = Math.floor(itemCateKey / 100) * 100;
    const parCate = allCate.find(c => c.cateKey === parCateKey);
    const subCate = allCate.find(c => c.cateKey === itemCateKey);

    const [ showCateQuery, setShowCateQuery ]= useState(false);

    useEffect(() => {
        const cateKey = Number(serchParams.get("category")) || 0;

        if(cateKey > 0) {
            setItemCateKey(cateKey);
        } 
        if(cateKey % 100 !== 0) {
            setItemCateKey(cateKey);
        }
    }, [serchParams]);

    useEffect(() => {
            const fetchCategories = async () => {
                const { data } = await getCategory();
                setAllCate(data);
            };
        
            fetchCategories();
    }, []);

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
                            <p key={cate.cateKey} onClick={() => navigate(`/search?category=${cate.cateKey}`)}>
                                {cate.catename}
                            </p>
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }

    const handleSubmit = () => {

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
                                    navigate("/search?keyword=")}}>메인</p>
                                {parCate &&
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15"  viewBox="0 0 320 512">
                                        <path fill="#555" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                                <p onClick={() => navigate(`/search?category=${parCate.cateKey}`)}>{parCate.catename}</p>
                                    {subCate !== parCate &&
                                    <>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512">
                                        <path fill="#555" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                    </svg>
                                    <p onClick={() => navigate(`/search?category=${subCate.cateKey}`)}>{subCate.catename}</p>
                                    </>
                                    }
                                </>
                                }
                            </div>
                        </div>  

                        {showCateQuery && renderCateQuery()}

                        <div className="item-inner-box">
                            <div className="item-search-price">
                                <label>가격대</label>
                                <input type="text" autoComplete="off" placeholder="최소 금액" className="item-price-input" name="min-price"/>
                                <p>~</p>
                                <input type="text" autoComplete="off" placeholder="최대 금액" className="item-price-input" name="max-price"/>
                                <button type="submit" onClick={handleSubmit}>
                                    검색
                                </button>
                            </div>
                        </div>                    
                    </div>
                </div>
                </form>
                <div className="item-search-row">
                    
                </div>
            </div>
        </main>
    )

}

export default ItemSearch;