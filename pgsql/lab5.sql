--Лаб. 5
--Проц. для изменения данных таблицы
SELECT* from collective;
CREATE OR REPLACE PROCEDURE update_collective(
	new_group_name varchar(100),
	new_genre varchar(50),
	new_site varchar(100),
	target_group_id integer
)
LANGUAGE SQL
AS $$
UPDATE collective
SET
	group_name = new_group_name,
	genre = new_genre,
	site = new_site
WHERE
	group_id = target_group_id
$$;

CALL update_collective('Manowar', 'Grunge', 'https://manowar.com', 7);

CALL update_collective('Manowar', 'Heavy metal', 'https://manowar.com', 7);
--Проц. для вставки данных в таблицу
CREATE OR REPLACE PROCEDURE add_at_collective(
    new_group_name varchar(100),
    new_genre varchar(50),
    new_site varchar(100)
)
LANGUAGE SQL
AS $$
INSERT INTO collective(group_name, genre, site)
VALUES (new_group_name, new_genre, new_site)
$$;

CALL add_at_collective('Amon amarth', 'Viking metal', 'https://www.amonamarth.com');

--Арифметическая функция
SELECT* FROM ticket;
CREATE OR REPLACE FUNCTION visitor_tickets_above(x real)
RETURNS TABLE(
	visitor_id int,
	total_price real
) 
LANGUAGE SQL
AS $$
    SELECT visitor_id, SUM(price) as total_price
    FROM ticket
    GROUP BY visitor_id
    HAVING SUM(price) > x
$$;

SELECT * FROM visitor_tickets_above(10.0);
SELECT * FROM visitor_tickets_above(15000.0);
--Функция для поиска информации по названию
CREATE OR REPLACE FUNCTION get_info_by_title(search_title varchar(100))
RETURNS TABLE(
    group_name varchar(100),
    event_title varchar(100),
    description text,
    event_date date
)
LANGUAGE SQL
AS $$
    SELECT c.group_name, e.title, e.description, e.date
    FROM events e
    JOIN event_group eg ON e.event_id = eg.event_id
    JOIN collective c ON eg.group_id = c.group_id
    WHERE c.group_name LIKE '%' || search_title || '%'
$$;

SELECT * FROM get_info_by_title('Lamb');

--Диапазон цен

CREATE OR REPLACE FUNCTION get_tickets_by_range(left_value real, right_value real)
RETURNS TABLE(
	ticket_type varchar(50),
	event_title varchar(100),
	visitor_first_name varchar(50),
	visitor_last_name varchar(50),
	ticket_price integer
)
LANGUAGE SQL
AS $$
	SELECT t.ticket_type, e.title, v.first_name, v.last_name, t.price
	FROM events e 
	JOIN ticket t ON e.event_id = t.event_id
	JOIN visitor v ON v.visitor_id = t.visitor_id
	WHERE t.price < right_value AND t.price > left_value 
$$;

SELECT* FROM get_tickets_by_range(1000, 10000);

--Диапазон дат

CREATE OR REPLACE FUNCTION get_events_by_date(left_date date, right_date date)
RETURNS TABLE(
	event_title varchar(100),
	event_description varchar(100),
	event_date date,
	organizator varchar(100),
	place_title varchar(100)
)
LANGUAGE SQL
AS $$
	SELECT e.title, e.description, e.date, o.organizer_name, p.place_name
	FROM events e
	JOIN organizers o ON e.org_id = o.organizer_id
	JOIN place p ON p.place_id = e.place_id
	WHERE e.date BETWEEN left_date AND right_date
$$;

SELECT * FROM get_events_by_date('2023-1-1'::date, '2025-12-31'::date);

--По варианту
--Посетители без заказов
SELECT * FROM visitor;

CREATE OR REPLACE FUNCTION get_visitors_without_tickets()
RETURNS TABLE(
    first_name varchar(50),
    last_name varchar(50)
)
LANGUAGE SQL
AS $$
    SELECT v.first_name, v.last_name
    FROM visitor v
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ticket t 
        WHERE t.visitor_id = v.visitor_id
    )
$$;

SELECT * FROM get_visitors_without_tickets();


--Топ 3 события по сумме приобритенных билетов

CREATE OR REPLACE FUNCTION get_top_events_by_tickets(limit_count integer DEFAULT 3)
RETURNS TABLE(
    event_title varchar(100),
    tickets_sold bigint,
    total_revenue numeric
)
LANGUAGE SQL
AS $$
    SELECT  e.title, COUNT(t.ticket_id) AS tickets_sold, SUM(t.price) AS total_revenue
    FROM  events e
    JOIN ticket t ON e.event_id = t.event_id
    GROUP BY e.event_id, e.title
    ORDER BY tickets_sold DESC, total_revenue DESC
    LIMIT limit_count
$$;

SELECT * FROM get_top_events_by_tickets();












