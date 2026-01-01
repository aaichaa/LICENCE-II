// js/curling.js
//les deux équipes du projet sont ROUGE et BLEU,
//même si certains identifiants internes contiennent le mot "jaune"
const borneVue = 12; // amplitude de déplacement de la caméra

// interpolation linéaire maison (pour éviter THREE.MathUtils.lerp)
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// dimensions globales de la piste
const LONGUEUR_PISTE = 30;
const LARGEUR_PISTE  = 8;
const X_MAISON = LONGUEUR_PISTE / 2 - 4;

// rayon approximatif d'une pierre (en unités de la scène)
const RAYON_PIERRE = 0.9;
// rayon de la maison (cercle extérieur bleu)
const RAYON_MAISON = 2.0;

// Variables globales
let renderer, scene, camera, stats;
let controls;      // TrackballControls
let gui, menuGUI;  // dat.GUI + menu caméra

// Trajectoire rectiligne
let ptDepart, ptArrivee;

// Trajectoire quadratique
let P0Quad, P1Quad, P2Quad;
let trajQuad;

// Trajectoire cubique
let P0Cub, P1Cub, P2Cub, P3Cub;
let trajCub;

// Trajectoire composée G1
let A1Comp, A2Comp;
let trajComp;

// animation
let tLancer = 0;
let meneTerminee = false
let lancerActif = false;
let modeTrajectoire = "ligne"; // "ligne", "quad", "cub", "comp"

// pierre animée (pierre courante)
let pierreTest;

// Liste des pierres (5 rouges + 5 bleus)
let pierres = [];
let indexPierreCourante = 0;


function afficherResumeFinal(scoreRouge, scoreJaune) {
    const p = document.getElementById("finalResult");
    if (!p) return;
    
    let texte;
    let couleur;
    
    if (scoreRouge > scoreJaune) {
        texte   = `Résultat final de la mène : Rouge ${scoreRouge} - Bleu ${scoreJaune}`;
        couleur = "red";
    } else if (scoreJaune > scoreRouge) {
        texte   = `Résultat final de la mène : Bleu ${scoreJaune} - Rouge ${scoreRouge}`;
        couleur = "blue";
    } else {
        texte   = `Résultat final de la mène : Égalité ${scoreRouge} - ${scoreJaune}`;
        couleur = "black";
    }
    
    p.textContent = texte;
    p.style.color = couleur;
}


// --- PISTE + MAISON ---
function creerPisteEtMaison(scene) {
    // ----- GLACE (piste) -----
    const geoGlace = new THREE.PlaneGeometry(LONGUEUR_PISTE, LARGEUR_PISTE, 10, 4);
    const meshGlace = surfPhong(geoGlace, "#DDEEFF", 1, true, "#335577");
    meshGlace.position.z = -0.1;
    meshGlace.receiveShadow = true;
    meshGlace.castShadow = false;
    scene.add(meshGlace);
    
    // ----- MAISON -----
    const xMaison = X_MAISON;
    const yMaison = 0;
    const zMaison = -0.09;
    
    const rExt   = RAYON_MAISON;
    const rBleu  = 1.5;
    const rRouge = 1.0;
    const rBlanc = 0.5;
    
    // GRAND CERCLE BLEU
    const geoExt = new THREE.CircleGeometry(rExt, 64);
    const maisonExt = surfPhong(geoExt, "#1E5AFF", 1.2, false, "#456FFF");
    maisonExt.position.set(xMaison, yMaison, zMaison);
    scene.add(maisonExt);
    
    // CERCLE BLANC
    const geoBlanc1 = new THREE.CircleGeometry(rBleu, 64);
    const maisonBlanc1 = surfPhong(geoBlanc1, "#FFFFFF", 1.2, false, "#DDDDDD");
    maisonBlanc1.position.set(xMaison, yMaison, zMaison + 0.0001);
    scene.add(maisonBlanc1);
    
    // CERCLE ROUGE
    const geoRouge = new THREE.CircleGeometry(rRouge, 64);
    const maisonRouge = surfPhong(geoRouge, "#D82828", 1.2, false, "#AA2222");
    maisonRouge.position.set(xMaison, yMaison, zMaison + 0.0002);
    scene.add(maisonRouge);
    
    // PETIT CERCLE BLANC
    const geoBlanc2 = new THREE.CircleGeometry(rBlanc, 64);
    const maisonBlanc2 = surfPhong(geoBlanc2, "#FFFFFF", 1.2, false, "#DDDDDD");
    maisonBlanc2.position.set(xMaison, yMaison, zMaison + 0.0003);
    scene.add(maisonBlanc2);
    
}

// --- CRÉATION DES 10 PIERRES (5 par équipe) ---
function creerPierres() {
    pierres = [];
    
    const couleursEquipe = [
        { bas: 0xff4444, bande: 0xffffff, haut: 0xaa0000 }, // ROUGE
        { bas: 0x4444ff, bande: 0xffffff, haut: 0x0000aa }  // JAUNE/BLEU
    ];
    
    for (let equipe = 0; equipe < 2; equipe++) {
        for (let i = 0; i < 5; i++) {
            let c = couleursEquipe[equipe];
            
            let pierre = new PierreCurling(c.bas, c.bande, c.haut, 30, 64);
            
            // On place temporairement la pierre hors du terrain
            pierre.setPosition(-100, 0, 0);
            
            pierre.addToScene(scene);
            
            pierres.push({
                mesh: pierre,
                equipe: equipe === 0 ? "rouge" : "jaune",
                lancee: false
            });
        }
    }
    
    indexPierreCourante = 0;
}

// =======================================================

function init() {
    // --- STATS ---
    stats = initStats();
    
    // --- RENDERER ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    
    const width  = window.innerWidth * 0.98;
    const height = window.innerHeight * 0.8;
    renderer.setSize(width, height);
    
    // --- SCÈNE ---
    scene = new THREE.Scene();
    
    // --- CAMÉRA ---
    camera = new THREE.PerspectiveCamera(
        20,
        width / height,
        0.1,
        100
    );
    
    cameraLumiere(scene, camera);
    lumiere(scene);
    repere(scene); //les trois vecteurs rouge vert
    
    // --- TRACKBALL CONTROLS (souris) ---
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.noRotate = false;
    controls.noZoom   = false;
    controls.noPan    = false;
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed   = 1.2;
    controls.panSpeed    = 0.8;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.2;
    
    // --- PISTE + MAISON ---
    creerPisteEtMaison(scene);
    
    
    // --- BALAIS (un par équipe) ---
    const balaiRouge = new Balai({
        couleurPoils: 0xff4444
    });
    // On le met près de la maison, côté gauche
    balaiRouge.setPosition(X_MAISON - 1.5, -2.5, 0);
    balaiRouge.setRotation(0, 0, 0.1);
    balaiRouge.addToScene(scene);
    
    const balaiJaune = new Balai({
        couleurPoils: 0xffff00
    });
    // Côté droit
    balaiJaune.setPosition(X_MAISON + 0.5, 2.5, 0);
    balaiJaune.setRotation(0, 0, -0.1);
    balaiJaune.addToScene(scene);
    
    
    
    // --- POINTS DE LA TRAJECTOIRE RECTILIGNE ---
    ptDepart  = new THREE.Vector3(-LONGUEUR_PISTE / 2 + 2, 0, 0);
    ptArrivee = new THREE.Vector3(X_MAISON, 0, 0);
    
    const geoTraj = new THREE.BufferGeometry().setFromPoints([ptDepart, ptArrivee]);
    const matTraj = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const ligneTraj = new THREE.Line(geoTraj, matTraj);
    ligneTraj.position.z = 0.05;
    scene.add(ligneTraj);
    
    // --- TRAJECTOIRE BÉZIER QUADRATIQUE ---
    P0Quad = ptDepart.clone();
    P2Quad = ptArrivee.clone();
    P1Quad = new THREE.Vector3(
        (P0Quad.x + P2Quad.x) / 2,
        2,
        0
    );
    
    let dimPt = 0.1;
    tracePt(scene, P0Quad, "#008888", dimPt, true);
    tracePt(scene, P1Quad, "#880000", dimPt, true);
    tracePt(scene, P2Quad, "#008888", dimPt, true);
    
    trajQuad = new TrajectoireQuadratique(scene, P0Quad, P1Quad, P2Quad, 50, 0xff00ff);
    
    // --- TRAJECTOIRE BÉZIER CUBIQUE ---
    P0Cub = ptDepart.clone();
    P3Cub = ptArrivee.clone();
    
    // on choisit deux points de contrôle pour courber la trajectoire
    let xm = (P0Cub.x + P3Cub.x) / 2;
    P1Cub = new THREE.Vector3(xm - 3, -2, 0);
    P2Cub = new THREE.Vector3(xm + 3,  2, 0);
    
    tracePt(scene, P1Cub, "#ffaa00", dimPt, true);
    tracePt(scene, P2Cub, "#ffaa00", dimPt, true);
    
    trajCub = new TrajectoireCubique(scene, P0Cub, P1Cub, P2Cub, P3Cub, 60, 0x00ffff);
    
    // --- TRAJECTOIRE COMPOSÉE G1 (quad + cub + quad) ---
    let xmComp = (ptDepart.x + ptArrivee.x) / 2;
    A1Comp = new THREE.Vector3(xmComp - 4,  1.5, 0);
    A2Comp = new THREE.Vector3(xmComp + 4, -1.5, 0);
    
    let dimPtComp = 0.12;
    tracePt(scene, A1Comp, "#ff00ff", dimPtComp, true);
    tracePt(scene, A2Comp, "#00ffff", dimPtComp, true);
    
    // Trajectoire composée G1 (classe définie dans Trajectoires.js)
    trajComp = new TrajectoireComposeeG1(scene, ptDepart, A1Comp, A2Comp, ptArrivee, 2.5);
    
    // --- CRÉATION DES 10 PIERRES ---
    creerPierres();
    
    // La pierre courante est la première
    pierreTest = pierres[indexPierreCourante].mesh;
    pierreTest.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
    


    // --- GUI CAMERA + paramètres de lancers ---
    gui = new dat.GUI();
    
    menuGUI = new function () {
        this.cameraxPos = camera.position.x;
        this.camerayPos = camera.position.y;
        this.camerazPos = camera.position.z;
        this.cameraZoom = 1;
        
        this.cameraxDir = 0;
        this.camerayDir = 0;
        this.camerazDir = 0;
        
        this.vitesse = 0.01;
        
        // Quadratique : P1
        this.P1x = P1Quad.x;
        this.P1y = P1Quad.y;
        this.P1z = P1Quad.z;
        
        // Cubique : P1 et P2
        this.P1cx = P1Cub.x;
        this.P1cy = P1Cub.y;
        this.P1cz = P1Cub.z;
        
        this.P2cx = P2Cub.x;
        this.P2cy = P2Cub.y;
        this.P2cz = P2Cub.z;
        
        this.actualisation = function () {
            posCamera();
            reAffichage();
        };
        
        this.lancerRectiligne = () => {
            
            if (meneTerminee || indexPierreCourante >= pierres.length) {
                console.log("Tous les lancers ont déjà été effectués.");
                return;
            }
            tLancer = 0;
            modeTrajectoire = "ligne";
            lancerActif = true;
            pierreTest = pierres[indexPierreCourante].mesh;
            pierreTest.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
        };
        
        this.lancerQuadratique = () => {
            if (meneTerminee || indexPierreCourante >= pierres.length) {
                console.log("Tous les lancers ont déjà été effectués.");
                return;
            }
            tLancer = 0;
            modeTrajectoire = "quad";
            lancerActif = true;
            pierreTest = pierres[indexPierreCourante].mesh;
            pierreTest.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
        };
        
        this.lancerCubique = () => {
            if (meneTerminee || indexPierreCourante >= pierres.length) {
                console.log("Tous les lancers ont déjà été effectués.");
                return;
            }
            tLancer = 0;
            modeTrajectoire = "cub";
            lancerActif = true;
            pierreTest = pierres[indexPierreCourante].mesh;
            pierreTest.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
        };
        
        // lancer sur la trajectoire composée G1
        this.lancerComposee = () => {
             if (meneTerminee || indexPierreCourante >= pierres.length) {
                console.log("Tous les lancers ont déjà été effectués.");
                return;
            }
            tLancer = 0;
            modeTrajectoire = "comp";
            lancerActif = true;
            pierreTest = pierres[indexPierreCourante].mesh;
            pierreTest.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
        };
        
        this.majP1Quad = () => {
            P1Quad.set(this.P1x, this.P1y, this.P1z);
            trajQuad.setP1(this.P1x, this.P1y, this.P1z);
        };
        
        this.majPCub = () => {
            P1Cub.set(this.P1cx, this.P1cy, this.P1cz);
            P2Cub.set(this.P2cx, this.P2cy, this.P2cz);
            trajCub.setP1(this.P1cx, this.P1cy, this.P1cz);
            trajCub.setP2(this.P2cx, this.P2cy, this.P2cz);
        };
    };
    
    
    // >>> AJOUT ICI <<<
    menuGUI.cameraxPos = 12;
    menuGUI.camerayPos = 0;
    menuGUI.camerazPos = 15;
    menuGUI.cameraZoom = 4;
    menuGUI.cameraxDir = X_MAISON;
    menuGUI.camerayDir = 0;
    menuGUI.camerazDir = 0;
    // <<< FIN AJOUT >>>
    // --- GUI CAMERA ---
    ajoutCameraGui(gui, menuGUI, camera);
    gui.add(menuGUI, "actualisation");
    
    // paramètres de la pierre
    gui.add(menuGUI, "vitesse", 0.002, 0.05).name("vitesse pierre");
    gui.add(menuGUI, "lancerRectiligne").name("Lancer (ligne)");
    
    // dossier quadratique
    let dossierQuad = gui.addFolder("Trajectoire quadratique");
    dossierQuad.add(menuGUI, "P1x", -10, 10, 0.1).onChange(function () { menuGUI.majP1Quad(); });
    dossierQuad.add(menuGUI, "P1y", -4, 4, 0.1).onChange(function () { menuGUI.majP1Quad(); });
    dossierQuad.add(menuGUI, "P1z", -2, 2, 0.1).onChange(function () { menuGUI.majP1Quad(); });
    dossierQuad.add(menuGUI, "lancerQuadratique").name("Lancer (quad)");
    
    // dossier cubique
    let dossierCub = gui.addFolder("Trajectoire cubique");
    dossierCub.add(menuGUI, "P1cx", -10, 10, 0.1).onChange(function () { menuGUI.majPCub(); });
    dossierCub.add(menuGUI, "P1cy", -4, 4, 0.1).onChange(function () { menuGUI.majPCub(); });
    dossierCub.add(menuGUI, "P1cz", -2, 2, 0.1).onChange(function () { menuGUI.majPCub(); });
    
    dossierCub.add(menuGUI, "P2cx", -10, 10, 0.1).onChange(function () { menuGUI.majPCub(); });
    dossierCub.add(menuGUI, "P2cy", -4, 4, 0.1).onChange(function () { menuGUI.majPCub(); });
    dossierCub.add(menuGUI, "P2cz", -2, 2, 0.1).onChange(function () { menuGUI.majPCub(); });
    
    dossierCub.add(menuGUI, "lancerCubique").name("Lancer (cub)");
    
    // dossier trajectoire composée G1
    let dossierComp = gui.addFolder("Trajectoire composée G1");
    dossierComp.add(menuGUI, "lancerComposee").name("Lancer (G1)");
    
    menuGUI.actualisation();
    
    // --- RENDU DANS LA PAGE ---
    document.getElementById("webgl").appendChild(renderer.domElement);
    renderer.render(scene, camera);
    
    // --- REDIMENSIONNEMENT ---
    window.addEventListener("resize", onWindowResize, false);
    
    // --- ANIMATION ---
    renduAnim();
    
    // =============== FONCTIONS INTERNES ===============
    
    function posCamera() {
        camera.position.set(
            menuGUI.cameraxPos * testZero(menuGUI.cameraZoom),
            menuGUI.camerayPos * testZero(menuGUI.cameraZoom),
            menuGUI.camerazPos * testZero(menuGUI.cameraZoom)
        );
        camera.lookAt(
            menuGUI.cameraxDir,
            menuGUI.camerayDir,
            menuGUI.camerazDir
        );
        actuaPosCameraHTML();
    }
    
    function actuaPosCameraHTML() {
        document.forms["controle"].PosX.value = testZero(menuGUI.cameraxPos);
        document.forms["controle"].PosY.value = testZero(menuGUI.camerayPos);
        document.forms["controle"].PosZ.value = testZero(menuGUI.camerazPos);
        document.forms["controle"].DirX.value = testZero(menuGUI.cameraxDir);
        document.forms["controle"].DirY.value = testZero(menuGUI.camerayDir);
        document.forms["controle"].DirZ.value = testZero(menuGUI.camerazDir);
    }
    
    function reAffichage() {
        setTimeout(function () {
            posCamera();
        }, 200);
        renderer.render(scene, camera);
    }
    
    // --- Gestion très simplifiée des collisions ---
    function gererCollisions(pos, oldPos) {
        const deplacement = new THREE.Vector3().subVectors(pos, oldPos);
        const distDepl = deplacement.length();
        
        if (distDepl < 1e-5) {
            return pos; // presque pas bougé, on ne calcule rien
        }
        
        deplacement.normalize();
        
        const minDist = 2 * RAYON_PIERRE;
        
        for (let i = 0; i < pierres.length; i++) {
            const p = pierres[i];
            if (!p.lancee) continue;                // on ne teste que les pierres déjà lancees
            if (p.mesh === pierreTest) continue;    // pas avec elle-même
            
            const otherPos = p.mesh.mesh.position;
            
            const dx = pos.x - otherPos.x;
            const dy = pos.y - otherPos.y;
            const d2 = dx*dx + dy*dy;
            
            if (d2 < minDist * minDist) {
                const dist = Math.sqrt(d2);
                const chevauchement = minDist - dist;
                
                // on pousse l'autre pierre dans la direction du mouvement
                const push = deplacement.clone().multiplyScalar(chevauchement);
                p.mesh.setPosition(
                    otherPos.x + push.x,
                    otherPos.y + push.y,
                    otherPos.z
                );
                
                // et on recule légèrement la pierre courante
                pos.addScaledVector(deplacement, -chevauchement * 0.5);
            }
        }
        
        return pos;
    }
    
    // --- Calcul du score de la mène actuelle ---
    function calculScore() {
        const centre = new THREE.Vector2(X_MAISON, 0);
        let pierresMaison = [];
        
        for (let p of pierres) {
            if (!p.lancee) continue;
            const pos = p.mesh.mesh.position;
            const pos2D = new THREE.Vector2(pos.x, pos.y);
            const d = pos2D.distanceTo(centre);
            
            if (d <= RAYON_MAISON) {
                pierresMaison.push({ equipe: p.equipe, dist: d });
            }
        }
        
        if (pierresMaison.length === 0) {
            return { scoreRouge: 0, scoreJaune: 0, gagnant: "aucune" };
        }
        
        const rouges = pierresMaison.filter(p => p.equipe === "rouge");
        const jaunes = pierresMaison.filter(p => p.equipe === "jaune");
        
        let minR = rouges.length ? Math.min(...rouges.map(p => p.dist)) : Infinity;
        let minJ = jaunes.length ? Math.min(...jaunes.map(p => p.dist)) : Infinity;
        
        let gagnant;
        if (minR < minJ) gagnant = "rouge";
        else if (minJ < minR) gagnant = "jaune";
        else gagnant = "aucune";
        
        if (gagnant === "aucune") {
            return { scoreRouge: 0, scoreJaune: 0, gagnant };
        }
        
        let distOpp = (gagnant === "rouge") ? minJ : minR;
        if (!isFinite(distOpp)) distOpp = Infinity;
        
        const pierresGagnant = pierresMaison.filter(p => p.equipe === gagnant && p.dist < distOpp);
        const points = pierresGagnant.length;
        
        return {
            scoreRouge: gagnant === "rouge" ? points : 0,
            scoreJaune: gagnant === "jaune" ? points : 0,
            gagnant
        };
    }
    
    // --- Ajout d'une ligne dans le tableau HTML du score ---
    function ajouterLigneScore(numLancer, score) {
        const tbody = document.getElementById("scoreBody");
        if (!tbody) return;
        
        const tr = document.createElement("tr");
        
        const tdNum = document.createElement("td");
        tdNum.textContent = numLancer;
        
        const tdR = document.createElement("td");
        tdR.textContent = score.scoreRouge;
        
        const tdJ = document.createElement("td");
        tdJ.textContent = score.scoreJaune;
        
        const tdG = document.createElement("td");
        tdG.textContent = (score.gagnant === "aucune") ? "Aucune" :
        (score.gagnant === "rouge" ? "Rouge" : "Bleu");
        
        tr.appendChild(tdNum);
        tr.appendChild(tdR);
        tr.appendChild(tdJ);
        tr.appendChild(tdG);
        
        // couleur de la ligne selon l'équipe qui mène
        if (score.gagnant === "rouge") {
            tr.style.color = "red";
        } else if (score.gagnant === "jaune") {
            tr.style.color = "blue"; 
        } else {
            tr.style.color = "black";
        }
        
        tbody.appendChild(tr);
    }
    
    function renduAnim() {
        stats.update();
        if (controls) controls.update();
        
        if (lancerActif && pierreTest) {
            const oldPos = pierreTest.mesh.position.clone();
            
            tLancer += menuGUI.vitesse;
            if (tLancer >= 1) {
                tLancer = 1;
                lancerActif = false;
                
                // numéro du lancer qui vient de se terminer
                const numLancer = indexPierreCourante + 1;
                
                // On marque la pierre comme lancée
                pierres[indexPierreCourante].lancee = true;
                
                // Calcul du score après ce lancer
                const score = calculScore();
                ajouterLigneScore(numLancer, score);
                
                // Si c'était la dernière pierre, on affiche le résumé final
                if (numLancer === pierres.length) {
                    afficherResumeFinal(score.scoreRouge, score.scoreJaune);
                    meneTerminee = true;
                } else {
                    // Sinon, on passe à la pierre suivante et on la place au départ
                    indexPierreCourante++;
                    const prochaine = pierres[indexPierreCourante].mesh;
                    prochaine.setPosition(ptDepart.x, ptDepart.y, ptDepart.z);
                }
                
                console.log(
                    "Pierre terminée. Prochaine pierre :",
                    (numLancer < pierres.length) ? (indexPierreCourante + 1) : "aucune (fin de mène)",
                    "Score R/J:",
                    score.scoreRouge,
                    score.scoreJaune
                );
            }
            
            
            let pos;
            if (modeTrajectoire === "ligne") {
                pos = new THREE.Vector3(
                    lerp(ptDepart.x, ptArrivee.x, tLancer),
                    lerp(ptDepart.y, ptArrivee.y, tLancer),
                    lerp(ptDepart.z, ptArrivee.z, tLancer)
                );
            } else if (modeTrajectoire === "quad") {
                pos = trajQuad.getPoint(tLancer);
            } else if (modeTrajectoire === "cub") {
                pos = trajCub.getPoint(tLancer);
            } else if (modeTrajectoire === "comp") {
                pos = trajComp.getPoint(tLancer);
            } else {
                // fallback : on prend la rectiligne
                pos = new THREE.Vector3(
                    lerp(ptDepart.x, ptArrivee.x, tLancer),
                    lerp(ptDepart.y, ptArrivee.y, tLancer),
                    lerp(ptDepart.z, ptArrivee.z, tLancer)
                );
            }
            
            // collisions simplifiées avec les pierres déjà présentes
            pos = gererCollisions(pos, oldPos);
            
            pierreTest.setPosition(pos.x, pos.y, pos.z);
        }
        
        requestAnimationFrame(renduAnim);
        renderer.render(scene, camera);
    }
} // fin init()

function onWindowResize() {
    const width  = window.innerWidth * 0.98;
    const height = window.innerHeight * 0.8;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    if (controls) controls.handleResize();
}
