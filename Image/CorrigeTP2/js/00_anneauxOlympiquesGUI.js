const borneVue=15;//amplitude de deplacement de la camera


function anneau(MaScene, position, rotation, continent ){ 
 let rayMajeur = 1;
 let rayMineur = 0.075;
 let nbeMeridien = 100;
 let nbeParallel = 20;
 let tore = new  THREE.TorusGeometry(rayMajeur, rayMineur, nbeParallel, nbeMeridien, Math.PI * 2)     
 let Material = new THREE.MeshPhongMaterial/*THREE.MeshLambertMaterial*//*THREE.MeshBasicMaterial*/({
   color: continent,
   opacity: 0.75,
   transparent: false,
   wireframe: false,
   //specular: 0x636e72, 
   //flatShading: true,
   //side: THREE.FrontSide,
   side :THREE.DoubleSide,
   //wireframe: true
 });
 tore.rotateX(Math.PI/2+rotation/180*Math.PI);
 tore.translate(position.x,position.y,position.z);
 let anneau = new THREE.Mesh( tore, Material );
 MaScene.add( anneau );
}
//fin function anneau
 
function init(){
 var stats = initStats();
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
  
 
 let largeur_anneau  = 1;
 let ecart_anneau  = 0.2;
 let OEurope= new THREE.Vector3(-2*largeur_anneau-2*ecart_anneau,0,largeur_anneau/2);
 let OAsie= new THREE.Vector3(-largeur_anneau-ecart_anneau,0,-largeur_anneau/2);
 let OAfrique= new THREE.Vector3(0,0,largeur_anneau/2);
 let OOceanie= new THREE.Vector3(largeur_anneau+ecart_anneau,0,-largeur_anneau/2);
 let OAmerique= new THREE.Vector3(2*largeur_anneau+2*ecart_anneau,0,largeur_anneau/2);
 let rota =20;
    //Europe bleu
 anneau (scene, OEurope, rota, '#0000FF' ) 
   //Asie jaune
 anneau (scene, OAsie, -rota, '#FFFF00' ) 
    //Afrique Noire
 anneau (scene, OAfrique, rota, '#000000' ) 
    //Oceanie Vert
 anneau (scene, OOceanie, -rota, '#00FF00' ) 
    //Amerique Rouge
 anneau (scene, OAmerique, rota, '#FF0000' ) 
 // partie GUI
    // initialisation des controles gui
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 var gui = new dat.GUI();//interface graphique utilisateur
  // ajout du menu dans le GUI
 let menuGUI = new function () {
   this.cameraxPos = camera.position.x;
   this.camerayPos = camera.position.y;
   this.camerazPos = camera.position.z;
   this.cameraZoom = 1;
   this.cameraxDir = 0;
   this.camerayDir = 0;
   this.camerazDir = 0;
    
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
   posCamera();
  }, 200);// fin setTimeout(function ()
    // rendu avec requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();
    // rendu avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()