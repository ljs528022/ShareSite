import { useState } from 'react';
import ItemCardList from '../components/itemCardList';
import '../components/css/items.css'

const Items = ({ items, content, style, pageBtnStyle, perItems, showPageBtn } ) => {
    if(!items) return;

    return (
        <div className="Contents_wrapper">
            <div className="Product_wrapper">
                {content &&
                <h3>
                    {content}
                </h3>
                }
                <div className="Items">
                    <ItemCardList 
                        items={items} 
                        style={style} 
                        perItems={perItems}
                        showPageBtn={showPageBtn}
                        pageBtnStyle={pageBtnStyle}
                    />
                </div>
            </div>
        </div>
    )
}

export default Items;