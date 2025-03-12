import "../components/css/header.css";

const Categorybox = ({cateKey, catename}) => {
    const url = `/search?category=${cateKey}`;

    return (
        <li>
            <a href={url}>{catename}</a>
            <div className="CategoryDetail1">
                <ul>
                    <li>
                        <a href={url}>{catename}</a>
                    </li>
                </ul>
            </div>
        </li>
    )
}

export default Categorybox;