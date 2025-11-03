import "../css/pages/header.css";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../services/UserContext.jsx";
import { useToast } from "../util/ToastContext.jsx";
import { getCategory } from "../services/getCategory.jsx";
import ChatRoomList from "./chat/ChatRoomList.jsx";
import Categorybox from '../components/categorybox.jsx';
import SidePage from "../util/SidePage.jsx";
import LikeShow from "./side/LikeShow.jsx";
import UserSidePage from "./side/UserSidePage.jsx";


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

    // 유저 상태 확인하기
    useEffect(() => {
        if(!user) return;

        if(user.state === "S") {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            setUser(null);
            showToast("탈퇴한 계정입니다. Home으로 돌아갑니다.");
        }
    })

    // 카테고리 받아오기
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await getCategory();
            setCategories(data);
        };

        fetchCategories();
    }, [])

    // 마이페이지 버튼 토글
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupShow = () => {
        setShowPopup(prev => !prev);
    }

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
    
        setUser(null);
        showToast("로그아웃 완료! 나중에 또 들러주세요~");
        navigate("/");
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
                <a href="/" className="Navbar-logo">
                    <img src="http://localhost:5178/uploads/temp/SSicon.png" className='SSLogo' />
                    
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
                                `http://localhost:5178${user.userimg}`
                                :
                                `http://localhost:5178/uploads/temp/userImgTemp.png`
                            } alt={user.username} onClick={setShowPopup(true)}/>
                             :
                             "로그인"}
                            </button>
                            {(showPopup && user) &&
                            // 유저용 사이트 페이지
                            // 신규 채팅, 거래 내역, 마이페이지 이동, 로그아웃 처리 
                            <SidePage
                                isOpen={showPopup}
                                onClose={setShowPopup(false)}
                                content={<UserSidePage isOpen={showPopup} logout={handleLogout} />}
                            />
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
                        <a href="/notice">공지사항</a>
                    </div>
                    <div className="Navbar-item">
                        <a href="/search/price">시세 조회</a>
                    </div>
                    <div className="Navbar-item">
                        <a href="/report">신고 조회</a>
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