SELECT * FROM d1_authority;

SELECT * FROM d1_user;

SELECT * FROM d1_category;

SELECT * FROM d1_item;

SELECT * FROM d1_verifytoken;

SELECT * FROM d1_item_image;

SELECT count(*)
FROM d1_user 
WHERE userKey LIKE LOWER(CONCAT('%', 9160, '%'));

SELECT
            itemKey,
            userKey,
            cateKey,
            subject,
            content,
            price,
            location,
            itemtype,
            purtype,
            location,
            tradestatus,
            writeDate,
            viewcnt,
            img1,
            img2,
            img3,
            img4,
            img5
FROM d1_item
ORDER BY writeDate DESC
LIMIT 20;

SELECT
        cateKey,
        catename
        FROM d1_category;
