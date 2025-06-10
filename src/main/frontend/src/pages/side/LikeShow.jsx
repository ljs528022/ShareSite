import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { getData } from "../../services/api";
import ItemCard from "../../components/itemCard";
import EmptyBox from "../../components/EmptyBox";
import LikeButton from "../../util/LikeButton";
import "../../css/side/likeShow.css";
import { FaSearch } from "react-icons/fa";

const LikeShow = ({ isOpen, data }) => {

    const [ likedItem, setLikedItem ] = useState(null);
    const [ likesCount, setLikesCount ] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        const fetchLikedItems = async () => {
            try {
                const response = await getData(`/likeItem/${data}`);
                const { likedItems, count } = response.data;
                setLikedItem(likedItems);
                setLikesCount(count);
            } catch (err) {
                showToast("찜 목록을 불러오기 못했습니다...", "error");
                console.log(err);
            }
        }

        fetchLikedItems();
    }, [data]);

    const handleSearch = (e) => {
        e.preventDefault();

        if(!searchQuery && searchQuery.trim() === "") return setFilteredItems(likedItem);

        const matched = likedItem.filter((item) => 
            item.subject.toLowerCase().includes(searchQuery.toLowerCase()) 
        );

        setFilteredItems(matched);
    }

    const renderCardList = (items) => {
        if(!items || items.length === 0) return <EmptyBox content={"상품이 없습니다!"}/>

        if(items.length === 1) {
            return (
                <div>
                    <LikeButton item={items[0]} size={20}/>
                    <ItemCard item={items[0]} style={"Side"} />
                </div>
            );
        }

        if(items.length > 1) {
            return (
                <>
                    {items.map((i, index) => (
                        <div key={i.itemKey || index}>
                            <LikeButton item={i} size={20}/>
                            <ItemCard item={i} style={"Side"} />
                        </div>
                    ))}
                </>
            )
        }
    }

    if (!isOpen) return null;

    return (
        <>
        <div className="like-box">
            <div className="like-search">
            <label onClick={handleSearch}>
                <FaSearch size={15} color="#555"/>
            </label>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="찾는 상품을 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            </div>
        </div>
        <div className="like-box">
            <div className="like-result">
                <label>총 {likesCount} 개의 상품이 검색되었습니다</label>
                {renderCardList(!filteredItems ? likedItem : filteredItems)}
            </div>
        </div>
    </>
    )
}

export default LikeShow;