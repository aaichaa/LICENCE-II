CREATE SCHEMA sds;

 create table sds.client(
	id integer primary key,
	nom text,
	prenom text);

create table  sds.abonnement(
id integer primary key,niveau text, date_debut Date, date_fin Date, prix integer,client_id integer references sds.client(id) );

 create table sds.Maintenance(id integer primary key, date_maintenance Date);
 create table sds.Machine(id integer primary key, nom text);
 create table sds.Type_machine(id integer primary key, nom text,intervalle_revision integer);
 alter table sds.maintenance add column machine_id integer references sds.machine(id);
 alter table sds.Machine add column type_machine_id integer references 
 sds.Type_machine(id);
create table sds.prestation(id integer primary key,type_prestation text);
CREATE TABLE sds.coach (
    id       INTEGER PRIMARY KEY,
    nom      TEXT,
    prenom   TEXT
);
CREATE TABLE sds.seance_coaching (
    id               INTEGER PRIMARY KEY,
    id_client        INTEGER,
    id_coach         INTEGER,
    date_seance      DATE,
    duree            INTEGER,
    date_inscription DATE,
    FOREIGN KEY (id_client) REFERENCES sds.client(id),
    FOREIGN KEY (id_coach)  REFERENCES sds.coach(id)
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
CREATE TABLE sds.paiement (
    id INTEGER PRIMARY KEY,
    montant TEXT,
    date_paiement DATE,
    id_seance_specialisee INTEGER,
    id_client INTEGER,
    id_seance_coaching INTEGER,
    FOREIGN KEY (id_seance_specialisee) REFERENCES sds.seance_specialisee(id),
    FOREIGN KEY (id_client) REFERENCES sds.client(id),
    FOREIGN KEY (id_seance_coaching) REFERENCES sds.seance_coaching(id)
);
CREATE TABLE sds.inscription_seance_specialisee (
    id INTEGER PRIMARY KEY,
    id_client INTEGER,
    id_seance_specialisee INTEGER,
    date_inscription DATE,
    FOREIGN KEY (id_client) REFERENCES sds.client(id),
    FOREIGN KEY (id_seance_specialisee) REFERENCES sds.seance_specialisee(id),
    UNIQUE (id_client, id_seance_specialisee)
);




  
  

 