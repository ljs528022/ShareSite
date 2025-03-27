import { useState } from 'react';
import ItemCards from '../components/itemCard';
import '../components/css/items.css'

const Items = ({ items, tag }) => {

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
                            {tag == 0 ? "이번주 인기 카테고리 상품" 
                                : "방금 추가된 상품들"}
                        </h3>
                    </div>
                    <div className="Items">
                        {/* 상품카드 담을 곳 + Pagination */}
                        <ItemCards items={items}/>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Items;