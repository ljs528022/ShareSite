import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "../css/util/pagination.css";

const Pagination = ({ totalPage, currentPage, onPageChange, maxPageButtons = 5, showPageBtn = true, style }) => {

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }

    const handleTouchMove = (e) => {
        touchEndX = e.changedTouches[0].clientX;
    }

    const handleTouchEnd = (e) => {
        const distance = touchStartX - touchEndX;
        const threshold = 50;

        if(distance > threshold) {
            onPageChange(Math.min(totalPage, currentPage + 1));
        } else if(distance < -threshold) {
            onPageChange(Math.max(1, currentPage - 1));
        }
    }


    if(totalPage === 0) return null;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPage, startPage + maxPageButtons - 1);

    if(endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    const buttons = [];
    
    for(let i = startPage; i <= endPage; i++) {
        buttons.push(
            <button key={i} onClick={() => onPageChange(i)}
            className={i === currentPage ? `${style}buttonSelected` : `${style}button`} />
        )
    }
    
    return (
        <>
        {buttons.length > 1 &&
            <div
                className={`${style}paginaton`}
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchMove={(e) => handleTouchMove(e)}
                onTouchEnd={(e) => handleTouchEnd(e)}
            >
                {showPageBtn &&
                <div className={`${style}paginatonBtn`}>
                    <button
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        >
                        <FaAngleLeft size={25} color="white"/>
                    </button>
                </div>
                }
                <div>
                    {buttons}
                </div>
                {showPageBtn &&
                <div className={`${style}paginatonBtn`}>
                    <button
                        onClick={() => currentPage < totalPage && onPageChange(currentPage + 1)}    
                    >
                        <FaAngleRight size={25} color="white"/>
                    </button>
                </div>
                }     
            </div>
        }
        </>
    )
}

export default Pagination;