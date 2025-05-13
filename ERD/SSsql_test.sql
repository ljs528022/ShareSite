SELECT * FROM d1_user;

SELECT * FROM d1_item;

SELECT * FROM d1_location;

SELECT * FROM d1_review;

SELECT COUNT(*)
        FROM d1_location
        WHERE userKey = '80A0001'
        AND address = '서울 성동구 고산자로10길 22-33';