import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../../services/api";
import { useToast } from "../../components/ToastContext";

const ItemDetail = () => {
    // URL의 아이템키 받아오기
    const { itemKey } = useParams();

    // Item's Info
    const [ item, setItem ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // Toast
    const { showToast } = useToast();
 
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await getData(`/product/${itemKey}`);
                setItem(response.data);
            } catch (err) {
                showToast("통신 장애로 상품을 가져오지 못했어요...");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if(itemKey) {
            fetchItem();
        }
    }, [itemKey]);

    console.log(item);

    if (loading) return <div>상품을 가져오고 있어요!</div>;
    if (!item) return <div>어라..? 상품을 찾을 수 없어요..!</div>;


    return (
        <>
        <main>
            <div className="item-wrapper">
                <div className="item-row">
                    {/* 상품 이미지 */}
                    <div className="item-Image">

                    </div>
                    {/* 상품 정보 */}
                    <div className="item-Info">
                        <div className="item-label">

                        </div>
                        <div className="item-status">

                        </div>
                        <div className="item-location">

                        </div>
                        <div className="item-Btns">

                        </div>
                    </div>
                </div>
                <div className="item-row">
                    <div className="item-subInfo">
                        <div className="item-content">

                        </div>
                        <div className="item-seller">

                        </div>
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default ItemDetail;