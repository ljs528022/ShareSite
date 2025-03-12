import { useState } from "react";
import "../components/css/header.css";
import Categorybox from "./categorybox";


const Header = () => {
    const [categories, setCategories] = useState([
        {
            cateKey: 100,
            catename: "전자기기/IT"
        },
        {
            cateKey: 200,
            catename: "의류/패션" 
        },
        {
            cateKey: 300,
            catename: "가구/인테리어" 
        },
        {
            cateKey: 400,
            catename: "스포츠/레저" 
        },
        {
            cateKey: 500,
            catename: "책/문구" 
        },
        {
            cateKey: 600,
            catename: "생활용품" 
        },
        {
            cateKey: 700,
            catename: "유아/아동용품" 
        },
        {
            cateKey: 800,
            catename: "자동차/오토바이" 
        },
        {
            cateKey: 900,
            catename: "기타" 
        },
    ]);

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
                            {
                                categories.map(cateData => (
                                    <Categorybox key={cateData.cateKey} {...cateData} />
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <nav className="Navigation">
                    <div><a></a></div>
                    <div><a></a></div>
                </nav>
            </div>
        </header>
        </>
    )
}

export default Header;