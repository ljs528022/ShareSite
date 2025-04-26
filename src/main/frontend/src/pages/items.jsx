import { useState } from 'react';
import ItemCardList from '../components/itemCardList';
import '../components/css/items.css'

const Items = ({ items, content, style, pageStyle }) => {

    return (
        <div className="Contents_wrapper">
            <div className="Product_wrapper">
                <section>
                    {content &&
                    <div className="Contents_label">
                        <h3>
                            {content}
                        </h3>
                    </div>
                    }
                    <div className="Items">
                        {/* 상품카드 담을 곳 + Pagination */}
                        <ItemCardList items={items} style={style} pageStyle={pageStyle}/>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Items;