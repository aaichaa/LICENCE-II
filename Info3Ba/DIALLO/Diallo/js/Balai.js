// js/Balai.js
//
// Modélisation d'un balai de curling à partir de primitives usuelles.
// On construit un petit "arbre CSG" conceptuel :
//   Balai = Manche ∪ (Tête \ Gorges) ∪ Poils
//
// Ici on n'utilise pas de vraie librairie CSG, on assemble les meshes,
// mais la structure correspond bien aux opérations union / différence.

class Balai {

    /**
     * options possibles :
     *  - longueurManche
     *  - rayonManche
     *  - largeurTete, longueurTete, epaisseurTete
     *  - couleurManche, couleurTete, couleurPoils
     */
    constructor(options = {}) {
        // paramètres par défaut
        const defaults = {
            longueurManche: 4.5,
            rayonManche: 0.06,
            largeurTete: 0.3,    // dans la direction Y
            longueurTete: 0.9,   // dans la direction X
            epaisseurTete: 0.15, // dans la direction Z
            couleurManche: 0x885533,
            couleurTete: 0x333333,
            couleurPoils: 0xffffff
        };
        this.params = Object.assign({}, defaults, options);

        this.group = new THREE.Group();
        this.group.castShadow = true;
        this.group.receiveShadow = true;

        this._creerManche();
        this._creerTeteEtGorges();
        this._creerPoils();
    }

    // ============ parties du balai ============

    _creerManche() {
        const p = this.params;

        const geo = new THREE.CylinderGeometry(
            p.rayonManche,
            p.rayonManche,
            p.longueurManche,
            24
        );
        const mat = new THREE.MeshPhongMaterial({
            color: p.couleurManche,
            shininess: 60
        });

        const manche = new THREE.Mesh(geo, mat);
        manche.castShadow = true;
        manche.receiveShadow = true;

        // Par défaut, un cylindre est aligné le long de l'axe Y.
        // On le met horizontal (axe X) pour que ce soit plus "naturel".
        manche.rotation.z = Math.PI / 2;
        manche.position.set(0, 0, 0.4); // un peu au-dessus de la glace

        this.group.add(manche);
    }

    _creerTeteEtGorges() {
        const p = this.params;

        // TÊTE : parallélépipède
        const geoTete = new THREE.BoxGeometry(
            p.longueurTete,
            p.largeurTete,
            p.epaisseurTete
        );
        const matTete = new THREE.MeshPhongMaterial({
            color: p.couleurTete,
            shininess: 30
        });

        const tete = new THREE.Mesh(geoTete, matTete);
        tete.castShadow = true;
        tete.receiveShadow = true;

        // On place la tête à une extrémité du manche
        const decalageManche = this.params.longueurManche / 2;
        tete.position.set(decalageManche + p.longueurTete / 2, 0, 0.4);

        this.group.add(tete);

        // ---- GORGES (pour illustrer la différence CSG dans le rapport) ----
        //
        // Concept : on pourrait "creuser" deux gorges dans la tête :
        //   TêteCreusée = Tête \ Gorge1 \ Gorge2
        //
        // Ici, on ne fait pas de vraie différence géométrique, mais on
        // modélise malgré tout ces "volumes de soustraction" pour
        // documenter l'arbre CSG dans le rapport.

        const gorgeGeo = new THREE.BoxGeometry(
            p.longueurTete * 0.8,
            p.largeurTete * 0.25,
            p.epaisseurTete * 0.6
        );
        const gorgeMat = new THREE.MeshPhongMaterial({
            color: 0x555555,
            opacity: 0.4,
            transparent: true
        });

        const gorge1 = new THREE.Mesh(gorgeGeo, gorgeMat);
        const gorge2 = new THREE.Mesh(gorgeGeo, gorgeMat);

        gorge1.position.copy(tete.position);
        gorge2.position.copy(tete.position);

        gorge1.position.y += p.largeurTete * 0.25;
        gorge2.position.y -= p.largeurTete * 0.25;

        // On ne les ajoute pas forcément au group si on ne veut pas les voir,
        // mais les garder (ou les afficher en transparent) est pratique
        // pour les schémas / le rapport.
        this.group.add(gorge1);
        this.group.add(gorge2);
    }

    _creerPoils() {
        const p = this.params;

        const rayonPoil = 0.05;
        const hauteurPoil = 0.25;

        const geoPoil = new THREE.ConeGeometry(rayonPoil, hauteurPoil, 16);
        const matPoil = new THREE.MeshPhongMaterial({
            color: p.couleurPoils,
            shininess: 20
        });

        // On place une grille de cônes sous la tête
        const nbX = 4;
        const nbY = 2;

        const offsetX = this.params.longueurTete * 0.6;
        const offsetY = this.params.largeurTete * 0.4;

        const baseZ = 0.4 - this.params.epaisseurTete / 2 - hauteurPoil / 2;
       

        for (let ix = 0; ix < nbX; ix++) {
            for (let iy = 0; iy < nbY; iy++) {
                const poil = new THREE.Mesh(geoPoil, matPoil);
                poil.castShadow = true;
                poil.receiveShadow = true;

                const x = (this.params.longueurTete / (nbX - 1)) * ix;
                const y = (iy === 0 ? -offsetY / 2 : offsetY / 2);

                poil.position.set(
                    this.params.longueurManche / 2 + x - offsetX / 2,
                    y,
                    baseZ
                );

                // Le cône pointe vers le bas
                poil.rotation.x = Math.PI;

                this.group.add(poil);
            }
        }
    }

    // ============ méthodes utilitaires ============

    addToScene(scene) {
        scene.add(this.group);
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    setRotation(rx, ry, rz) {
        this.group.rotation.set(rx, ry, rz);
    }
}
