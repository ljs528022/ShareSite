import "../../css/pages/itemWrite.css";
import { useEffect, useState} from "react";
import { getCategory } from "../../services/getCategory";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";
import { postData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import SidePage from "../../util/sidePage";
import SearchPostCode from "../../util/SearchPostCode";
import { FaCamera } from "react-icons/fa";


const ItemWrite = () => {

    const navigate = useNavigate();

    // 작성중인 유저 정보
    const { user } = useUser();
    const { showToast } = useToast();

    const [ categories, setCategories ] = useState([]); // 카테고리 정보
    const [ itemData, setItemData ] = useState({
        userKey: "",
        cateKey: "",
        subject: "",
        content: "",
        price: 0,
        location: [],
        itemtype: "",
        purtype: 0,
        img: [],
    }); // 상품 정보

    const [ formattedPrice, setFormattedPrice ] = useState(0);
    const [ selectedCate, setSelectedCate ] = useState(null);
    const [ pcateSelected, setPcateSelected ] = useState(false);
    const [ addLocation, setAddLocation ] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategory();
            setCategories(data.data);
        };

        if(user) {
            setItemData(prev => ({ ...prev, userKey: user.userKey}));
        }

        fetchCategories();
    }, [ user ]);

    // 상품의 값들
    const handleInput = (e) => {
        const { id, value } = e.target;
        setItemData(prev => ({ ...prev, [id]: value }));
    };

    // 이미지 삽입 부분
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        e.target.value = null;

        if(files.length > 5 || itemData.img.length + files.length > 5) {
            showToast("이미지는 최대 5장까지만 가능해요!", "error");
            return;
        }

        const newImgs = files.map((file, index) => ({
            file,
            isMain: itemData.img.length === 0 && index === 0 
        }));

        setItemData(prev => ({ ...prev, img: [...prev.img, ...newImgs]}));
    }

    const setMainImage = (index) => {
        setItemData(prev => ({
            ...prev,
            img: prev.img.map((img, i) => ({
                ...img,
                isMain: i === index
            }))
        }));
    };
    
    const handleDeleteImage = (index) => {
        setItemData(prev => {
            const newImgList = prev.img.filter((_, idx) => idx !== index);

            const hasMain = newImgList.some(img => img.isMain);
            const updated = hasMain && newImgList.length > 0 
                ? newImgList.map((img, idx) => ({
                    ...img,
                    isMain: idx === 0
                }))
                : newImgList

            return {
                ...prev,
                img: updated
            }
        });
    };

    // 카테고리 분류용
    const parentCate = [];
    const subCate = [];

    categories.map((cate) => {
        if(cate.cateKey % 100 === 0) {
            parentCate.push(cate)
        } else {
            subCate.push(cate)
        }
    });

    const handleCateClick = (cateKey) => {
        const fakeEvent = {
            target: {
                id: "cateKey",
                value: cateKey
            }
        };
        handleInput(fakeEvent);
        setSelectedCate(cateKey);
    }

    const togglePcateSelected = (e) => {
        if(selectedCate === null) {
            handleCateClick(e.target.value);
            setPcateSelected(true);
        }
        if(selectedCate != e.target.value) {
            handleCateClick(e.target.value);
            setPcateSelected(true);
        }
    }

    // 가격
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const formatted = Number(rawValue).toLocaleString("ko-KR");
        setItemData(prev => ({ ...prev, price: rawValue}));
        setFormattedPrice(formatted);
    }

    // 희망 거래 지역
    const handleLocationChange = (newLocation) => {
        if (itemData.location.length >= 3) {
            alert("최대 3개까지 등록 가능합니다.");
            setAddLocation(false);
            return;
        }

        setItemData(prev => ({
            ...prev,
            location: [...prev.location, {
                userKey: user.userKey,
                useralias: user.useralias,
                address: newLocation.address,
                zoneCode: newLocation.zoneCode,
            }]
        }))
        setAddLocation(false);
    }
 
    // Submit Part
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!itemData.subject || !itemData.content || !itemData.price || !itemData.cateKey || !itemData.itemtype) {
            showToast("입력되지 않은 항목이 있는거 같습니다. 확인해주세요!", "error");
            return;
        } 

        try {
            const itemPart = {
                userKey: itemData.userKey,
                cateKey: itemData.cateKey,
                subject: itemData.subject,
                content: itemData.content,
                price: itemData.price,
                itemtype: itemData.itemtype,
                purtype: itemData.purtype,
                locations: itemData.location,
            }

            const formData = new FormData();
            formData.append("item", new Blob([JSON.stringify(itemPart)], { type: "application/json" }));

            if (itemData.img.length > 0) {
                itemData.img.forEach((img) => {
                    formData.append("img", img.file);
                })

                const imgMeta = itemData.img.map(img => ({ isMain: img.isMain }));
                formData.append("imgMeta", new Blob([JSON.stringify(imgMeta)], { type:  "application/json" }));
            }

            const token = sessionStorage.getItem("token");
            const response = await postData("/product/write", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if(response.status === 200) {
                const itemKey = response.data.itemKey;
                showToast("상품 등록이 완료되었습니다!", "success");
                navigate(`/product/${itemKey}`);
            } else {
                showToast("상품 등록에 실패했습니다...", "error");
            }
        } catch (err) {
            console.log("Failed To Post Item...", err);
            showToast("오류가 발생했습니다!", "error");
        }
    };

    return (
        <>
        <main>
            <div className="write-container">
                <form className="write-form" onSubmit={handleSubmit}>
                    {/* 이미지 첨부 */}
                    <div className="form-row">
                        <div className="input-img">
                            <label htmlFor="img">
                                <FaCamera size={20} color="#575757" />
                                <span>{`${itemData.img.length} / 5`}</span>
                            </label>
                            <input id="img" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none"}} />
                            <div className="img-box">
                                {itemData.img.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`img-thumb${img.isMain ? " main" : ""}`}
                                        onClick={() => setMainImage(index)}
                                    >
                                        {img.isMain ? <span className="badge">MAIN</span> : <span className="empty">임시데이터</span>}
                                        <span className="img-delete-btn" onClick={() => handleDeleteImage(index)}>X</span>
                                        <img
                                            src={URL.createObjectURL(img.file)}
                                            alt={`preview-${index}`} />
                                    </div>
                                ))}
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
                            <label>카테고리 선택</label>
                            <div className="category-wrapper">
                                <div className={pcateSelected ? "parent-category-selected" : "parent-category"}>
                                    {parentCate.map((pcate) => (
                                        <button 
                                            key={pcate.cateKey}
                                            type="button"
                                            className={selectedCate == pcate.cateKey ? "selected" : ""}
                                            value={pcate.cateKey}
                                            onClick={togglePcateSelected}>
                                            {pcate.catename}
                                        </button>
                                        ))}
                                </div>
                                {pcateSelected &&
                                <div className="sub-category">
                                    {subCate
                                        .filter(sub => Math.floor(sub.cateKey / 100) * 100 === Math.floor(selectedCate / 100) * 100)
                                        .map(scate => (
                                            <button
                                                key={scate.cateKey}
                                                className={selectedCate === scate.cateKey ? "selected" : ""}
                                                type="button"
                                                value={scate.cateKey} 
                                                onClick={() => handleCateClick(scate.cateKey)}>
                                            {scate.catename}
                                            </button>
                                    ))}
                                </div>
                                }
                            </div>
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
                            <textarea id="content" placeholder="상품 정보를 입력해주세요..." onChange={handleInput} />
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
                        <div className="location-wrapper">
                            <label>희망지역</label>
                            <div className="location-btn">
                                <button type="button" onClick={() => setAddLocation(prev => !prev)}>
                                    {addLocation ? "닫기" : "+ 추가하기"}
                                </button>
                            </div>
                                <div className="location-box">
                                    <ul>
                                        {itemData.location.map((loc, index) => (
                                            <>
                                            <li key={loc.id || index}>
                                                {loc.address}
                                            </li>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setItemData(prev => ({
                                                        ...prev,
                                                        location: prev.location.filter((_, i) => i !== index)
                                                }))}
                                            >x</button>
                                            </>
                                        ))}
                                    </ul>
                                </div>
                        </div>
                    </div> 
                    <SidePage 
                        isOpen={addLocation}
                        onClose={() => {setAddLocation(false)}}
                        headerText={"희망 거래 지역 추가"}
                        content={
                        <SearchPostCode onComplete={handleLocationChange} />
                        }
                    />

                    {/* 등록버튼 */}
                    <button className="item-submit" type="submit">등록</button>

                </form>
            </div>
        </main>
        </>
    )
};

export default ItemWrite;