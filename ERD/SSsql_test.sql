SELECT * FROM d1_user;

SELECT * FROM d1_item_image;

SELECT * FROM d1_item;

SELECT * FROM d1_location;

SELECT * FROM d1_payment;

SELECT * FROM d1_review;

SELECT *
FROM d1_location
WHERE userKey = '80A0001'
AND itemKey IS NULL;

SELECT *
        FROM d1_payment
        WHERE buyerKey = '80A0001'
        ORDER BY purchaseDate DESC;