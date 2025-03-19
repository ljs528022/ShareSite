import "../components/css/itemCard.css";
import { Card, Badge } from 'react-bootstrap';

function SmallItemCard() {

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

function NormalItemCard() {

    return (
        <>
            <div className="NormalCard">
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

export default { SmallItemCard, NormalItemCard };