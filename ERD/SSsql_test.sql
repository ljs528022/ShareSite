SELECT * FROM d1_user;

SELECT * FROM d1_item_image;

SELECT * FROM d1_item;

SELECT * FROM d1_location;

SELECT * FROM d1_payment;

SELECT * FROM d1_review;

SELECT * FROM d1_chatroom;

SELECT *
FROM d1_review
WHERE sellerKey = '9160007';

SELECT *
        FROM d1_payment
        WHERE buyerKey = '80A0001'
        ORDER BY purchaseDate DESC;