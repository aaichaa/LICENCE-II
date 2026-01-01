function init(){
    // creation de la scene contenant tous les elements.
    var scene = new THREE.Scene();

    // creation de la camera
    var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    // axe des cote vertical
    camera.up = new THREE.Vector3( 0, 0, 1 );
    // position de la camera
    camera.position.set(3.5,2.5,1.25);
    camera.lookAt(scene.position);
//*************************************************************
//* 
//        F I N     C A M E R A
//
//*************************************************************

    // creation de rendu et de la taille
    var rendu = new THREE.WebGLRenderer();
    rendu.shadowMap.enabled = true;
    rendu.setClearColor(new THREE.Color(0xFFFFFF));
    rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);


    // affichage des axes
   // var axes = new THREE.AxesHelper(1);    
    //scene.add(axes);
    repere(scene)

    // ajoute le rendu dans l'element HTML
    document.getElementById("webgl").appendChild(rendu.domElement);
   
    // affichage de la scene
    rendu.render(scene, camera);
}
