import { useState } from 'react';
import '../components/css/items.css'

const Items = () => {

    // const [ isWeekCateItems, setIsWeekCateItems ] = useState(false);
    // const [ isLatestItems, setIsLatestItems ] = useState(false);

    // if (weekCateItems != null && latestItems == null) {
    //     setIsWeekCateItems(true);
    // }

    // if (latestItems != null && weekCateItems == null) {
    //     setIsLatestItems(true);
    // }
    

    return (
        <div className="Contents_wrapper">
            <div className="Product_wrapper">
                <section>
                    <div className="Contents_label">
                        <h3>
                            {/* { setIsWeekCateItems ? 
                                '이번주 인기 카테고리 상품' : 
                                    setIsLatestItems ? '방금 등록된 상품들' : '' } */}
                            이번주 인기 카테고리 상품
                        </h3>
                    </div>
                    <div className="Items">
                        {/* 상품카드 담을 곳 */}
                        {/* <NormalItemCard items={items} /> */}
                    <div className="Swapper_pagination">
                        {/* 상품카드 페이지 span */}
                        {/* <span className="pagination_bullet"></span> */}
                    </div>
                    <button></button>
                    <button></button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Items;