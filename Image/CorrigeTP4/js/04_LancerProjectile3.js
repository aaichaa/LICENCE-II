const borneVue=36;//amplitude de deplacement de la camera

const h=2.75;// Point du lancer
const g = new THREE.Vector3(0,0,-10);// gravitation
const vecI = new THREE.Vector3(1,0,0);
const vecJ = new THREE.Vector3(0,1,0);
const vecK = new THREE.Vector3(0,0,1);
const beta=0.75;//coefficient d'amortissement lors du rebond
const Rb = 1.75; // rayon de la balle
const angleRotationBalle=Math.PI/6;
let angle = 0;// rotation de la balle
const nbrSegmentParCbe = 20;//nbre de segment
const nb=100;//nmbre de pts par courbe
const epai=2;//epaisseur de la courbe
const dimPt=0.05;
const nbPtTennis = 1000;
let PtCourant=0;
let CbeCourante=0;//valeur du parametre de la courbe
let tabPtsControleBezier = new Array(3);
for(let j = 0;j<3;j++) 
  tabPtsControleBezier[j] = new THREE.Vector3(0,0,0);
let nbeCbes=0;

// fonction init
 
function init(){
 let stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();   
 let result;
 let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 repere(scene);
 //plans contenant deux axes du repere
// planRepere(scene);
 //plan du sol
  const largPlan = 75;
  const hautPlan = 45;
  const nbSegmentLarg = 70;
  const nbSegmentHaut = 70;
  const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
  const PlanSol = surfPhong(PlanSolGeometry,"#559955",1,true,"#335533");
  PlanSol.receiveShadow = true; 
  PlanSol.castShadow = true;
  scene.add(PlanSol);
  const PlanFond = surfPhong(PlanSolGeometry,"#8888FF",1,true,"#335533");
  PlanFond.rotateX(Math.PI/2);
  PlanFond.translateZ(-10);//pourquoi pas Y
  PlanFond.receiveShadow = true; 
  PlanFond.castShadow = true;
  scene.add(PlanFond);
// fin du plan du sol
 
 let v0=6;
 let alpha=Math.PI/4;
 let P0 = new THREE.Vector3(0,0,h+Rb); 
 let vectP0=new THREE.Vector3(v0*Math.cos(alpha),0,v0*Math.sin(alpha)); 
 vecteurTan(scene,P0,vectP0,"#FF00FF",0.25, 0.125);
 let nbrRec=3;
 let coulPt="#009900";
 tracePt(scene, P0, "#008888",dimPt,true);
 //trajectoireBaseCanonique(scene,h+Rb,v0,alpha,nb,-0.25,1.25,"#005555",epai);
 let nbPts = 100;
// let tabPtBezCano = new Array(3);
// tabPtBezCano = BezierCanonique(P0,vectP0,nb,"#FF5555",epai,coulPt,dimPt);
 //let cbeBezBaseCano = TraceBezierQuadratique(P0, tabPtBezCano[1], tabPtBezCano[2], nbPts,"#005555",2*epai);
 //scene.add(cbeBezBaseCano);
 //for(let k=0;k<2;k++) 
  //segment(scene,tabPtBezCano[k],tabPtBezCano[k+1],"#FF0000",epai);
 //tracePt(scene, tabPtBezCano[1], "#008888",dimPt,true);
 //tracePt(scene, tabPtBezCano[2], "#008888",dimPt,true);
 let tabPtCourbeQ = new Array(4);// 3pts de controle et un vecteur vitesse
 tabPtCourbeQ=BezierAvantRebond(scene,P0,h,vectP0,nb,"#000000",epai,"#FF8800",dimPt);
 let  cbeBezCourbeQ = TraceBezierQuadratique(P0, tabPtCourbeQ[1], tabPtCourbeQ[2], nbPts,"#005555",epai);
 scene.add(cbeBezCourbeQ);
 for(let k=0;k<2;k++) 
  segment(scene,tabPtCourbeQ[k],tabPtCourbeQ[k+1],"#FF0000",epai);
 tracePt(scene, tabPtCourbeQ[1], "#008888",dimPt,true);
 tracePt(scene, tabPtCourbeQ[2], "#008888",dimPt,true);
 nbeCbes++;
 for(let j=0;j<3;j++)
  tabPtsControleBezier[j] = new THREE.Vector3(tabPtCourbeQ[j].x,0,tabPtCourbeQ[j].z);
 let tabPtCourbeR = new Array(4);
 for(let k=0;k<4;k++) 
    tabPtCourbeR[k] = new THREE.Vector3(0,0,0);
 tabPtCourbeR=BezierApresRebond(scene,tabPtCourbeQ,nbPtTennis,"#FF0099",epai,"#000000",dimPt);
 let  cbeBezCourbeR = TraceBezierQuadratique(tabPtCourbeR[0], tabPtCourbeR[1], tabPtCourbeR[2], nbPts,"#FFFF00",epai);
 scene.add(cbeBezCourbeR);
 for(let k=0;k<2;k++) 
  segment(scene,tabPtCourbeR[k],tabPtCourbeR[k+1],"#FF0000",epai);
 tracePt(scene, tabPtCourbeR[1], "#008888",dimPt,true);
 tracePt(scene, tabPtCourbeR[2], "#008888",dimPt,true);
 nbeCbes++;
 for(let j=0;j<3;j++)
  tabPtsControleBezier[tabPtsControleBezier.length] = new THREE.Vector3(tabPtCourbeR[j].x,0,tabPtCourbeR[j].z);
 do{
 tabPtCourbeR=BezierApresRebond(scene,tabPtCourbeR,nb,"#FF0099",epai,"#000000",dimPt);
 cbeBezCourbeR = TraceBezierQuadratique(tabPtCourbeR[0], tabPtCourbeR[1], tabPtCourbeR[2], nbPts,"#FFFF00",epai);
 for(let k=0;k<2;k++) 
  segment(scene,tabPtCourbeR[k],tabPtCourbeR[k+1],"#FF0000",epai);
 tracePt(scene, tabPtCourbeR[1], "#008888",dimPt,true);
 tracePt(scene, tabPtCourbeR[2], "#008888",dimPt,true);
 nbeCbes++;
 for(let j=0;j<3;j++)
  tabPtsControleBezier[tabPtsControleBezier.length] = new THREE.Vector3(tabPtCourbeR[j].x,0,tabPtCourbeR[j].z);
 scene.add(cbeBezCourbeR);
 }
 while (tabPtCourbeR[0].distanceTo(tabPtCourbeR[2])>.95);
 let sphereGeometry = new THREE.SphereGeometry(Rb, 130, 160);
 let sphere = surfPhong(sphereGeometry,"#FFFF00",1,true,"#FFFF00");
 sphere.castShadow = true;
 sphere.receiveShadow = true;
 let cbeSurBalle = traceCourbePara(nb,"#FFFFFF",epai);
 let pos = PtSurBez2(tabPtsControleBezier[3*CbeCourante],tabPtsControleBezier[3*CbeCourante+1],tabPtsControleBezier[3*CbeCourante+2],PtCourant/(nbrSegmentParCbe));
 // centre de la sphere
 sphere.position.set(pos.x, pos.y, pos.z);
 sphere.rotateY(angle*angleRotationBalle);
 cbeSurBalle.translateX(pos.x);
 cbeSurBalle.translateY(pos.y);
 cbeSurBalle.translateZ(pos.z);
 cbeSurBalle.rotateY(angle*angleRotationBalle);
 // ou .translateOnAxis ( axis : Vector3, distance : Float ) : this
 //axis -- A normalized vector in object space.
 //distance -- The distance to translate.
 angle++;
// document.getElementById("result").innerHTML+="<br />"+pos.x+" ;  "+pos.y+"  ;  "+pos.z;
 // ajout de sphere
 scene.add(sphere);
 scene.add(cbeSurBalle);
 
 // partie GUI
    // initialisation des controles gui
 //let gui = new dat.GUI({ autoPlace: true });//interface graphique utilisateur
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 let gui = new dat.GUI();//interface graphique utilisateur
  // ajout du menu dans le GUI
 let menuGUI = new function () {
   this.cameraxPos = 7;//camera.position.x;
   this.camerayPos = -30;//camera.position.y;
   this.camerazPos = 6;//camera.position.z;
   this.cameraZoom = 1;
   //pb avec camera lockAt
   this.cameraxDir = 7;//camera.getWorldDirection().x;
   this.camerayDir = 0;//camera.getWorldDirection().y;
   this.camerazDir = 5;//camera.getWorldDirection().z;
    
   //pour actualiser dans la scene   
   this.actualisation = function () {
    posCamera();
    reAffichage();
   }; // fin this.actualisation
 }; // fin de la fonction menuGUI
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 //ajout du menu pour actualiser l'affichage 
 gui.add(menuGUI, "actualisation");
 menuGUI.actualisation();
 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
 renduAnim();
 
  // definition des fonctions idoines
 function posCamera(){
  camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
  camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
  actuaPosCameraHTML();
 }
 
 function actuaPosCameraHTML(){
  document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
  document.forms["controle"].PosY.value=testZero(menuGUI.camerayPos);
  document.forms["controle"].PosZ.value=testZero(menuGUI.camerazPos); 
  document.forms["controle"].DirX.value=testZero(menuGUI.cameraxDir);
  document.forms["controle"].DirY.value=testZero(menuGUI.camerayDir);
  document.forms["controle"].DirZ.value=testZero(menuGUI.camerazDir);
 } // fin fonction posCamera
  // ajoute le rendu dans l'element HTML
 document.getElementById("webgl").appendChild(rendu.domElement);
   
  // affichage de la scene
 rendu.render(scene, camera);
  
 
 function reAffichage() {
  setTimeout(function () {
   angle++;
   if (sphere) scene.remove(sphere);
   if (cbeSurBalle) scene.remove(cbeSurBalle);
   posCamera();//sphereGeom1.parameters.radius = 2;//
   sphere = surfPhong(sphereGeometry,"#FFFF00",1,true,"#223322");
   cbeSurBalle.translateX(-pos.x);
   cbeSurBalle.translateY(-pos.y);
   cbeSurBalle.translateZ(-pos.z);
   pos = PtSurBez2(tabPtsControleBezier[3*CbeCourante],tabPtsControleBezier[3*CbeCourante+1],tabPtsControleBezier[3*CbeCourante+2],(PtCourant%nbrSegmentParCbe)/(nbrSegmentParCbe));
   //sphere.scale.set(1,1,2);
   sphere.rotateY(angle*angleRotationBalle);
  // centre de la sphere
   sphere.position.set(pos.x, pos.y, pos.z);
   //reactualisation des propietes d'ombrage
   sphere.castShadow = true;
   sphere.receiveShadow = true;
  // ajout de sphere
   scene.add(sphere);
   cbeSurBalle = traceCourbePara(nb,"#FFFFFF",epai);
   cbeSurBalle.translateX(pos.x);
   cbeSurBalle.translateY(pos.y);
   cbeSurBalle.translateZ(pos.z);
   cbeSurBalle.rotateY(angle*angleRotationBalle);
   scene.add(cbeSurBalle);
   PtCourant++;
   if (CbeCourante<nbeCbes){  
    if (PtCourant%nbrSegmentParCbe==0) CbeCourante++
    if (CbeCourante<nbeCbes)//pour arreter au dernier point de la derniere courbe
      reAffichage();
      else {
        scene.remove(cbeSurBalle);
        pos = PtSurBez2(tabPtsControleBezier[3*(CbeCourante-1)],tabPtsControleBezier[3*(CbeCourante-1)+1],tabPtsControleBezier[3*(CbeCourante-1)+2],1);
     // centre de la sphere
        sphere.position.set(pos.x, pos.y, pos.z);
        //reactualisation des propietes d'ombrage
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        scene.add(sphere);
        cbeSurBalle = traceCourbePara(nb,"#FFFFFF",epai);
        //cbeSurBalle.rotateY(angle*angleRotationBalle);
        cbeSurBalle.translateX(pos.x);
        cbeSurBalle.translateY(pos.y);
        cbeSurBalle.translateZ(pos.z);
        scene.add(cbeSurBalle);
      }
    }   
  }, 200);// fin setTimeout(function ()
    // render using requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()
 
 
 function renduAnim() {
  stats.update();
  requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
  rendu.render(scene, camera);
 }
 
} // fin fonction init()