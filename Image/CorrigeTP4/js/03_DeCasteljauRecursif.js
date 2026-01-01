const borneVue=6;//amplitude de deplacement de la camera

 // De Casteljau dans le fichier Bezier.js
 
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
 //planRepere(scene);
 //plan du sol
  const largPlan = 75;
  const hautPlan = 125;
  const nbSegmentLarg = 30;
  const nbSegmentHaut = 30;
  const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
  const PlanSol = surfPhong(PlanSolGeometry,"#FF2255",1,true,"#335533");
  PlanSol.position.z = -.4;
  PlanSol.receiveShadow = true; 
  PlanSol.castShadow = true;
  scene.add(PlanSol);
// fin du plan du sol
 let P0 = new THREE.Vector3(1,0,0);
 let P1 = new THREE.Vector3(1,1,0);
 let P2 = new THREE.Vector3(-1,1,0);
 let P3 = new THREE.Vector3(-1,0,0);
 let M0 = new THREE.Vector3(1,0,0);
 let M1 = new THREE.Vector3(0,0,1);
 let M2 = new THREE.Vector3(-1,0,0);
 
 //alert(M0.x+"\n"+M0.y);    
 let tabP= new Array(4);   
 let tabP1= new Array(3);
 for (let k=0;k<tabP.length;k++){
   tabP[k]= new THREE.Vector3(0,0,0);
 }
 for (let k=0;k<tabP1.length;k++){
   tabP1[k]= new THREE.Vector3(0,0,0);
 }
 tabP[0].copy(P0);tabP[1].copy(P1);
 tabP[2].copy(P2);tabP[3].copy(P3); 
 tabP1[0].copy(M0);tabP1[1].copy(M1);tabP1[2].copy(M2);
 let nb=100;//nmbre de pts par courbe
 let epai=2;//epaisseur de la courbe
 let nbPtCB=100;//nombre de points sur la courbe de Bezier
 let dimPt=0.025;
  tracePt(scene, P0, "#000000",dimPt,true);
  tracePt(scene, P3, "#000000",dimPt,true);
 let nbrRec=3;
for(let k=1;k<tabP1.length-1;k++)
  tracePt(scene, tabP1[k], "#FF8888",dimPt,true);
for(let k=0;k<tabP1.length-1;k++)
  segment(scene,tabP1[k],tabP1[k+1],'#0000FF',3);
for(let k=1;k<tabP.length-1;k++)
  tracePt(scene, tabP[k], "#880088",dimPt,true);
for(let k=0;k<tabP.length-1;k++)
  segment(scene,tabP[k],tabP[k+1],'#FF0000',3);
 BezTab(scene,nb,tabP1,"#00FF00",epai);
 BezTab(scene,nb,tabP,"#00FFFF",epai);
 DeCasteljau2R(scene,M0,M1,M2,0.5,nbrRec,dimPt,nbrRec);
 DeCasteljau3R(scene,P0,P1,P2,P3,0.5,nbrRec,dimPt,nbrRec); 
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
   this.cameraxPos = camera.position.x;
   this.camerayPos = camera.position.y;
   this.camerazPos = camera.position.z;
   this.cameraZoom = 1;
   //pb avec camera lockAt
   this.cameraxDir = -1;//camera.getWorldDirection().x;
   this.camerayDir = 0;//camera.getWorldDirection().y;
   this.camerazDir = 0.25;//camera.getWorldDirection().z;
    
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
   posCamera();//sphereGeom1.parameters.radius = 2;//
  }, 200);// fin setTimeout(function ()
    // render using requestAnimationFrame
  rendu.render(scene, camera);//alert(camera.position.x);
 // alert("toto: "+camera.position.x+"\n : "+camera.position.y+"\n : "+camera.position.z);
  //alert("dirx : "+camera.getWorldDirection().x+"\n diry : "+camera.getWorldDirection().y+"\n dirz : "+camera.getWorldDirection().z);
 }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();

    /*if (menuGUI.rotateResult && result) {
      result.rotation.y += 0.04;
      //      result.rotation.x+=0.04;
      result.rotation.z -= 0.005;
    }*/

    // render using requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()