const borneVue=6;//amplitude de deplacement de la camera


//courbe fermee
function cercle(MaScene, nb, R, couleurHexa, epai){
 var tabP= new Array(nb);  
    for(var k=0;k<nb;k++){
       var t2=k/nb*2*Math.PI;;
       t2=t2.toPrecision(PrecisionArrondi);
       let x0,y0;
       with(Math){
        x0=R*cos(t2);
        y0=R*sin(t2);
       }
       tabP[k]= new THREE.Vector3(x0,y0,0); 
    }
    for (var k=0;k<nb;k++)
      segment(MaScene,tabP[k],tabP[(k+1)%nb],couleurHexa,epai);
} // fin fonction cercle

//courbe ouverte
function ArcDeCercle(MaScene, nb, R, couleurHexa, epai){
 var tabP= new Array(nb+1);  
       //document.getElementById("res").innerHTML+="<hr /> avant boucle for <br />";    
    for(var k=0;k<=nb;k++){
       let x0,z0;
       with(Math){
        let t2=-PI/2+k/nb*PI;
        t2=t2.toPrecision(PrecisionArrondi);
        x0=R*cos(t2);
        z0=R*sin(t2);
       }
       tabP[k]= new THREE.Vector3(x0,0,z0);
    } 
    for (var k=0;k<nb;k++)
      segment(MaScene,tabP[k],tabP[k+1],couleurHexa,epai);   
}//fin fonction ArcDeCercle




 //fin des fonction pour le tp
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
  
 let nb=40;
 let dimP=0.025;
 let epaiCbe=3;
 let R=1.5;
 let a=0.75*R;
 let ch = parseInt(prompt("Choix entre 1 pour l'équateur et 2 pour un méridien ?"));
 switch (ch){
  case 1 : cercle(scene,2*nb,R,"#AA00AA",epaiCbe,true, "#000000",dimP);
           break;
  case 2 : ArcDeCercle(scene,nb,R,"#FF9900",epaiCbe,true, "#000000",dimP);
           break;
 } // fin switch 
 let sphereGeom1 = new THREE.SphereGeometry(R, 160, 60);
 let MaterialPhong = new THREE.MeshPhongMaterial({
   color: "#999900",
   opacity: 0.5,
   transparent: true,
   wireframe: false,
   emissive:0x000000,
   specular:"#00FFFF", 
   flatShading: true,
   shininess:30,//brillance
   side: THREE.DoubleSide,
 });
 // definition des primitives
 let spherePhong = new THREE.Mesh(sphereGeom1, MaterialPhong);
 spherePhong.castShadow = true;
 spherePhong.receiveShadow = true;
  // ajout des primitives dans la scene
 scene.add(spherePhong);
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
   //pb avec camera lockAt
   this.cameraxDir = 0;//camera.getWorldDirection().x;
   this.camerayDir = 0;//camera.getWorldDirection().y;
   this.camerazDir = 0;//camera.getWorldDirection().z;
   this.AffichagePhong = true;//.visible;
    
   //pour actualiser dans la scene   
   this.actualisation = function () {
    posCamera();
    reAffichage();
   }; // fin this.actualisation
 }; // fin de la fonction menuGUI
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 // ajout de spherePhong dans le menu du GUI
 let guiSpherePhong = gui.addFolder("Sphère : Phong"); 
 // mettre 'spherePhong' comme dans 'this.AffichagePhong'
 gui.add(menuGUI,'AffichagePhong').onChange(function (e) {
   if (!e) scene.remove(spherePhong);                                                                                                           else scene.add(spherePhong);
 });//fin cochage  Phong
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
   scene.remove(spherePhong);
   posCamera();
   scene.add(spherePhong);
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