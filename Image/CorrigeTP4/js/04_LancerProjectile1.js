const borneVue=6;//amplitude de deplacement de la camera

const g = new THREE.Vector3(0,0,-10);// gravitation
const vecI = new THREE.Vector3(1,0,0);
const vecJ = new THREE.Vector3(0,1,0);
const vecK = new THREE.Vector3(0,0,1);
const beta=0.75;//coefficient d'amortissement lors du rebond


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
 //planRepere(scene);
 //plan du sol
  const largPlan = 75;
  const hautPlan = 25;
  const nbSegmentLarg = 30;
  const nbSegmentHaut = 30;
  const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
  const PlanSol = surfPhong(PlanSolGeometry,"#559955",1,true,"#335533");
  PlanSol.receiveShadow = true; 
  PlanSol.castShadow = true;
  scene.add(PlanSol);
  const PlanFond = surfPhong(PlanSolGeometry,"#BBBBFF",1,true,"#110011");
  PlanFond.rotateX(Math.PI/2);
  PlanFond.translateZ(-10);//pourquoi pas Y
  PlanFond.receiveShadow = true; 
  PlanFond.castShadow = true;
  scene.add(PlanFond);
// fin du plan du sol
 
 let h=1.75;// Point du lancer
 let v0=6;
 let alpha=Math.PI/4;
 let P0 = new THREE.Vector3(0,0,h); 
 let vectP0=new THREE.Vector3(v0*Math.cos(alpha),0,v0*Math.sin(alpha)); 
 vecteurTan(scene,P0,vectP0,"#FF00FF",0.25, 0.125);
 let nb=100;//nmbre de pts par courbe
 let epai=2;//epaisseur de la courbe
 let dimPt=0.05;
 let nbrRec=3;
 let coulPt="#009900";
 tracePt(scene, P0, "#008888",dimPt,true);
 //trajectoireBaseCanonique(scene,h,v0,alpha,nb,-0.25,1.25,"#005555",epai);
 let nbPts = 100;
 let tabPtBezCano = new Array(3);
 tabPtBezCano = BezierCanonique(P0,vectP0,nb,"#FF5555",epai,coulPt,dimPt);
 let cbeBezBaseCano = TraceBezierQuadratique(P0, tabPtBezCano[1], tabPtBezCano[2], nbPts,"#005555",2*epai);
 //scene.add(cbeBezBaseCano);
 //for(let k=0;k<2;k++) 
  //segment(scene,tabPtBezCano[k],tabPtBezCano[k+1],"#FF0000",epai);
 //tracePt(scene, tabPtBezCano[1], "#008888",dimPt,true);
 //tracePt(scene, tabPtBezCano[2], "#008888",dimPt,true);
 let tabPtCourbeQ = new Array(4);// 3pts de controle et un vecteur vitesse
 tabPtCourbeQ=BezierAvantRebond(scene,P0,h,vectP0,nb,"#000000",epai,"#FF8800",dimPt);
 let  cbeBezCourbeQ = TraceBezierQuadratique(P0, tabPtCourbeQ[1], tabPtCourbeQ[2], nbPts,"#005555",2*epai); 
 scene.add(cbeBezCourbeQ);
 for(let k=0;k<2;k++) 
  segment(scene,tabPtCourbeQ[k],tabPtCourbeQ[k+1],"#FF0000",epai);
 tracePt(scene, tabPtCourbeQ[1], "#008888",dimPt,true);
 tracePt(scene, tabPtCourbeQ[2], "#008888",dimPt,true);
 
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
   this.cameraxDir = 4;//camera.getWorldDirection().x;
   this.camerayDir = 0;//camera.getWorldDirection().y;
   this.camerazDir = 1;//camera.getWorldDirection().z;
    
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