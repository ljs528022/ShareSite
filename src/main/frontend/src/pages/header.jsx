import "../components/css/header.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../services/api.jsx";
import Categorybox from '../components/categorybox.jsx';
import { useUser } from "../services/UserContext.jsx";
import { useToast } from "../components/ToastContext.jsx";
import { getCategory } from "../services/getCategory.jsx";


const Header = () => {

    // 유저 정보
    const { user, setUser } = useUser();
    const { showToast } = useToast();

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

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

    return (
        <>
        <header className='Navber_wrapper'>
            <div className="Navbar1">
                <a href="/home">
                    <span>
                        <img src="../public/SSicon.png" className='SSLogo'></img>
                    </span>
                </a>
                <div className="Searchbar">
                    <form role="search" >
                        <label onClick={null}
                        ><svg xmlns="http://www.w3.org/2000/svg" height={15} width={15} viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg></label>
                        <input id="search" className="Searchbar-input" aria-label="search-box" autoComplete="off" placeholder="어떤 상품을 찾으시나요?" name="search"
                            onKeyDown={null} />
                    </form>
                </div>
                <div className="Menu">
                    <ul>
                        <li>
                            {/* 옆에서 채팅창 나오게 만들기 (추후에) */}
                            <button onClick={() => {
                                if(user) {
                                    null;
                                } else {
                                    alert("로그인이 필요한 기능입니다!")
                                    navigate("/user/login");
                                }
                                }}>
                                <p>채팅하기</p>
                            </button>
                        </li>
                        <li>
                            <a onClick={() => {
                                if(user) {
                                    navigate("/product/write")
                                } else {
                                    alert("로그인이 필요한 기능입니다!")
                                    navigate("/user/login");
                                }
                            }}>
                                <p>판매하기</p>
                            </a>
                        </li>
                        <li>
                            <button onClick={() => {
                                if(user) {
                                    handlePopupShow();
                                } else {
                                    navigate("/user/login");
                                }
                            }}>
                            <p>MY</p>
                            </button>
                            {showPopup && user ? 
                                <div className="UserMenu">
                                    <a href={`/user?${user.userKey}`}>마이페이지</a>
                                    <div className="logout" onClick={handleLogout}>로그아웃</div>
                                </div>
                            : ""}
                        </li>
                    </ul>
                </div>
                <div className="">

                </div>
            </div>
            <div className="Navbar2">
                <div className="CategoryBox">
                    ☰ 카테고리
                    <div className="CategoryDetail">
                        <ul>
                            <Categorybox categories={categories} className={"SubCategory"} />
                        </ul>
                    </div>
                </div>
                <nav className="NavMenu">
                    <div className="NavItem">
                        <a href="/price_search">시세조회</a>
                    </div>
                    <div className="NavItem">
                        <a href="">찜한 상품</a>
                    </div>
                </nav>
            </div>
        </header>
        </>
    )
}

export default Header;