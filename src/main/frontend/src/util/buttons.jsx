function Buttons({ btnId, btnClassname, btnType, btnText, btnOnClick}) {

    return (
        <button
            id={btnId || undefined}
            className={btnClassname || undefined}
            type={btnType || "button"}
            onClick={btnOnClick || undefined}
        >
            {btnText || "버튼"}
        </button>
    )
}

export default Buttons;