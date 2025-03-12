import "../components/css/header.css";

const CategoryDetail = ({cateKey, catename}) => {
    const url = `/search?category=${cateKey}`;

    if (cateKey / 100 !== 0) {
        

        return (
            <div className="CategoryDetail1">
                <ul>
                    <li>
                        <a href={url}>{catename}</a>
                    </li>
                </ul>
            </div>
        );
    } else {
        return 0;
    }
}

export default CategoryDetail;