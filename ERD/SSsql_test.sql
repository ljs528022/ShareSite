SELECT * FROM d1_authority;

SELECT * FROM d1_user;

SELECT * FROM d1_category;

SELECT * FROM d1_location;

SELECT * FROM d1_item;

SELECT * FROM d1_item_image;

SELECT * FROM d1_like;

SELECT *
        FROM d1_item
        WHERE userKey  = '9160012';
       
       

SELECT *
FROM d1_category
WHERE cateKey IN (
    101,                
    FLOOR(101 / 10) * 10
);

SELECT *
        FROM d1_item
        WHERE tradestatus = false AND cateKey = 902
        ORDER BY writeDate DESC
        LIMIT 20;

SELECT *
FROM d1_item
        WHERE tradestatus = false
        ORDER BY writeDate DESC
        LIMIT 20;

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
