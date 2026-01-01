const borneVue=10;//amplitude de deplacement de la camera


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
 let origine = new THREE.Vector3( 0,0,0 );
 let vecU = new THREE.Vector3( -7.,4.,-4. );
 let vecV = new THREE.Vector3( 4.,8.,1. );
 let vecW = new THREE.Vector3( 4.,-1.,-8. );
 let vecR = new THREE.Vector3(0,0,0);
 let vecNul = new THREE.Vector3(0,0,0);
 vecU.multiplyScalar(1./9.);
 vecV.multiplyScalar(1./9.);
 vecW.multiplyScalar(1./9.);
 vecR.crossVectors(vecU,vecV);
 vecNul.subVectors(vecR,vecW);
 vecteur(scene,origine,vecU,0xFFFF00,0.25,0.125)
 vecteur(scene,origine,vecV,0xFF00FF,0.25,0.125)
 vecteur(scene,origine,vecW,0x00FFFF,0.25,0.125)
 document.getElementById("result").innerHTML+='<span id="vecU">u('+vecU.x+"; "+vecU.y+"; "+vecU.z+" );<br /> norme de u : "+vecU.dot(vecU)+"  </span><br />";
 document.getElementById("result").innerHTML+='<span id="vecV">v('+vecV.x+"; "+vecV.y+"; "+vecV.z+" );<br /> norme de v : "+vecV.dot(vecV)+"  </span><br />";
 document.getElementById("result").innerHTML+='<span id="vecW">w('+vecW.x+"; "+vecW.y+"; "+vecW.z+" );<br /> norme de w : "+vecW.dot(vecW)+"  </span><br />";
 document.getElementById("result").innerHTML+="u . v = "+vecU.dot(vecV)+"  <br />";
 document.getElementById("result").innerHTML+="u . w = "+vecU.dot(vecW)+"  <br />";
 document.getElementById("result").innerHTML+="v . w = "+vecV.dot(vecW)+"  <br /><br /> Avec testZero<br />";
 document.getElementById("result").innerHTML+="u . v = "+testZero(vecU.dot(vecV))+"  <br />";
 document.getElementById("result").innerHTML+="u . w = "+testZero(vecU.dot(vecW))+"  <br />";
 document.getElementById("result").innerHTML+="v . w = "+testZero(vecV.dot(vecW))+"  <br /><br /> Sans testZero<br />";
 afficheVecteur(vecNul,"<span id='vecNul'>vecNul w - u &times; v ?</span> ","result");
 if (Math.abs(vecNul.dot(vecNul))<0.00001)
   document.getElementById("result").innerHTML+='<span id="hourra"> La base est directe </span><br />';
   else document.getElementById("result").innerHTML+='<span id="beurk">  La base est indirecte';
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