import "../components/css/itemCard.css";
import { Card, Badge } from 'react-bootstrap';

function SmallItemCard({ items }) {

    return (
        <>
            <div className="SmallCard">
                <Card>
                    <Card.Img variant="top" src=""/>
                    <Card.Body>
                        <Card.Title>상품명</Card.Title>
                        <p>200,000원</p>
                        <Badge bg="danger"></Badge>
                        <p></p>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

function NormalItemCard({ items }) {

    const item = [];

    items.map((i) => {
        item.push(i);
    });

    console.log(item);


    return (
        <>
            {item.length > 0 && item.map((i) => {
                <div key={i.itemKey}>
                    <Card>
                        <Card.Img variant="top" src=""/>
                        <Card.Body>
                            <Card.Title>{i.subject}</Card.Title>
                            <p>{i.price}</p>
                            <Badge bg={`${i.tradestatus} === 0 ? 'danger' : 'success'`}>{i.tradestatus ? "거래중" : "거래완료"}</Badge>
                            <p></p>
                        </Card.Body>
                    </Card>
                </div>
            })}
        </>
    );
}

export { SmallItemCard, NormalItemCard };