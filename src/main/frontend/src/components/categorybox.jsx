import "../components/css/header.css";

function Categorybox({ categories }) {

    const parentCate = [];
    const subCate = [];

    categories.map((cate) => {
        if(cate.cateKey % 100 === 0) {
            parentCate.push({
                cateKey: cate.cateKey,
                catename: cate.catename,
                subCategories: []
            })
            // console.log("parentCate is", parentCate);
        } else {
            subCate.push({
                cateKey: cate.cateKey,
                catename: cate.catename,
            })
            // consol.log("subCate is, subCate");
        }
    })
    
    return (
        <>
            {parentCate.length > 0 && parentCate.map((pcate) => (
                <li key={pcate.cateKey}>
                    <a href={`/search?category=${pcate.cateKey}`}>{pcate.catename}</a>
                    <div className="SubCategory">
                        <ul>
                            {subCate
                                .filter((cate) => Math.floor(cate.cateKey / 100) === Math.floor(pcate.cateKey / 100))
                                .map((scate) => {
                                    return (
                                        <li key={scate.cateKey}>
                                                <a href={`/search?category=${scate.cateKey}`}>{scate.catename}</a>
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