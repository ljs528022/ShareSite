import "../../components/css/itemWrite.css";
import { useEffect, useState } from "react";
import { getCategory } from "../../services/getCategory";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";
import { postData } from "../../services/api";


const ItemWrite = () => {

    // 작성중인 유저 정보
    const { user } = useUser();
    const { showToast } = useToast();

    const [ categories, setCategories ] = useState([]);
    const [ itemData, setItemData ] = useState({
        userKey: "",
        cateKey: "",
        subject: "",
        content: "",
        price: 0,
        loacation: "",
        itemtype: "",
        purtype: 0,
        img: [],
    });

    const [ formattedPrice, setFormattedPrice ] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategory();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    // 상품의 값들
    const handleInput = (e) => {
        const { id, value } = e.target;
        setItemData(prev => ({ ...prev, [id]: value }));
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 5) {
            showToast("이미지는 최대 5장까지만 가능해요!");
            return;
        }

        setItemData(prev => ({ ...prev, img: files}));
    }

    // 카테고리 분류용
    const parentCate = [];
    const subCate = [];

    categories.map((cate) => {
        if(cate.cateKey % 100 === 0) {
            parentCate.push(cate)
        } else {
            subCate.push(cate)
        }
    })

    const toggleCateSelector = () => {
        
    }

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const formatted = Number(rawValue).toLocaleString("ko-KR");
        setItemData(prev => ({ ...prev, price: rawValue}));
        setFormattedPrice(formatted);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        
    }


    return (
        <>
        <main>
            <div className="write-container">
                <form className="write-from" onSubmit={null}>
                    {/* 이미지 첨부 */}
                    <div className="form-row">
                        <div className="input-img">
                            <label htmlFor="img">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                                    <path fill="#575757" d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"/>
                                </svg>
                                <span>{`${itemData.img.length} / 5`}</span>
                            </label>
                            <input id="img" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none"}} />
                            <div>

                            </div>
                        </div>
                    </div> 
                    {/* 상품명 */}
                    <div className="form-row">
                        <div className="input-subject">
                            <input id="subject" type="text" onChange={handleInput} placeholder="상품명"/>
                        </div>
                    </div>
                    {/* 카테고리 선택란 */}
                    <div className="form-row">
                        {/* 카테고리를 분류하여 세부적으로 선택할 수 있게 해야함 */}
                        <div className="input-category">
                            
                        </div>
                    </div>
                    {/* 가격란 */}
                    <div className="form-row">
                        <div className="input-price">
                            <div className="input-price-wrapper">
                                <span>₩</span>
                                <input id="price" type="text" value={formattedPrice} onChange={handlePriceChange}/>
                            </div>
                        </div>
                    </div>
                    {/* 상품 설명 란 */}
                    <div className="form-row">
                        <div className="input-content">
                            <textarea id="content" onChange={handleInput}></textarea>
                        </div>
                    </div>
                    {/* 상품 상태 선택란 */}
                    <div className="form-row">
                        <div className="input-itemtype">
                            <label>상품 상태</label>
                            <div className="radio-group">
                                <label className="radio-box">
                                    <input id="itemtype" type="radio" value={"NEW"} onChange={handleInput} checked={itemData.itemtype === "NEW"}/>
                                    <span>신품</span>
                                </label>
                                <label className="radio-box">
                                    <input id="itemtype" type="radio" value={"OLD"} onChange={handleInput} checked={itemData.itemtype === "OLD"}/>
                                    <span>중고</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 거래 방식 */}
                    <div className="form-row">
                        <div className="input-purtype">
                        <label>상품 상태</label>
                            <div className="radio-group">
                                <label className="radio-box">
                                    <input id="purtype" type="radio" value={2} onChange={handleInput} checked={itemData.purtype == 2}/>
                                    <span>직거래</span>
                                </label>
                                <label className="radio-box">
                                    <input id="purtype" type="radio" value={1} onChange={handleInput} checked={itemData.purtype == 1}/>
                                    <span>택배거래</span>
                                </label>
                                <label className="radio-box">
                                    <input id="purtype" type="radio" value={0} onChange={handleInput} checked={itemData.purtype == 0}/>
                                    <span>둘다가능</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 희망지역 */}
                    <div className="form-row">
                        <div className="location-btn">
                            <label>희망지역</label>
                            <button type="button" onClick={null}>
                                + 추가하기
                            </button>
                            <div className="location-box">
                                <ul>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>  
                    {/* 등록버튼 */}
                </form>
            </div>
        </main>
        </>
    )
};

export default ItemWrite;