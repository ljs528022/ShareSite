import { useEffect, useState } from "react";
import "../components/css/header.css";
import Categorybox from '../components/categorybox.jsx';
import { useNavigate } from "react-router-dom";


const Header = () => {

    const [ user, setUser ] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate("/");

    // 유저 정보 받아오기
    

    // 카테고리 받아오기
    useEffect(() => {
        fetch("/categories.json")
            .then((response) => response.json())
            .then((data) => {
                if(data && Array.isArray(data.d1_category)) {
                    setCategories(data.d1_category);
                } else {
                    throw new Error('Is Not Array Type');
                }
            })
            .catch((e) => console.error('데이터 로딩 실패', e));
    }, []);

    

    return (
        <>
        <header className='Navber_wrapper'>
            <div className="Navbar1">
                <a href="/">
                    <span>
                        <img src=".\public\SSicon.png" className='SSLogo'></img>
                    </span>
                </a>
                <div className="Searchbar">
                    <form role="search" >
                        <label><svg xmlns="http://www.w3.org/2000/svg" height={15} width={15} viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg></label>
                        <input id="search" aria-label="search-box" autoComplete="off" placeholder="어떤 상품을 찾으시나요?" name="search" />
                    </form>
                </div>
                <div className="Menu">
                    <ul>
                        <li>
                            <button onClick={() => {user === "" ? "" : navigate("/login")}}>
                                <p>채팅하기</p>
                            </button>
                        </li>
                        <li>
                            <a href={user === "" ? "/sell" : "/login"}>
                                <p>판매하기</p>
                            </a>
                        </li>
                        <li>
                            <button onClick={() => {user === "" ? navigate(`/user?${1}`): navigate(`/login`)}}>
                            <p>MY</p>
                            </button>
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