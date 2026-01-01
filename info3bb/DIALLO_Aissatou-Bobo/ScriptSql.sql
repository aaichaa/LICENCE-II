CREATE SCHEMA sds;


--creation des tables

 create table sds.client(
	id integer primary key,
	nom text,
	prenom text
);

create table  sds.abonnement(
id integer primary key,
niveau text, 
date_debut Date, 
date_fin Date,
 prix integer,
 client_id integer references sds.client(id)
 );

 create table sds.Type_machine(
 id integer primary key,
 nom text,
 intervalle_revision integer
 );

 create table sds.Machine(
 id integer primary key, 
 nom text,
 type_machine_id integer references sds.Type_machine(id)
 );

 create table sds.Maintenance(
 id integer primary key,
 date_maintenance Date,
 machine_id integer references sds.machine(id)
 );

create table sds.prestation(
id integer primary key,
type_prestation text
);


CREATE TABLE sds.coach (
    id       INTEGER PRIMARY KEY,
    nom      TEXT,
    prenom   TEXT
);

CREATE TABLE sds.seance_specialisee (
    id           INTEGER PRIMARY KEY,
    id_coach     INTEGER,
    date_seance  DATE,
    theme        TEXT,
    duree        INTEGER,
    FOREIGN KEY (id_coach) REFERENCES sds.coach(id)
);

CREATE TABLE sds.abonnement_prestation (
    id_abonnement INTEGER,
    id_prestation INTEGER,
    PRIMARY KEY (id_abonnement, id_prestation),
    FOREIGN KEY (id_abonnement) REFERENCES sds.abonnement(id),
    FOREIGN KEY (id_prestation) REFERENCES sds.prestation(id)
);


CREATE TABLE sds.inscription_seance_specialisee (
    client_id              INTEGER,
    seance_specialisee_id  INTEGER,
    date_inscription       DATE,
    date_paiement          DATE,
    montant                INTEGER,     
    
    PRIMARY KEY (client_id, seance_specialisee_id),
    
    FOREIGN KEY (client_id)
        REFERENCES sds.client(id),
    
    FOREIGN KEY (seance_specialisee_id)
        REFERENCES sds.seance_specialisee(id)
);
CREATE TABLE sds.seance_coaching (
    id               INTEGER PRIMARY KEY,
    client_id        INTEGER,
    coach_id         INTEGER,
    date_seance      DATE,
    duree            INTEGER,
    date_inscription DATE,
    date_paiement    DATE,
    montant          INTEGER,

    FOREIGN KEY (client_id)
        REFERENCES sds.client(id),

    FOREIGN KEY (coach_id)
        REFERENCES sds.coach(id)
);

--insertions

INSERT INTO sds.client (id, nom, prenom) VALUES
(1, 'Diallo', 'Aissatou'),
(2, 'Martin', 'Lucas'),
(3, 'Dupont', 'Emma'),
(4, 'Morel', 'Nina'),
(5, 'Leroy', 'Sami'),
(6, 'Benali', 'Karim'),
(7, 'Lopez', 'Maria');

INSERT INTO sds.coach (id, nom, prenom) VALUES
(1, 'Nguyen', 'Sophie'),
(2, 'Bernard', 'Thomas'),
(3, 'Rossi',  'Carla'),
(4, 'Lopez',  'Hugo'),
(5, 'Kim',    'Lea');

INSERT INTO sds.prestation (id, type_prestation) VALUES
(1, 'Acces libre au materiel'),
(2, 'Seances specialisees'),
(3, 'Coaching personnalise'),
(4, 'Acces libre au materiel'),
(5, 'Seances specialisees');

INSERT INTO sds.abonnement
(id, niveau, date_debut, date_fin, prix, client_id) VALUES
(1, 'Basic',   '2025-01-01', '2025-03-31',  60, 1), -- Diallo
(2, 'Premium', '2025-01-01', '2025-03-31', 120, 2), -- Lucas
(3, 'Premium', '2025-01-01', '2025-03-31', 120, 4), -- Nina
(4, 'Basic',   '2025-04-01', '2025-06-30',  60, 1), -- 2e abo Diallo
(5, 'Basic',   '2025-04-01', '2025-06-30',  60, 2); -- 2e abo Lucas


INSERT INTO sds.abonnement_prestation (id_abonnement, id_prestation) VALUES
(1, 1),        -- Basic Diallo : materiel
(2, 1), (2, 2), (2, 3),  -- Premium Lucas : materiel + seances speacialisees + coaching
(3, 1), (3, 2), (3, 3),  -- Premium Nina : materiel speacialisees+ seances + coaching
(4, 1),        -- Basic Diallo : materiel
(5, 1);        -- Basic Lucas : materiel

INSERT INTO sds.type_machine (id, nom, intervalle_revision) VALUES
(1, 'Tapis de course',    30),
(2, 'Velo elliptique',    45),
(3, 'Rameur',             60),
(4, 'Presse a cuisses',   90),
(5, 'Stepper',            30);

INSERT INTO sds.machine (id, nom, type_machine_id) VALUES
(1, 'Tapis #1',    1),
(2, 'Tapis #2',    1),
(3, 'Velo #1',     2),
(4, 'Rameur #1',   3),
(5, 'Stepper #1',  5);


INSERT INTO sds.maintenance (id, machine_id, date_maintenance) VALUES
(1, 1, '2025-12-12'), -- Tapis #
(2, 2, '2025-12-11'),  -- Tapis #
(3, 3, '2025-11-26'), -- Velo#1
(4, 4, '2025-11-14'),-- Rameur
(5, 5, '2025-12-16'); -- Stepper


INSERT INTO sds.seance_specialisee
(id, date_seance, theme, duree, id_coach) VALUES
(1, '2025-02-01', 'Yoga',      60, 1),
(2, '2025-02-03', 'Boxe',      45, 2),
(3, '2025-02-05', 'Pilates',   50, 1),
(4, '2025-02-10', 'Crossfit',  45, 3),
(5, '2025-02-15', 'Zumba',     55, 2),
(6, '2025-01-20', 'Cardio', 60, 1);

INSERT INTO sds.inscription_seance_specialisee
(client_id, seance_specialisee_id, date_inscription, date_paiement, montant) VALUES
(1, 1, '2025-01-20', '2025-01-25', 10),
(1, 2, '2025-01-22', '2025-01-28', 15),
(2, 1, '2025-01-18', '2025-01-20',  0),
(2, 2, '2025-01-21', '2025-01-23',  0),
(2, 5, '2025-02-10','2025-02-11', 10),
(3, 2, '2025-01-24', '2025-01-26', 30),
(3, 4, '2025-01-30', '2025-02-01', 30),
(6, 1, '2025-01-05', '2025-01-05', 25),
(6, 2, '2025-01-10', '2025-01-10', 25),
(6, 3, '2025-01-15', '2025-01-15', 25),
(7, 1, '2025-01-12', '2025-01-12', 40),
(7, 4, '2025-01-20', '2025-01-20', 40);


INSERT INTO sds.seance_coaching
(id, client_id, coach_id, date_seance, duree,
 date_inscription, date_paiement, montant) VALUES
(1, 2, 1, '2025-02-02', 60, '2025-01-25', '2025-01-28',  0),  
(2, 2, 2, '2025-02-04', 45, '2025-01-26', '2025-01-29', 20),  
(3, 3, 1, '2025-02-06', 60, '2025-01-28', '2025-02-01', 40),
(4, 3, 3, '2025-02-08', 45, '2025-01-29', '2025-02-02', 50),
(5, 1, 2, '2025-02-09', 60, '2025-01-30', '2025-02-03', 25);


--Requetes :

--question 1************************
SELECT 
    m.id AS machine_id,
    m.nom AS machine_nom,
    MAX(maint.date_maintenance) AS derniere_maintenance,
    MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day' 
        AS prochaine_maintenance
FROM sds.machine m
JOIN sds.type_machine tm 
    ON m.type_machine_id = tm.id
JOIN sds.maintenance maint 
    ON maint.machine_id = m.id
GROUP BY m.id, m.nom, tm.intervalle_revision
HAVING 
    (MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day')
        BETWEEN DATE '2025-12-12' AND DATE '2026-01-12'
ORDER BY m.id;


--question 2********************

--une question avec des paramètres d ou les "?" dedans, c est à l utilisateur d entrer lid du client
SELECT
  'specialisee' AS type,
  ss.date_seance,
  ss.theme,
  ss.duree
FROM sds.inscription_seance_specialisee iss
JOIN sds.seance_specialisee ss
  ON ss.id = iss.seance_specialisee_id
WHERE iss.client_id = ?

UNION ALL

SELECT
  'coaching' AS type,
  sc.date_seance,
  'Coaching' AS theme,
  sc.duree
FROM sds.seance_coaching sc
WHERE sc.client_id = ?
ORDER BY date_seance;


--question 3********************

SELECT
    c.id,
    c.nom,
    c.prenom,
    COUNT(ss.id) AS nb_seances_inclues
FROM sds.client c
JOIN sds.abonnement a
    ON a.client_id = c.id
JOIN sds.abonnement_prestation ap
    ON ap.id_abonnement = a.id
JOIN sds.prestation p
    ON p.id = ap.id_prestation
   AND p.type_prestation = 'Seances specialisees'
LEFT JOIN sds.inscription_seance_specialisee iss
    ON iss.client_id = c.id
LEFT JOIN sds.seance_specialisee ss
    ON ss.id = iss.seance_specialisee_id
   AND ss.date_seance BETWEEN a.date_debut AND a.date_fin
   AND iss.montant = 0
GROUP BY c.id, c.nom, c.prenom
HAVING COUNT(ss.id) <= 1
ORDER BY c.id;


--question 4 ***********************
--une question avec des paramètres d ou les "?" dedans, c est à l utilisateur d entrer les dates
WITH prix_abo AS (
  SELECT MIN(prix) AS prix
  FROM sds.abonnement
),
depenses AS (
  SELECT iss.client_id, ss.date_seance AS date_evt, iss.montant
  FROM sds.inscription_seance_specialisee iss
  JOIN sds.seance_specialisee ss
    ON ss.id = iss.seance_specialisee_id
  WHERE iss.montant > 0

  UNION ALL

  SELECT sc.client_id, sc.date_seance AS date_evt, sc.montant
  FROM sds.seance_coaching sc
  WHERE sc.montant > 0
)
SELECT
  c.id,
  c.nom,
  c.prenom,
  SUM(d.montant) AS total_paye_hors_abo,
  pa.prix AS prix_abonnement,
  SUM(d.montant) - pa.prix AS economie_potentielle
FROM sds.client c
CROSS JOIN prix_abo pa
JOIN depenses d
  ON d.client_id = c.id
WHERE d.date_evt BETWEEN ? AND ?
  AND NOT EXISTS (
    SELECT 1
    FROM sds.abonnement a
    WHERE a.client_id = c.id
      AND a.date_debut <= ?
      AND a.date_fin   >= ?
  )
GROUP BY
  c.id, c.nom, c.prenom, pa.prix
HAVING SUM(d.montant) > pa.prix
ORDER BY
  economie_potentielle DESC,
  total_paye_hors_abo DESC;


--question 5****************************


WITH coach_client AS (
    SELECT ss.id_coach AS coach_id, iss.client_id
    FROM sds.inscription_seance_specialisee iss
    JOIN sds.seance_specialisee ss
      ON ss.id = iss.seance_specialisee_id

    UNION ALL

    SELECT sc.coach_id AS coach_id, sc.client_id
    FROM sds.seance_coaching sc
),
coach_stats AS (
    SELECT coach_id, COUNT(DISTINCT client_id) AS nb_clients
    FROM coach_client
    GROUP BY coach_id
),
moyenne AS (
    SELECT AVG(nb_clients) AS avg_clients
    FROM coach_stats
)
SELECT c.id, c.nom, c.prenom, cs.nb_clients
FROM coach_stats cs
JOIN sds.coach c ON c.id = cs.coach_id
CROSS JOIN moyenne m
WHERE cs.nb_clients > m.avg_clients
ORDER BY cs.nb_clients DESC, c.id;


