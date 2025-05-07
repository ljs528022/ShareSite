import { useNavigate } from "react-router-dom";
import "../css/pages/header.css";

const Categorybox = ({ categories, className }) => {

    const parentCate = [];
    const subCate = [];

    const navigate = useNavigate();

    categories.map((cate) => {
        if(cate.cateKey % 100 === 0) {
            parentCate.push(cate)
        } else {
            subCate.push(cate)
        }
    })
    // console.log("parentCate is", parentCate);
    // console.log("subCate is", subCate);

    return (
        <>
            {parentCate.length > 0 && parentCate.map((pcate) => (
                <li key={pcate.cateKey} onClick={() => navigate(`/search?category=${pcate.cateKey}`)}>
                    {pcate.catename}
                    <div className={className}>
                        <ul>
                            {subCate
                                .filter((cate) => Math.floor(cate.cateKey / 100) === Math.floor(pcate.cateKey / 100))
                                .map((scate) => {
                                    return (
                                        <li key={scate.cateKey} onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/search?category=${scate.cateKey}`)}}>
                                            {scate.catename}
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </li>
            ))}
        </>
    )
}

export default Categorybox;