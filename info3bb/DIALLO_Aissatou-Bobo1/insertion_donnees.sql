INSERT INTO sds.client (id, nom, prenom) VALUES
(1, 'Martin',  'Alice'),
(2, 'Dupont',  'Lucas'),
(3, 'Moreau',  'Eva'),
(4, 'Bernard', 'Hugo'),
(5, 'Lefevre', 'Nina'),
(6, 'Durand',  'Karim'),
(7, 'Petit',   'Sara'),
(8, 'Rossi',   'Marco');

INSERT INTO sds.abonnement (id, niveau, date_debut, date_fin, prix, client_id) VALUES
(1, 'Standard', '2025-01-01', '2025-12-31', '160', 1),
(2, 'Premium',   '2025-01-01', '2025-12-31', '220', 2),
(3, 'Basic', '2025-01-01', '2025-12-31', '100', 3),
(4, 'Standard', '2025-01-01', '2025-12-31', '160', 4),
(5, 'Basic', '2025-01-01', '2025-12-31', '100', 7);

INSERT INTO sds.coach (id, nom, prenom) VALUES
(1, 'Blanc',  'Samuel'),
(2, 'Diallo', 'Mina'),
(3, 'Gomez',  'Carlos');

INSERT INTO sds.seance_specialisee (id, date_seance, theme, duree, id_coach) VALUES
(1, '2025-02-05', 'Yoga',     '60', 1),
(2, '2025-02-10', 'Boxe',     '90', 1),
(3, '2025-02-15', 'Pilates',  '60', 2),
(4, '2025-02-20', 'Cardio',   '45', 2),
(5, '2025-02-25', 'CrossFit', '60', 3);

INSERT INTO sds.inscription_seance_specialisee
(id, id_client, id_seance_specialisee, date_inscription) VALUES
(1,  1, 1, '2025-02-01'),
(2,  1, 2, '2025-02-05'),
(3,  1, 3, '2025-02-10'),
(4,  2, 2, '2025-02-06'),
(5,  2, 3, '2025-02-12'),
(6,  2, 4, '2025-02-15'),
(7,  3, 1, '2025-02-02'),
(8,  3, 4, '2025-02-16'),
(9,  4, 5, '2025-02-20'),
(10, 5, 2, '2025-02-07'),
(11, 5, 4, '2025-02-18'),
(12, 6, 3, '2025-02-14'),
(13, 6, 4, '2025-02-19');

INSERT INTO sds.prestation (id, type_prestation) VALUES
(1, 'Acces libre'),
(2, 'Seance specialisee'),
(3, 'Coaching');

INSERT INTO sds.abonnement_prestation (id_prestation, id_abonnement) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(3, 2),
(1, 3),
(1, 4),
(2, 4),
(1, 5);

INSERT INTO sds.seance_coaching
(id, date_seance, duree, date_inscription, id_coach, id_client) VALUES
(1, '2025-02-08', '60', '2025-02-01', 1, 1),
(2, '2025-02-12', '45', '2025-02-05', 1, 2),
(3, '2025-02-18', '60', '2025-02-10', 1, 3),
(4, '2025-02-22', '30', '2025-02-15', 2, 4),
(5, '2025-02-25', '45', '2025-02-18', 2, 5),
(6, '2025-02-28', '60', '2025-02-20', 2, 6),
(7, '2025-03-02', '60', '2025-02-22', 3, 8);

INSERT INTO sds.type_machine (id, nom, intervalle_revision) VALUES
(1, 'Tapis de course', 30),
(2, 'Velo elliptique', 45),
(3, 'Presse a cuisses', 60);

INSERT INTO sds.machine (id, nom, type_machine_id) VALUES
(1, 'Tapis #1', 1),
(2, 'Tapis #2', 1),
(3, 'Velo #1',  2),
(4, 'Presse #1',3);

INSERT INTO sds.maintenance (id, date_maintenance, machine_id) VALUES
(1, '2025-01-10', 1),
(2, '2025-02-10', 1),
(3, '2025-01-01', 2),
(4, '2025-02-20', 3),
(5, '2024-12-15', 4);

INSERT INTO sds.paiement
(id, montant, date_paiement, id_seance_specialisee, id_client, id_seance_coaching) VALUES
(1, '50', '2025-02-08',  NULL, 1, 1),
(2, '50', '2025-02-22',  NULL, 4, 4),
(3, '30', '2025-02-10',  2,    5, NULL),
(4, '30', '2025-02-20',  4,    5, NULL),
(5, '50', '2025-02-25',  NULL, 5, 5),
(6, '30', '2025-02-15',  3,    6, NULL),
(7, '30', '2025-02-20',  4,    6, NULL),
(8, '50', '2025-02-28',  NULL, 6, 6),
(9, '50', '2025-03-02',  NULL, 8, 7);
