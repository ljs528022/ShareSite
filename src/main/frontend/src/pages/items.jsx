import { useState } from 'react';
import ItemCardList from '../components/itemCardList';
import '../components/css/items.css'

const Items = ({ items, content, style, pageStyle }) => {

    return (
        <div className="Contents_wrapper">
            <div className="Product_wrapper">
                {content &&
                <h3>
                    {content}
                </h3>
                }
                <div className="Items">
                    <ItemCardList items={items} style={style} pageStyle={pageStyle}/>
                </div>
            </div>
        </div>
    )
}

export default Items;