// js/PierreCurling.js

// Classe représentant une pierre de curling composée de 3 surfaces de révolution
// Bas + Bande + Haut, avec raccord G1 entre les profils.

class PierreCurling {
    constructor(coulBas, coulBande, coulHaut, nbPtCbe = 20, nbPtRot = 64) {
        this.nbPtCbe = nbPtCbe;
        this.nbPtRot = nbPtRot;

        this.coulBas = coulBas !== undefined ? coulBas : 0xcccccc;
        this.coulBande = coulBande !== undefined ? coulBande : 0xff0000;
        this.coulHaut = coulHaut !== undefined ? coulHaut : 0x999999;

        this.mesh = new THREE.Group();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.construirePierre();
    }

    // Construit toute la pierre à partir de 3 profils Bézier
    construirePierre() {
        // --- PROFIL EN COORDONNÉES (r, z) = (x, y dans le plan 2D) ---
        // On travaille dans le plan (rayon horizontal, hauteur),
        // puis on fait tourner autour de l’axe vertical pour obtenir le Lathe.

        // Idée : la pierre fait environ 0.6 de rayon max et 0.3 de hauteur totale.
        // Bas : profil légèrement bombé
        // Bande : bande (couleur équipe)
        // Haut : partie supérieure un peu plus petite

        // ----- BAS -----
        // Points pour la Bézier quadratique du bas
        // P0B, P1B, P2B
        // P0B : près de l’axe (rayon plus petit)
        // P2B : rayon max
        // P1B : contrôle pour bombé

        const P0B = new THREE.Vector2(0.15, 0.0);   // (rayon, hauteur)
        const P1B = new THREE.Vector2(0.50, -0.05); // contrôle vers l’extérieur
        const P2B = new THREE.Vector2(0.60, 0.05);  // rayon max, léger rebord

        // ----- BANDE (PARTIE COULEUR ÉQUIPE) -----
        // On veut un raccord G1 entre Bas et Bande.
        // On prend comme premier point de la bande B0 = P2B.
        // Pour la G1 :
        //    direction en P2B donnée par la tangente (P1B -> P2B)
        // On place B1 sur le prolongement de ce vecteur.

        const B0 = P2B.clone(); // même point que P2B

        const dirBas = new THREE.Vector2().subVectors(P2B, P1B).normalize();
        const distanceControle = 0.15; // distance choisie arbitrairement
        const B1 = new THREE.Vector2(
            B0.x + dirBas.x * distanceControle,
            B0.y + dirBas.y * distanceControle
        );

        // B2 : un peu plus haut, même rayon (grosso modo bande quasi verticale)
        const B2 = new THREE.Vector2(0.60, 0.18);

        // ----- HAUT -----
        // Idem raccord G1 entre Bande et Haut :
        // C0 = B2
        // direction en B2 donnée par la tangente (B1 -> B2)

        const C0 = B2.clone();
        const dirBande = new THREE.Vector2().subVectors(B2, B1).normalize();
        const C1 = new THREE.Vector2(
            C0.x + dirBande.x * distanceControle,
            C0.y + dirBande.y * distanceControle
        );

        // C2 : sommet, rayon plus petit, plus haut
        const C2 = new THREE.Vector2(0.30, 0.28);

        // ----- CONSTRUCTION DES 3 SURFACES LATHE -----
        const meshBas = this.buildLathe(this.nbPtCbe, this.nbPtRot, P0B, P1B, P2B, this.coulBas);
        const meshBande = this.buildLathe(this.nbPtCbe, this.nbPtRot, B0, B1, B2, this.coulBande);
        const meshHaut = this.buildLathe(this.nbPtCbe, this.nbPtRot, C0, C1, C2, this.coulHaut);

        // On les ajoute dans le group
        this.mesh.add(meshBas);
        this.mesh.add(meshBande);
        this.mesh.add(meshHaut);

        // On centre la pierre pour que le bas touche z=0
        // (Les profils ont été définis entre z ≈ -0.05 et 0.28)
//        this.mesh.position.z = 0.0;

        // On oriente la pierre pour que son axe de révolution soit vertical (Z)
        this.mesh.rotation.x = Math.PI / 2;

        // On la remonte un peu pour qu’elle repose sur la glace (z légèrement > 0)
        this.mesh.position.z = 0.05;

    }

    // Construit une surface de révolution à partir d’une Bézier quadratique
    buildLathe(nbPtCbe, nbPtRot, P0, P1, P2, couleur) {
        // Courbe de Bézier dans le plan (rayon, z)
        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(P0.x, P0.y),
            new THREE.Vector2(P1.x, P1.y),
            new THREE.Vector2(P2.x, P2.y)
        );

        // On échantillonne nbPtCbe points sur le profil
        const points = curve.getPoints(nbPtCbe);

        // Three.js LatheGeometry s’attend à des Vector2 (r,z), elle tourne autour de l’axe Z.
        const latheGeometry = new THREE.LatheGeometry(points, nbPtRot, 0, 2 * Math.PI);

        // On utilise ton utilitaire surfPhong(geom, coulDiffuse, opacite, transparent, coulSpeculaire)
        const latheMesh = surfPhong(latheGeometry, couleur, 1, false, 0xffffff);

        latheMesh.castShadow = true;
        latheMesh.receiveShadow = true;

        return latheMesh;
    }

    // Méthode pratique pour positionner la pierre sur la piste
    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    // Rotation autour de l’axe vertical (optionnel, utile pour animation)
    setRotation(angleRad) {
        this.mesh.rotation.z = angleRad;
    }

    // Ajout à la scène
    addToScene(scene) {
        scene.add(this.mesh);
    }
}