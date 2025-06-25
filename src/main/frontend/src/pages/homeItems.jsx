import EmptyBox from '../components/EmptyBox';
import ItemCardList from '../components/itemCardList';
import "../css/pages/homeItems.css";

const HomeItems = ({ items, content, style, pageBtnStyle, perItems, showPageBtn } ) => {
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
                    {items?.length > 0 ?
                    <ItemCardList 
                    items={items} 
                    style={style} 
                    perItems={perItems}
                    showPageBtn={showPageBtn}
                    pageBtnStyle={pageBtnStyle}
                    />
                    : <EmptyBox content={"상품을 불러오는 중에 문제가 발생했습니다..."} />
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeItems;