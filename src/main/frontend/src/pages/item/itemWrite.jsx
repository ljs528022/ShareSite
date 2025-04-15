import "../../components/css/itemWrite.css";
import { useEffect, useState } from "react";
import { getCategory } from "../../services/getCategory";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";


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
        purtype: "",
        img: [],
    });

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


    return (
        <>
        <main>
            <div className="write-container">
                <form className="write-from" onSubmit={null}>
                    {/* 이미지 첨부 */}
                    <div className="form-row">
                        <div className="input-img">
                            <input id="img" type="file" accept="image/*" multiple onChange={handleImageChange} />
                            <span>{`${itemData.img.length} / 5`}</span>
                        </div>
                    </div> 
                    {/* 상품명 */}
                    <div className="form-row">
                        <div className="input-subject">
                            
                            <input id="subject" type="text" onChange={handleInput} />
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
                            <input id="price" type="text" onChange={handleInput} />
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
                            <input id="itemtype" onChange={handleInput} />
                        </div>
                    </div>

                    {/* 거래 방식 */}
                    <div className="form-row">
                        <div className="input-purtype">
                            <input id="purtype" onChange={handleInput} />
                        </div>
                    </div>

                    {/* 희망지역 */}
                    <div className="form-row">
                        <div className="location-btn">
                            
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