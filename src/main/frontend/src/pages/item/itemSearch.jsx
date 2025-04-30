import "../../components/css/itemSearch.css";

const ItemSearch = () => {


    return (
        <main>
            <div className="item-search-container">
                <div className="item-search-row">
                    <div className="item-search-box">
                        <label>검색 결과</label>
                        <div className="item-inner-box">
                            <div className="item-search-category">
                                <label>카테고리</label>
                                <p>메인</p>
                                
                                <p>큰 카테고리</p>

                                <p>세부 카테고리</p>
                            </div>
                            <div className="item-select-category">

                            </div>
                        </div>
                        <div className="item-inner-box">
                            <div className="item-search-price">
                                <label>가격대</label>
                                <input type="text" className="item-price-input" name="min-price"/>
                                <p>~</p>
                                <input type="text" className="item-price-input" name="max-price"/>
                                <button type="submit">
                                    검색
                                </button>
                            </div>
                        </div>                    
                    </div>
                </div>
                <div className="item-search-row">
                    
                </div>
            </div>
        </main>
    )

}

export default ItemSearch;