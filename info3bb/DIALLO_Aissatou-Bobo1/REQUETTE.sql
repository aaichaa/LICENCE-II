question 1 


SELECT 
    m.id, 
    m.nom
FROM sds.machine m
JOIN sds.type_machine t ON t.id = m.type_machine_id
JOIN (
    SELECT machine_id, MAX(date_maintenance) AS derniere
    FROM sds.maintenance
    GROUP BY machine_id
) x ON x.machine_id = m.id
WHERE x.derniere + t.intervalle_revision * INTERVAL '1 day'
      <= CURRENT_DATE + INTERVAL '1 month';
