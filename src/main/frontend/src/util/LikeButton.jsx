import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData, deleteData, getData } from "../services/api.jsx";
import { useUser } from "../services/UserContext.jsx";
import { useToast } from "./ToastContext.jsx";
import Modal from "./Modal.jsx";
import "../css/pages/itemDetail.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function LikeButton({ item, size }) {

    const [ like, setLike ] = useState(null);
    const [ isItemLike, setIsItemLike ] = useState(false);

    // 현재 로그인한 유저
    const { user } = useUser();

    const { showToast } = useToast();
    const navigate = useNavigate();

    const userKey = user !== null ? user.userKey : null;

    useEffect(() => {
        if(!user) return;

        const getLikeisExist = async () => {
            if(!userKey && !item ) return;
            try {
                const response = await getData(`/like?userKey=${userKey}&itemKey=${item.itemKey}`, { withCredentials: true });
                if(!response.data) {
                    setIsItemLike(false);
                } else {
                    setLike(response.data);
                    setIsItemLike(true);
                }
            } catch (err) {
                showToast("네트워크 오류 발생..!", "error");
                console.log(err);
            }
        }

        getLikeisExist();
    }, []);

    const toggleItemLike = () => {
        if(!isItemLike) {
            likeItem();
        } else {
            unlikeItem();
        }
    }

    const likeItem = async () => {
        if(!userKey) {
            showToast("로그인이 필요한 서비스 입니다!", "error");
            return;
        }

        try {
            const response = await postData("/like", { userKey: userKey, itemKey: item.itemKey }, { withCredentials: true });
            if(response) {
                showToast("해당 상품을 찜 했습니다!", "success");
                setIsItemLike(true);
            } else {
                showToast("찜 등록에 실패했습니다..", "error");
            }
        } catch (err) {
            showToast("네트워크 오류가 발생했습니다..!", "error");
            console.log(err);
        }
    };

    const unlikeItem = async () => {
        try {
            const response = await deleteData(`/like?userKey=${userKey}&itemKey=${item.itemKey}`);
            if(response) {
                showToast("찜이 해제 되었습니다.", "success");
                setIsItemLike(false);
            } else {
                showToast("찜 해제에 실패했습니다..", "error");
            }
        } catch (err) {
            showToast("네트워크 오류가 발생했습니다..!", "error");
            console.log(err);
        }
    }

    return (
        <>
            {item.userKey === userKey ||
            <>
            <button type="button" onClick={toggleItemLike}>
                {isItemLike ?
                <FaHeart size={size} color='#FFD43B' />
                : <FaRegHeart size={size} color='#FFD43B' />
                }
            </button>
            </>
            }
        </>
    )
}

export default LikeButton;