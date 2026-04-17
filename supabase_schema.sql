-- SQL Схема представлений (для справки)
-- Предоставлено пользователем 2026-04-17

CREATE OR REPLACE VIEW view_anomalies AS
SELECT 
    t.id as test_id,
    c.last_name || ' ' || c.first_name as student_fio,
    CASE 
        WHEN t.test_date::date < c.bdate::date THEN 'Тест раньше рождения'
        WHEN (EXTRACT(YEAR FROM AGE(t.test_date::date, c.bdate::date))) < 6 THEN 'Слишком юный возраст (<6 лет)'
        WHEN t.result IS NULL OR t.result = '' THEN 'Пустой результат'
        WHEN t.test_date::date > CURRENT_DATE THEN 'Дата в будущем'
        ELSE 'Прочие несоответствия'
    END as anomaly_type,
    t.test_date,
    s.name as school_name
FROM tests t
JOIN children c ON t.child_id_ref = c.id
JOIN schools s ON t.sender_school_id = s.id
WHERE 
    t.test_date::date < c.bdate::date 
    OR (EXTRACT(YEAR FROM AGE(t.test_date::date, c.bdate::date))) < 6
    OR t.result IS NULL 
    OR t.result = ''
    OR t.test_date::date > CURRENT_DATE;

CREATE OR REPLACE VIEW view_frequency_violations AS
WITH sorted_tests AS (
    SELECT 
        child_id_ref,
        test_date,
        LAG(test_date) OVER (PARTITION BY child_id_ref ORDER BY test_date::date) as prev_test_date
    FROM tests
)
SELECT 
    v.*,
    c.last_name || ' ' || c.first_name as student_fio,
    (v.test_date::date - v.prev_test_date::date) as days_between
FROM sorted_tests v
JOIN children c ON v.child_id_ref = c.id
WHERE v.prev_test_date IS NOT NULL 
  AND (v.test_date::date - v.prev_test_date::date) < 90;

CREATE OR REPLACE VIEW view_school_stats AS
SELECT 
    s_sender.name as school_name,
    s_sender.ogrn as school_ogrn,
    COUNT(t.id) as total_students,
    ROUND(
        (COUNT(t.id) FILTER (WHERE LOWER(t.result) = 'достаточный')::float / 
         NULLIF(COUNT(t.id), 0)::float * 100)::numeric, 
        2
    ) || '%' as pass_rate
FROM schools s_sender
LEFT JOIN tests t ON s_sender.id = t.sender_school_id
GROUP BY s_sender.name, s_sender.ogrn;


CREATE OR REPLACE VIEW view_student_details AS
SELECT 
    t.test_date,
    t.result,
    t.class,
    c.last_name || ' ' || c.first_name || ' ' || COALESCE(c.middle_name, '') as fio,
    c.bdate as birth_date,
    s_sender.name as sender_school_name,
    s_sender.ogrn as sender_school_ogrn,
    s_area.name as testing_location
FROM tests t
LEFT JOIN children c ON t.child_id_ref = c.id
LEFT JOIN schools s_sender ON t.sender_school_id = s_sender.id
LEFT JOIN schools s_area ON t.area_school_id = s_area.id;
