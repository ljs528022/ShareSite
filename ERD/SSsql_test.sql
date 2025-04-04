SELECT * FROM d1_authority;

SELECT * FROM d1_user;

SELECT * FROM d1_category;

SELECT * FROM d1_item;

SELECT count(*)
FROM d1_user 
WHERE userKey LIKE LOWER(CONCAT('%', 9160, '%'));


SELECT i.*, c.cateKey
FROM d1_item i
JOIN d1_category c ON i.cateKey = c.cateKey
WHERE i.cateKey = (
	SELECT d1_item.cateKey
	FROM d1_item 
	WHERE i.tradestatus = 0 AND i.writeDate >= date_sub(NOW(), INTERVAL 7 DAY)
	GROUP BY d1_item.cateKey
	ORDER BY count(*) DESC
	LIMIT 1
);