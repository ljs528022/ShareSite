import { useEffect, useState } from "react";
import "../components/css/header.css";
import Categorybox from "./categorybox";


const Header = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/categories.json")
            .then((response) => response.json())
            .then((data) => {
                if(data && Array.isArray(data.categories)) {
                    setCategories(data.categories);
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
                        <label><svg width={24} height={24} viewBox="0 0 24 24"></svg></label>
                        <input id="search" aria-label="search-box" autoComplete="off" placeholder="어떤 상품을 찾으시나요?" name="search" />
                    </form>
                </div>
                <div className="Menu">
                    <ul>
                        <li>
                            <button onClick="">
                                <p>채팅하기</p>
                            </button>
                        </li>
                        <li>
                            <a href="/sell">
                                <p>판매하기</p>
                            </a>
                        </li>
                        <li>
                            <button onClick="">
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