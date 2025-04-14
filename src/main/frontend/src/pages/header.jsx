import { useEffect, useState } from "react";
import "../components/css/header.css";
import { useNavigate } from "react-router-dom";
import { getData } from "../services/api.jsx";
import Categorybox from '../components/categorybox.jsx';


const Header = ({ user }) => {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // 유저 정보 받아오기

    // 카테고리 받아오기
    useEffect(() => {
        getData("/api/category")
        .then(data => setCategories(data))
        .catch(err => console.log("Failed Load Category: ", err));
    }, [])    

    // MY PAGE Button
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupShow = () => {
        setShowPopup(prev => !prev);
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
                            <button onClick={() => {user ? "" : navigate("/user/login")}}>
                                <p>채팅하기</p>
                            </button>
                        </li>
                        <li>
                            <a href={user === "" ? "/sell" : "/user/login"}>
                                <p>판매하기</p>
                            </a>
                        </li>
                        <li>
                            <button onClick={() => {user ? handlePopupShow : navigate(`/user/login`)}}>
                            <p>MY</p>
                            </button>
                            {showPopup ? 
                                <div className="UserMenu">
                                    <a href={``}>마이페이지</a>
                                    <a onClick={null}>로그아웃</a>
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
                            <Categorybox categories={categories} />
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