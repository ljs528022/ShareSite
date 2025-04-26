import { useState } from 'react';
import ItemCardList from '../components/itemCardList';
import '../components/css/items.css'

const Items = ({ items, tag }) => {

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
                        <ItemCardList items={items} style={"Normal"}/>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Items;