import "../components/css/header.css";

function Categorybox({cateKey, catename}) {

    const parentCate = [];
    const subCate = [];

    if(cateKey % 100 === 0) {
        parentCate.push({
            cateKey: cateKey,
            catename: catename,
        })
        // console.log("parentCate is", parentCate);
    } else {
        subCate.push({
            cateKey: cateKey,
            catename: catename,
        })
        console.log("subCate is",subCate);
    }
    
    return (
        <>
            {parentCate.length > 0 && parentCate.map((pcate) => (
                <li key={pcate.cateKey}>
                    <a href={`/search?category=${pcate.cateKey}`}>{pcate.catename}</a>
                    <div className="CategoryDetail1">
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
        
        // <li>
        //     <a href={url}>{catename}</a>
        //     <div className="CategoryDetail1">
        //         <ul>
        //             <li>
        //                 <a href={url}>{catename}</a>
        //             </li>
        //         </ul>
        //     </div>
        // </li>
    )
}

export default Categorybox;