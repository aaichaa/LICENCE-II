const borneVue=10;//amplitude de deplacement de la camera
const borneSphere=3;//amplitude de deplacement de la sphere

function PtsCourbePara(ch,R,nb){
  let points = new Array(nb+1);
  switch (ch){
   case 1 : // cercle
             for(var k=0;k<=nb;k++){
             let t2=k/nb*2*Math.PI; 
             t2=t2.toPrecision(PrecisionArrondi);
             let x0=R*Math.cos(t2);
             let y0=R*Math.sin(t2);    
             points[k] = new THREE.Vector3(x0,y0,0);
            }
            break;
   case 2 : // arc de cercle 
            for(var k=0;k<=nb;k++){
             let t2=-Math.PI/2+k/nb*Math.PI; 
             t2=t2.toPrecision(PrecisionArrondi);
             let x0=R*Math.cos(t2);
             let z0=R*Math.sin(t2);    
             points[k] = new THREE.Vector3(x0,0,z0);
            }
            break;
   case 3 :// Tennis
            let a = 0.75 * R; 
            let b = R-a;
            for(var k=0;k<=nb;k++){
             let t2=k/nb*2*Math.PI; 
             t2=t2.toPrecision(PrecisionArrondi);
             let x0,y0,z0;
             with(Math){
              x0=a*cos(t2)+b*cos(3.*t2);
              y0=a*sin(t2)-b*sin(3.*t2);
              z0=2.*sqrt(a*b)*sin(2.*t2);
             }
             points[k] = new THREE.Vector3(x0,y0,z0);
            }
            break;
   case 4 ://Clelie1
            let n = 3;
            for(var k=0;k<=nb;k++){
              let t2=Math.PI*n*(-0.5+k/nb);
              t2=t2.toPrecision(PrecisionArrondi);
              let x0,y0,z0;
              with(Math){
                x0=R*cos(t2/n)*cos(t2);
                y0=R*cos(t2/n)*sin(t2);
                z0=R*sin(t2/n);
              }
              points[k] = new THREE.Vector3(x0,y0,z0);
            }
            break;
  } // fin switch
 let PtsCbePara = new THREE.BufferGeometry().setFromPoints(points);
 return PtsCbePara;
}// fin PtsCourbePara


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
  
 let nb=40,nbT=150;
 let dimP=0.025;
 let epaiCbe=3;
 let R=1.5;
 let a=0.75*R;
 let ch = 1;
 let PtsTab = PtsCourbePara(ch,R,nb);
 let ProprieteCbe = new THREE.LineBasicMaterial( { 
  color:"#FF0000",
  linewidth:epaiCbe   
 } );
 document.getElementById('result').innerHTML+="<br />"+ProprieteCbe.color.getStyle()+"<hr />";
 let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
 scene.add(courbePara);
 let sphereGeom1 = new THREE.SphereGeometry(R, 160, 60);
 // definition des primitives
 let MaterialPhong = new THREE.MeshPhongMaterial({
   color: "#999900",
   opacity: 1,
   transparent: true,
   wireframe: false,
   emissive:0x000000,
   specular:"#00FFFF", 
   flatShading: true,
   shininess:30,//brillance
   side: THREE.DoubleSide,//2
 //  side: THREE.FrontSide,//0
   //side: THREE.BackSide,//1
 });
 let spherePhong = new THREE.Mesh(sphereGeom1,MaterialPhong);
  // ajout des primitives dans la scene
 scene.add(spherePhong);
 // partie GUI
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
   this.cameraFar = 100; //distance du plan le plus loin
   this.cameraNear = 0.1; //distance du plan le plus proche
   this.cameraFov = 90;// angle de vision de 90°
   this.choixCbe=1;
   this.NbrePts=nb;
   this.CouleurCourbe = ProprieteCbe.color.getStyle();
   this.Epaisseur = ProprieteCbe.linewidth;
   this.AffichagePhong = true;//.visible;
   this.spherePhongPosX = spherePhong.position.x;
   this.spherePhongPosY = spherePhong.position.y;
   this.spherePhongPosZ = spherePhong.position.z;
   this.CouleurPhong = MaterialPhong.color.getStyle();
   this.opacitePhong = MaterialPhong.opacity;
   this.emissivePhong = MaterialPhong.emissive.getHex();
   this.specularPhong = MaterialPhong.specular.getStyle();
   this.brillancePhong = MaterialPhong.shininess;
   if (MaterialPhong.flatShading)
    this.lissage = 'Oui';
    else this.lissage = 'Non';
   if (MaterialPhong.wireframe)
    this.FilDeFer = 'Oui';
    else this.FilDeFer = 'Non';
   switch (MaterialPhong.side){
    case 1 : this.faces = 'Avant'; break;
    case 0 : this.faces = 'Arriere'; break;
    case 2 : this.faces = 'DeuxFaces';
   }
   //this.faces = MaterialPhong.side;
    
   //pour actualiser dans la scene   
   this.actualisation = function () {
    posCamera();
    reAffichage();
   }; // fin this.actualisation
 }; // fin de la fonction menuGUI
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 // ajout du choix de la courbe
 // ne pas oublier de definir this.choixCbe
 let guiChoixCbe = gui.addFolder("Propriété des courbes");
 guiChoixCbe.add(menuGUI,"choixCbe",[1,2,3,4]).onChange(function () {
    ch = parseInt(menuGUI.choixCbe);
    PtsTab = PtsCourbePara(ch,R,nb);
    if (courbePara) scene.remove(courbePara);
    courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    scene.add(courbePara);
  }); //NbrePts
// 
 guiChoixCbe.add(menuGUI,"NbrePts",10,1000).onChange(function () {
    nb = Math.ceil(menuGUI.NbrePts);
    PtsTab = PtsCourbePara(ch,R,nb);
    if (courbePara) scene.remove(courbePara);
    courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    scene.add(courbePara);
  });  
 guiChoixCbe.add(menuGUI,"Epaisseur",3,10).onChange(function () {
    menuGUI.Epaisseur= Math.ceil(menuGUI.Epaisseur);
    ProprieteCbe.linewidth = Math.ceil(menuGUI.Epaisseur);
  });  
 guiChoixCbe.addColor(menuGUI,"CouleurCourbe").onChange(function (e) {
    ProprieteCbe.color.setStyle(e);
    document.getElementById("result").innerHTML+="<br /> material.color.setStyle(e) : "+ProprieteCbe.color.getStyle();
  }); 
 // ajout de spherePhong dans le menu du GUI
 let guiSpherePhong = gui.addFolder("Sphère : Phong"); 
 // mettre 'spherePhong' comme dans 'this.AffichagePhong'
 gui.add(menuGUI,'AffichagePhong').onChange(function (e) {
   if (!e) scene.remove(spherePhong);                                                                                                           else scene.add(spherePhong);
 });//fin cochage  Phong
 
 //FilDeFer
 guiSpherePhong.add(menuGUI,'FilDeFer',['Oui','Non']).onChange(function (e) {
   if (e=='Oui') 
    MaterialPhong.wireframe = true;
    else MaterialPhong.wireframe = false;  
    });        
 guiSpherePhong.addColor(menuGUI,'CouleurPhong').onChange(function (e) {
  MaterialPhong.color.setStyle(e);
    });
 //emissivite
 guiSpherePhong.addColor(menuGUI,'emissivePhong').onChange(function (e) {
  MaterialPhong.emissive= new THREE.Color(e);
    });
 //specularPhong
 guiSpherePhong.addColor(menuGUI,'specularPhong').onChange(function (e) {
  MaterialPhong.specular= new THREE.Color(e);
    });
 //brillance
 guiSpherePhong.add(menuGUI,'brillancePhong',0,200).onChange(function (e) {
  MaterialPhong.shininess = e;
    });
 //lissage = MaterialPhong.flatShading;
 guiSpherePhong.add(menuGUI,'lissage',['Oui','Non']).onChange(function (e) {
   if (e=='Oui') 
    MaterialPhong.flatShading = true;
    else MaterialPhong.flatShading = false; 
    });
 //opacity
 guiSpherePhong.add(menuGUI,'opacitePhong',0,1).onChange(function (e) {
  MaterialPhong.opacity=e;
    }); 
 guiSpherePhong.add(menuGUI,'faces',['Avant','Arriere','DeuxFaces']).onChange(function (e) {
  if (e=='Avant') 
   MaterialPhong.side=1;
   else if (e=='Arriere') 
     MaterialPhong.side=0;
     else MaterialPhong.side=2;
    }); 
 guiSpherePhong.add(menuGUI,'opacitePhong',0,1).onChange(function (e) {
  MaterialPhong.opacity=e;
    }); 
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
   if (courbePara) scene.remove(courbePara);
   posCamera();
   scene.add(spherePhong);
   courbePara = new THREE.Line( PtsTab, ProprieteCbe );
   scene.add(courbePara);
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