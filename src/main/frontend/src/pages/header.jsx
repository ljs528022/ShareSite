import "../components/css/header.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../services/api.jsx";
import Categorybox from '../components/categorybox.jsx';
import { useUser } from "../services/UserContext.jsx";
import { useToast } from "../util/ToastContext.jsx";
import { getCategory } from "../services/getCategory.jsx";


const Header = () => {

    // 유저 정보
    const { user, setUser } = useUser();
    const { showToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [ keyword, setKeyword ] = useState('');
    const navigate = useNavigate();
    
    const [ showCategories, setShowCategories ] = useState(false);

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

    const hanSearch = () => {
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

    return (
        <>
        <header className='Navber_wrapper'>
            <div className="Navbar-row">
                <a href="/home" className="Navbar-logo">
                    <img src="http://localhost:8093/item-images/temp/SSicon.png" className='SSLogo' />
                </a>
                <div className="Navbar-search">
                    <form role="search">
                        <label onClick={hanSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" height={15} width={15} viewBox="0 0 512 512">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                            </svg>
                        </label>
                        <input id="search" aria-label="search-box" autoComplete="off" placeholder="어떤 상품을 찾으시나요?" name="keyword"
                            onChange={handleKeyword} onKeyDown={handleSearchKeyword} />
                    </form>
                </div>
                <div className="Navbar-menu">
                    <ul>
                        <li>
                            {/* 옆에서 채팅창 나오게 만들기 (추후에) */}
                            <button onClick={() => {
                                if(user) {
                                    null;
                                } else {
                                    showToast("로그인 후에 이용 가능한 기능입니다!", "error")
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
                            <button onClick={() => {
                                if(user) {
                                    handlePopupShow();
                                } else {
                                    navigate("/user/login");
                                }
                            }}>
                            {/* 로그인하면 유저 대표이미지로 변경 */}
                            {user ? "MY" : "로그인"}
                            </button>
                            {(showPopup && user) && 
                                <div className="Mavbar-user">
                                    <a href={`/user?${user.userKey}`}>마이페이지</a>
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
                        <a href="/price_search">시세조회</a>
                    </div>
                    <div className="Navbar-item">
                        {/* 클릭하면 옆에 창 나오는 기능능 */}
                        <button type="button" onClick={null}>찜한 상품</button>
                    </div>
                </nav>
            </div>
        </header>
        </>
    )
}

export default Header;