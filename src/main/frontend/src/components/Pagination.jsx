import style from "../components/css/itemCard.module.css"

const Pagination = ({ totalPage, currentPage, onPageChange, maxPageButtons = 5 }) => {

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
            className={i === currentPage ? style.buttonSelected : style.button} />
        )
    }
    
    return (
        <>
            <div
                className={style.paginaton}
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchMove={(e) => handleTouchMove(e)}
                onTouchEnd={(e) => handleTouchEnd(e)}
            >
                <div className={style.paginatonBtn}>
                    <button
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512">
                            <path fill="#545454" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                        </svg>
                    </button>
                </div>
                <div>
                    {buttons}
                </div>
                <div className={style.paginatonBtn}>
                    <button
                        onClick={() => currentPage < totalPage && onPageChange(currentPage + 1)}    
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512">
                            <path fill="#545454" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                        </svg>
                    </button>
                </div>

            </div>
        </>
    )
}

export default Pagination;