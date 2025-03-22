
import { Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const SmallItemCard = ({ items }) => {

    return (
        <>
            <div className="SmallCard">
                {/* <Card>
                    <Card.Img variant="top" src=""/>
                    <Card.Body>
                        <Card.Title>상품명</Card.Title>
                        <p>200,000원</p>
                        <Badge bg="danger"></Badge>
                        <p></p>
                    </Card.Body>
                </Card> */}
            </div>
        </>
    );
}

const NormalItemCard = ({ items }) => {

    const item = [];

    // 대체 이미지
    const tempImg = "./public/SSLogo.jpg";

    items.map((i) => {
        item.push(i);
    });
    console.log(item);

    return (
        <>
            {item.length > 0 && item.map((i) => (
                <div className='Card_wrapper' key={i.itemKey}>
                    <img className='CardImg' src={`./public/SSLogo.jpg`} />
                    <div className='CardBody'>
                        <p>{i.subject}</p>
                        <p>{i.price}</p>
                        <Badge bg={i.tradestatus == 0 ? "danger" : "success"}>{i.tradestatus == 0 ? "거래중" : "거래완료"}</Badge>
                        
                        {/* 등록된 시간을 기준으로 지금 시간으로 부터 얼마나 되었는지 표시 */}
                        <p>몇분 전</p>
                    </div>
                </div>
                    // <Card key={i.itemKey}> 
                    //     <Card.Img variant="top" src="./public/SSLogo.jpg"/>
                    //     <Card.Body>
                    //         <Card.Title>{i.subject}</Card.Title>
                    //         <p>{i.price}</p>
                    //         <Badge bg={`${i.tradestatus} == 0 ? 'danger' : 'success'`}>{i.tradestatus == 0 ? "거래중" : "거래완료"}</Badge>
                    //         <p>몇분전</p>
                    //     </Card.Body>
                    // </Card>
            ))}
        </>
    );
}

export { SmallItemCard, NormalItemCard };