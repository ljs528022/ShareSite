SELECT * FROM d1_authority;

SELECT * FROM d1_user;

SELECT * FROM d1_category;

SELECT * FROM d1_item;

SELECT count(*)
FROM d1_user 
WHERE userKey LIKE LOWER(CONCAT('%', 9160, '%'));
