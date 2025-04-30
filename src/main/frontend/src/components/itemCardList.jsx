import { useEffect, useState } from "react";
import ItemCard from "./itemCard";
import Pagination from "../util/Pagination";

const ItemCardList = ({ items, style, pageStyle, pagePerItems }) => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pagePerItem, setPagePerItem ] = useState(4);
    const [ maxPageButtons, setMaxPageButtons ] = useState(5);
    
    const item = [];
    items.map((i) => {
        item.push(i);
    });

    useEffect(() => {
        if(pagePerItems > 4) {
            setPagePerItem(pagePerItems);
        } else {
            setPagePerItem(4);
        }
    }, [pagePerItems]);

    const totalPage = Math.ceil(item.length / pagePerItem);
    const startIndex = (currentPage - 1) * pagePerItem;
    const endIndex = startIndex + pagePerItem - 1;
    const currentItems = item.slice(startIndex, endIndex + 1);

    const handlePageChange = (page) => {
        if(page < 1 || page > totalPage) return;
        setCurrentPage(page);
    }

    return (
        <>
            {currentItems.map((item, index) => (
                <ItemCard key={item.itemKey || index} item={item} style={style} />
            ))}
            <Pagination
                totalPage={totalPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                style={pageStyle}
            />
        </>
    )
}

export default ItemCardList;