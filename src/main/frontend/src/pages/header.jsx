import "../css/pages/header.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Categorybox from '../components/categorybox.jsx';
import { useUser } from "../services/UserContext.jsx";
import { useToast } from "../util/ToastContext.jsx";
import { getCategory } from "../services/getCategory.jsx";
import ChatRoomList from "./chat/ChatRoomList.jsx";
import SidePage from "../util/sidePage.jsx";
import LikeShow from "./side/LikeShow.jsx";
import { FaSearch } from "react-icons/fa";


const Header = () => {

    // 유저 정보
    const { user, setUser } = useUser();
    const { showToast } = useToast();

    const [ categories, setCategories ] = useState([]);
    const [ keyword, setKeyword ] = useState('');
    const navigate = useNavigate();
    
    const [ showCategories, setShowCategories ] = useState(false);  // 카테고리 버튼
    const [ showLikeItem, setShowLikeItem ] = useState(false);      // 찜한 상품
    const [ showChatRooms, setShowChatRooms ] = useState(false);    // 채팅하기 버튼

    // 카테고리 받아오기
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await getCategory();
            setCategories(data);
        };

        fetchCategories();
    }, [])

    // MY PAGE Button
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupShow = () => {
        setShowPopup(prev => !prev);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
    
        setUser(null);
        showToast("로그아웃 완료! 나중에 또 들러주세요~");
        navigate("/home");
    }

    const handleKeyword = (e) => {
        setKeyword(e.target.value);
    }

    const handleSearch = () => {
        if(!keyword) {
            navigate(`/search`);
        } else {
            navigate(`/search?keyword=${keyword}`)
        }
    }

    const handleSearchKeyword = (e) => {        
        if(e.key === "Enter") {
            navigate("/search")
        }
    }

    const handleShowLikeItem = () => {
        if(!user) {
            showToast("로그인이 필요합니다!" ,"error");
            return;
        }

        setShowLikeItem(true);
    }

    return (
        <>
        <header className='Navber_wrapper'>
            <div className="Navbar-row">
                <a href="/home" className="Navbar-logo">
                    <img src="http://localhost:8093/item-images/temp/SSicon.png" className='SSLogo' />
                </a>
                <div className="Navbar-search">
                    <form role="search">
                        <label onClick={handleSearch}>
                            <FaSearch size={15} />
                        </label>
                        <input id="search" aria-label="search-box" autoComplete="off" placeholder="어떤 상품을 찾으시나요?" name="keyword"
                            onChange={handleKeyword} onKeyDown={handleSearchKeyword} />
                    </form>
                </div>
                <div className="Navbar-menu">
                    <ul>
                        <li>
                            <button onClick={() => {
                                if(user) {
                                    setShowChatRooms(true);
                                } else {
                                    showToast("로그인 후에 이용 가능한 기능입니다!", "error");
                                }
                                }}>
                                채팅하기
                            </button>
                        </li>
                        <p>|</p>
                        <li>
                            <a onClick={() => {
                                if(user) {
                                    navigate("/product/write");
                                } else {
                                    showToast("로그인 후에 이용 가능한 기능입니다!", "error");
                                }
                            }}>
                                판매하기
                            </a>
                        </li>
                        <p>|</p>
                        <li>
                            <button onClick={() => !user ? navigate("/user/login") : ""} onMouseOver={handlePopupShow} onMouseOut={handlePopupShow}>
                            {/* 로그인하면 유저 대표이미지로 변경 */}
                            {user ?
                             <img src={
                                user.userimg ?
                                `http://localhost:8093${user.userimg}`
                                :
                                `http://localhost:8093/item-images/temp/userImgTemp.png`
                            } alt={user.username} />
                             :
                             "로그인"}
                            </button>
                            {(showPopup && user) && 
                                <div className="Navbar-user" onMouseOver={handlePopupShow} onMouseOut={handlePopupShow}>
                                    <a onClick={() => navigate(`/user/${user.userKey}`)}>마이페이지</a>
                                    <div className="logout" onClick={handleLogout}>로그아웃</div>
                                </div>
                            }
                        </li>
                    </ul>
                </div>
            </div>
            <div className="Navbar-row">
                <button type="button" className="Navbar-category-btn" onClick={() => setShowCategories(!showCategories)}>
                    ☰ 카테고리
                {showCategories &&
                <div className="Navbar-category-box">
                    <ul>
                        <Categorybox categories={categories} className={"Navbar-subcategory-box"} />
                    </ul>
                </div>
                }
                </button>
                <nav className="Navbar-subMenu">
                    <div className="Navbar-item">
                        <a href="/search/price">시세조회</a>
                    </div>
                    <div className="Navbar-item">
                        <a href="/report">신고하기</a>
                    </div>
                    <div className="Navbar-item">
                        <button type="button" onClick={handleShowLikeItem}>찜한 상품</button>
                    </div>
                </nav>
            </div>
        </header>

        {/* 찜한 상품 */}
        <SidePage 
        isOpen={showLikeItem} 
        onClose={() => setShowLikeItem(false)}
        headerText={"내가 찜한 상품"}
        content={<LikeShow isOpen={showLikeItem} data={user && user.userKey} />}
        />

        {/* 채팅하기 */}
        <SidePage 
            isOpen={showChatRooms}
            onClose={() => setShowChatRooms(false)}
            content={<ChatRoomList 
                onClose={() => setShowChatRooms(false)}
            />}
        />
        </>
    )
}

export default Header;