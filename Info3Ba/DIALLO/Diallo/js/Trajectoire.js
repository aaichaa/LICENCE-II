// js/Trajectoires.js

// =====================
//   Bézier QUADRATIQUE
// =====================

// Bézier quadratique en 3D
// P(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
function bezierQuad3D(t, P0, P1, P2) {
    let unmoinsT = 1 - t;
    let unmoinsT2 = unmoinsT * unmoinsT;
    let t2 = t * t;

    let x = unmoinsT2 * P0.x + 2 * unmoinsT * t * P1.x + t2 * P2.x;
    let y = unmoinsT2 * P0.y + 2 * unmoinsT * t * P1.y + t2 * P2.y;
    let z = unmoinsT2 * P0.z + 2 * unmoinsT * t * P1.z + t2 * P2.z;

    return new THREE.Vector3(x, y, z);
}

// Classe TrajectoireQuadratique : gère la courbe + son affichage
class TrajectoireQuadratique {

    constructor(MaScene, P0, P1, P2, nbPts, coulLigne) {
        this.scene = MaScene;

        this.P0 = P0.clone();
        this.P1 = P1.clone();
        this.P2 = P2.clone();

        this.nbPts = nbPts !== undefined ? nbPts : 50;
        this.coulLigne = coulLigne !== undefined ? coulLigne : 0xff00ff;

        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({ color: this.coulLigne });

        this.ligne = new THREE.Line(this.geometry, this.material);
        this.ligne.position.z = 0.06; // un peu au-dessus de la glace

        this.scene.add(this.ligne);

        this.majGeometry();
    }

    // recalcule la polyligne qui approxime la Bézier
    majGeometry() {
        let tabPoints = new Array(this.nbPts + 1);
        for (let k = 0; k <= this.nbPts; k++) {
            let t = k / this.nbPts;
            tabPoints[k] = bezierQuad3D(t, this.P0, this.P1, this.P2);
        }
        this.geometry.setFromPoints(tabPoints);
        this.geometry.attributes.position.needsUpdate = true;
    }

    // renvoie le point de la courbe pour un paramètre t dans [0,1]
    getPoint(t) {
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        return bezierQuad3D(t, this.P0, this.P1, this.P2);
    }

    // change le point de contrôle P1 et recalcule la courbe
    setP1(x, y, z) {
        this.P1.set(x, y, z);
        this.majGeometry();
    }
}


// =================
//   Bézier CUBIQUE
// =================

// Bézier cubique en 3D
// P(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t)t^2 P2 + t^3 P3
function bezierCub3D(t, P0, P1, P2, P3) {
    let u = 1 - t;
    let u2 = u * u;
    let u3 = u2 * u;
    let t2 = t * t;
    let t3 = t2 * t;

    let x = u3 * P0.x + 3 * u2 * t * P1.x + 3 * u * t2 * P2.x + t3 * P3.x;
    let y = u3 * P0.y + 3 * u2 * t * P1.y + 3 * u * t2 * P2.y + t3 * P3.y;
    let z = u3 * P0.z + 3 * u2 * t * P1.z + 3 * u * t2 * P2.z + t3 * P3.z;

    return new THREE.Vector3(x, y, z);
}

// Classe TrajectoireCubique : gère la courbe + son affichage
class TrajectoireCubique {

    constructor(MaScene, P0, P1, P2, P3, nbPts, coulLigne) {
        this.scene = MaScene;

        this.P0 = P0.clone();
        this.P1 = P1.clone();
        this.P2 = P2.clone();
        this.P3 = P3.clone();

        this.nbPts = nbPts !== undefined ? nbPts : 60;
        this.coulLigne = coulLigne !== undefined ? coulLigne : 0x00ffff;

        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({ color: this.coulLigne });

        this.ligne = new THREE.Line(this.geometry, this.material);
        this.ligne.position.z = 0.07; // un peu au-dessus de la quad

        this.scene.add(this.ligne);

        this.majGeometry();
    }

    majGeometry() {
        let tabPoints = new Array(this.nbPts + 1);
        for (let k = 0; k <= this.nbPts; k++) {
            let t = k / this.nbPts;
            tabPoints[k] = bezierCub3D(t, this.P0, this.P1, this.P2, this.P3);
        }
        this.geometry.setFromPoints(tabPoints);
        this.geometry.attributes.position.needsUpdate = true;
    }

    getPoint(t) {
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        return bezierCub3D(t, this.P0, this.P1, this.P2, this.P3);
    }

    setP1(x, y, z) {
        this.P1.set(x, y, z);
        this.majGeometry();
    }

    setP2(x, y, z) {
        this.P2.set(x, y, z);
        this.majGeometry();
    }
}


// =============================
//   Trajectoire composée G1
// =============================

// Cette classe construit 3 morceaux :
// - segment 0 : Bézier quadratique  P0 -> A1
// - segment 1 : Bézier cubique      A1 -> A2
// - segment 2 : Bézier quadratique  A2 -> P3
// Les points de contrôle intermédiaires sont choisis de manière
// à ce que les tangentes aux jonctions A1 et A2 soient colinéaires (G1).

class TrajectoireComposeeG1 {

    constructor(MaScene, P0, A1, A2, P3, distCtrl = 3.0) {
        this.scene = MaScene;

        // points "ancrés" (que tu peux faire bouger plus tard via GUI)
        this.P0 = P0.clone();
        this.A1 = A1.clone();
        this.A2 = A2.clone();
        this.P3 = P3.clone();

        this.distCtrl = distCtrl; // distance des points de contrôle depuis les jonctions

        // sous-trajectoires
        this.seg0 = null; // quadratique
        this.seg1 = null; // cubique
        this.seg2 = null; // quadratique

        this.creerSegments();
    }

    // calcule les points de contrôle en imposant G1 aux jonctions
    creerSegments() {

        // ====== Jonction autour de A1 ======
        // direction de la tangente autour de A1 ~ (A1 - P0)
        let dir1 = new THREE.Vector3().subVectors(this.A1, this.P0).normalize();

        // Pour la quad 0 : contrôle Q1 sur la droite P0-A1, proche d'A1
        let Q1 = this.A1.clone().addScaledVector(dir1, -this.distCtrl);

        // Pour la cubique : premier contrôle C1 aligné dans la même direction
        let C1 = this.A1.clone().addScaledVector(dir1, this.distCtrl);

        // ====== Jonction autour de A2 ======
        // direction de la tangente autour de A2 ~ (P3 - A2)
        let dir2 = new THREE.Vector3().subVectors(this.P3, this.A2).normalize();

        // Pour la cubique : second contrôle C2 aligné sur la direction de sortie
        let C2 = this.A2.clone().addScaledVector(dir2, -this.distCtrl);

        // Pour la quad 2 : contrôle Q3 sur la même droite que A2-P3
        let Q3 = this.A2.clone().addScaledVector(dir2, this.distCtrl);

        // suppression éventuelle des anciennes lignes
        if (this.seg0) this.scene.remove(this.seg0.ligne);
        if (this.seg1) this.scene.remove(this.seg1.ligne);
        if (this.seg2) this.scene.remove(this.seg2.ligne);

        // création des 3 morceaux
        this.seg0 = new TrajectoireQuadratique(this.scene, this.P0, Q1, this.A1, 40, 0xff8800);
        this.seg1 = new TrajectoireCubique(this.scene, this.A1, C1, C2, this.A2, 60, 0x00ff88);
        this.seg2 = new TrajectoireQuadratique(this.scene, this.A2, Q3, this.P3, 40, 0x8888ff);
    }

    // Si on veut changer A1 ou A2 dynamiquement
    setAnchors(A1, A2) {
        this.A1.copy(A1);
        this.A2.copy(A2);
        this.creerSegments();
    }

    // renvoie le point P(t) pour t dans [0,1] sur l'ensemble de la trajectoire
    getPoint(t) {
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        let pos;
        if (t < 1 / 3) {
            // segment 0 : t in [0,1/3] -> t0 in [0,1]
            let t0 = t * 3;
            pos = this.seg0.getPoint(t0);
        } else if (t < 2 / 3) {
            // segment 1 : t in [1/3,2/3] -> t1 in [0,1]
            let t1 = (t - 1 / 3) * 3;
            pos = this.seg1.getPoint(t1);
        } else {
            // segment 2 : t in [2/3,1] -> t2 in [0,1]
            let t2 = (t - 2 / 3) * 3;
            pos = this.seg2.getPoint(t2);
        }

        return pos;
    }
}
