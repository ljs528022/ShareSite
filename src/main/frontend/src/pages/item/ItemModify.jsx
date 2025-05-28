import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import { useUser } from "../../services/UserContext";
import SidePage from "../../util/sidePage";
import SearchPostCode from "../../util/SearchPostCode";
import Modal from "../../util/Modal";

const ItemModify = () => {

    const { itemKey } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const item = location.state?.item || [];
    const category = location.state?.category || [];

    const [ formattedPrice, setFormattedPrice ] = useState('');
    const [ selectedCate, setSelectedCate ] = useState(null);
    const [ pcateSelected, setPcateSelected ] = useState(false);
    const [ addLocation, setAddLocation ] = useState(false);

    const { user } = useUser();
    const [ modifiedItem, setModifiedItem ] = useState({
        itemKey: itemKey,
        userKey: item.userKey,
        cateKey: item.cateKey,
        subject: item.subject,
        content: item.content,
        price: item.price,
        location: item.locations,
        itemtype: item.itemtype,
        purtype: item.purtype,
        img: item.images,
    });

    const [ showDelete, setShowDelete ] = useState(false);
    const { showToast } = useToast();
    
    // 상품의 값들
    const handleInput = (e) => {
        const { id, value } = e.target;
        setModifiedItem(prev => ({ ...prev, [id]: value }));
    };

    // 이미지 삽입 부분
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        e.target.value = null;

        if(files.length > 5 || modifiedItem.img.length + files.length > 5) {
            showToast("이미지는 최대 5장까지만 가능해요!", "error");
            return;
        }

        const newImgs = files.map((file, index) => ({
            file,
            main: modifiedItem.img.length === 0 && index === 0 
        }));

        setModifiedItem(prev => ({ ...prev, img: [...prev.img, ...newImgs]}));
    }

    const setMainImage = (index) => {
        setModifiedItem(prev => ({
            ...prev,
            img: prev.img.map((img, i) => ({
                ...img,
                main: i === index
            }))
        }));
    };
    
    const handleDeleteImage = (index) => {
        setModifiedItem(prev => {
            const newImgList = prev.img.filter((_, idx) => idx !== index);

            const hasMain = newImgList.some(img => img.main);
            const updated = hasMain && newImgList.length > 0 
                ? newImgList.map((img, idx) => ({
                    ...img,
                    main: idx === 0
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

    category.map((cate) => {
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
        setModifiedItem(prev => ({ ...prev, price: rawValue}));
        setFormattedPrice(formatted);
    }

    // 희망 거래 지역
    const handleLocationChange = ( newLocation) => {
        if (modifiedItem.location.length >= 3) {
            alert("최대 3개까지 등록 가능합니다.");
            setAddLocation(false);
            return;
        }

        setModifiedItem(prev => ({
            ...prev,
            location: [...prev.location, {
                userKey: user.userKey,
                useralias: user.useralias,
                address: newLocation.address,
                zoneCode: newLocation.zoneCode,
            }]
        }))
        setAddLocation(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!modifiedItem.subject || !modifiedItem.content || !modifiedItem.price || !modifiedItem.cateKey || !modifiedItem.itemtype) {
            showToast("입력되지 않은 항목이 있는거 같습니다. 확인해주세요!", "error");
            return;
        }

        try {
            const itemPart = {
                userKey: modifiedItem.userKey,
                cateKey: modifiedItem.cateKey,
                subject: modifiedItem.subject,
                content: modifiedItem.content,
                price: modifiedItem.price,
                itemtype: modifiedItem.itemtype,
                purtype: modifiedItem.purtype,
                locations: modifiedItem.location,
            }

            const formData = new FormData();
            formData.append("item", new Blob([JSON.stringify(itemPart)], { type: "application/json" }));

            if(modifiedItem.img.length > 0) {
                modifiedItem.img.forEach((img) => {
                    if(img.file) {
                        formData.append("images", img.file);
                    }
                });

                const existingImageUrls = modifiedItem.img
                .filter(img => !img.file)
                .map(img => img.imgUrl);

                if(existingImageUrls.length > 0) {
                    formData.append("existingImages", new Blob([JSON.stringify(existingImageUrls)], { type:  "application/json" }));
                }
                
                const imgMeta = modifiedItem.img.map(img => ({ isMain: img.main }));
                formData.append("imgMeta", new Blob([JSON.stringify(imgMeta)], { type:  "application/json" }));
            }

            const token = sessionStorage.getItem("token");
            const response = await postData(`/product/modify/${itemKey}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if(response.status === 200) {
                showToast("입력하신 대로 상품이 수정되었습니다!", "success");
                navigate(`/product/${itemKey}`);
            }
        } catch {
            showToast("상품 수정에 실패했습니다...", "error");
        }
    };

    const deleteItem = async (e) => {
        e.preventDefault();

        try {
            const response = await deleteData(`/product/delete/${itemKey}`);
            if(response.status === 200) {
                showToast("상품을 삭제했습니다!", "success");
                navigate("/home");
            } else {
                showToast("상품을 삭제하지 못했습니다...", "error")
            }
        } catch (err) {
            showToast("네트워크 오류가 발생했습니다!", "error");
            console.log(err);
        }
    }

    if(!itemKey && !item) {
        showToast("해당 상품이 존재하지 않습니다!", "error");
        navigate("/home");
        return;
    }

    return (
        <>
        <main>
        <div className="write-container">
                <form className="write-form" onSubmit={handleSubmit}>
                    {/* 이미지 첨부 */}
                    <div className="form-row">
                        <div className="input-img">
                            <label htmlFor="img">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                                    <path fill="#575757" d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"/>
                                </svg>
                                <span>{`${modifiedItem.img.length} / 5`}</span>
                            </label>
                            <input id="img" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none"}} />
                            <div className="img-box">
                                {modifiedItem.img.map((img, index) => (
                                    <div
                                        key={img.id || index}
                                        className={`img-thumb${img.main ? " main" : ""}`}
                                        onClick={() => setMainImage(index)}
                                    >
                                        {img.main ? <span className="badge">MAIN</span> : <span className="empty">임시데이터</span>}
                                        <span className="img-delete-btn" onClick={() => handleDeleteImage(index)}>X</span>
                                        <img
                                            src={img.imgUrl ? `http://localhost:8093${img.imgUrl}` : URL.createObjectURL(img.file)}
                                            alt={`preview-${index}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> 
                    {/* 상품명 */}
                    <div className="form-row">
                        <div className="input-subject">
                            <input id="subject" type="text" value={modifiedItem.subject} onChange={handleInput} placeholder="상품명"/>
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
                                <input id="price" type="text" value={formattedPrice} placeholder={item.price} onChange={handlePriceChange}/>
                            </div>
                        </div>
                    </div>
                    {/* 상품 설명 란 */}
                    <div className="form-row">
                        <div className="input-content">
                            <textarea id="content" onChange={handleInput} placeholder={item.content} />
                        </div>
                    </div>
                    {/* 상품 상태 선택란 */}
                    <div className="form-row">
                        <div className="input-itemtype">
                            <label>상품 상태</label>
                            <div className="radio-group">
                                <label className="radio-box">
                                    <input id="itemtype" type="radio" value={"NEW"} onChange={handleInput} checked={modifiedItem.itemtype === "NEW"}/>
                                    <span>신품</span>
                                </label>
                                <label className="radio-box">
                                    <input id="itemtype" type="radio" value={"OLD"} onChange={handleInput} checked={modifiedItem.itemtype === "OLD"}/>
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
                                    <input id="purtype" type="radio" value={2} onChange={handleInput} checked={modifiedItem.purtype == 2}/>
                                    <span>직거래</span>
                                </label>
                                <label className="radio-box">
                                    <input id="purtype" type="radio" value={1} onChange={handleInput} checked={modifiedItem.purtype == 1}/>
                                    <span>택배거래</span>
                                </label>
                                <label className="radio-box">
                                    <input id="purtype" type="radio" value={0} onChange={handleInput} checked={modifiedItem.purtype == 0}/>
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
                                        {modifiedItem.location.map((loc, index) => (
                                            <>
                                            <li key={loc.id || index}>
                                            {loc.address}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setModifiedItem(prev => ({
                                                            ...prev,
                                                            location: prev.location.filter((_, i) => i !== index)
                                                    }))}
                                                >x</button>
                                            </li>
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
                    <button className="item-delete" type="button" onClick={() => setShowDelete(true)}>삭제</button>
                    <button className="item-submit" type="submit">수정</button>
                    <Modal
                        isOpen={showDelete}                            
                        onClose={() => setShowDelete(false)}
                        onConfirm={deleteItem}
                        title={"상품 삭제하기"}
                        message={"해당 상품을 삭제 하시겠어요?"}
                        cancelText={"아니요 남겨둘게요!"}
                        confirmText={"네 삭제할게요!"}
                    />
                </form>
            </div>
        </main>
        </>
    )

}

export default ItemModify;