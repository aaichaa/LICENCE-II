//parabole dans la base 1, t et t².
function trajectoireBaseCanonique(MaScene,h,v0,alpha,nb,tmin,tmax,couleurHexa,epai){
 let tabP= new Array(nb+1);  
       //document.getElementById("res").innerHTML+="<hr /> avant boucle for <br />";    
    for(let k=0;k<=nb;k++){
       let x0,y0,z0;
       with(Math){
        let t2=tmin+k/nb*(tmax-tmin);
        t2=t2.toPrecision(PrecisionArrondi);
        x0=t2*v0*Math.cos(alpha);
        y0=0;
        z0=h+t2*v0*Math.sin(alpha)-Math.pow(t2,2)/2*Math.abs(g.z);
       }
       tabP[k]= new THREE.Vector3(x0,y0,z0);
    } 
    for (let k=0;k<nb;k++)
      segment(MaScene,tabP[k],tabP[k+1],couleurHexa,epai);   
}//fin fonction trajectoire base canonique


// courbe de Bezier sur [0;1] dans la base canonique
function BezierCanonique(P0,vectP0,nb,coulCbe,epai,coulPt,dimPt){
 let tabPt = new Array(3);
 for(let k=0;k<tabPt.length;k++)
  tabPt[k] = new THREE.Vector3(0,0,0);
 tabPt[0].copy(P0);
 let vTmp = new THREE.Vector3(0,0,0);
 vTmp.addScaledVector(vectP0,0.5);
 tabPt[1].addVectors(P0,vTmp);
 let vTmp1 = new THREE.Vector3(0,0,0);
 let vTmp2 = new THREE.Vector3(0,0,0);
 vTmp1.addScaledVector(g,0.5);
 vTmp2.addVectors(vectP0,vTmp1);//alert(vectP0.z+"\n"+vTmp1.z+"\n"+vTmp2.z);
 tabPt[2].addVectors(P0,vTmp2);
 //Bez2(MaScene,nb,P0,P1,P2,coulCbe,epai);
 return tabPt;
 //let nbPts = 100;
 //TraceBezierQuadratique(P0, P1, P2, nbPts,coulCbe,epai);
}// fin fonction BezierCanonique

// courbe de Bezier jusqu'au point de contact avec le sol
function BezierAvantRebond(MaScene,P0,h,vectP0,nb,coulCbe,epai,coulPt,dimPt){
 //Q0 = P0;
 let Q1 = new THREE.Vector3(0,0,0);
 let Q2 = new THREE.Vector3(0,0,0);
 let t2a=(vectP0.z+Math.pow(Math.pow(vectP0.z,2)+2*h*Math.abs(-g.z),0.5))/Math.abs(-g.z);
 let vectQ2 = new THREE.Vector3(0,0,0);//vecteur tangent en Q2
 let ptsControleCbeQ = new Array(4);//retourne Q0, Q1, Q2 et vecteur tangent en Q2
 for(let k=0;k<ptsControleCbeQ.length;k++) ptsControleCbeQ[k] = new THREE.Vector3(0,0,0);
 let vTmp3 = new THREE.Vector3(0,0,0);
 let vTmp4 = new THREE.Vector3(0,0,0);
 let vTmp5 = new THREE.Vector3(0,0,0);
 vTmp3.addScaledVector(vectP0,t2a);
 vTmp4.addScaledVector(g,Math.pow(t2a,2)/2);
 vTmp5.addVectors(vTmp3,vTmp4);
 Q2.addVectors(P0,vTmp5);//alert("Q2 : "+Q2.x+"\n "+Q2.z);
 let P0Q2 = new THREE.Vector3(0,0,0);
 P0Q2.subVectors(Q2,P0);
 let vTmp6 = new THREE.Vector3(0,0,0); 
 let v1 = new THREE.Vector3(0,0,0);
 vTmp6.addScaledVector(g,t2a);//alert("t2a = "+t2a);
 v1.addVectors(vectP0,vTmp6);
 let num1 = det(P0Q2, v1, vecJ);
 //alert("P0Q2 : "+P0Q2.x+"\n"+P0Q2.z);
 let den1 = det(vectP0, v1, vecJ);
 let t1= num1/den1;
 //alert("t1 = "+t1+"\n v1 : "+v1.x+"\n"+v1.z);
 let vTmp7 = new THREE.Vector3(0,0,0); 
 vTmp7.addScaledVector(vectP0,t1);
 Q1.addVectors(P0,vTmp7);//alert(Q1.x+"\n "+Q1.z);
 /*Bez2(MaScene,nb,P0,Q1,Q2,coulCbe,epai);
 tracePt(MaScene,Q1,coulPt,dimPt,true);
 tracePt(MaScene,Q2,coulPt,dimPt,true);
 segment(MaScene,P0,Q1,coulCbe,epai);
 segment(MaScene,Q2,Q1,coulCbe,epai);*/
 let vTmp8 = new THREE.Vector3(0,0,0); 
 vTmp8.addScaledVector(g,t2a);
 ptsControleCbeQ[3].addVectors(vectP0,vTmp8);
 ptsControleCbeQ[2].copy(Q2);
 ptsControleCbeQ[1].copy(Q1);
 ptsControleCbeQ[0].copy(P0);
 ptsControleCbeQ[2].z=testZero(ptsControleCbeQ[2].z);
 return ptsControleCbeQ;
} //fin function BezierAvantRebond


function BezierApresRebond(MaScene,ptsControleCbeQ,nb,coulCbe,epai,coulPt,dimPt){
 //R0 = Q2;
 let R1 = new THREE.Vector3(0,0,0);
 let R2 = new THREE.Vector3(0,0,0);
 let vectR0 = new THREE.Vector3(beta*ptsControleCbeQ[3].x,0,-beta*ptsControleCbeQ[3].z);//vecteur tangent en Q2
 vecteurTan(MaScene,ptsControleCbeQ[2],vectR0,"#FF00FF",0.25, 0.125);
 let t2b=2*vectR0.dot(vecK)/Math.abs(-g.z);//alert(t2b+"\n"+vectR2.x);
 let ptsControleCbeR = new Array(4);
 for(let k=0;k<ptsControleCbeR.length;k++) ptsControleCbeR[k] = new THREE.Vector3(0,0,0);
 let vTmp3 = new THREE.Vector3(0,0,0);
 let vTmp4 = new THREE.Vector3(0,0,0);
 let vTmp5 = new THREE.Vector3(0,0,0);
 vTmp3.addScaledVector(vectR0,t2b);
 vTmp4.addScaledVector(g,Math.pow(t2b,2)/2);
 vTmp5.addVectors(vTmp3,vTmp4);
 R2.addVectors(ptsControleCbeQ[2],vTmp5);
 R2.z=testZero(R2.z);
 let I1 = new THREE.Vector3((R2.x+ptsControleCbeQ[2].x)/2,0,(R2.z+ptsControleCbeQ[2].z)/2);
 let R0I1 = ptsControleCbeQ[2].distanceTo(I1);
 let vTmp6 = new THREE.Vector3(0,0,0);
 vTmp6.addScaledVector(vecK,R0I1*vectR0.dot(vecK)/vectR0.dot(vecI));
 R1.addVectors(I1,vTmp6);
 //alert(R1.x+"; "+R1.z);
 /*tracePt(MaScene,R2,coulPt,dimPt),true;
 tracePt(MaScene,R1,coulPt,dimPt,true);
 segment(MaScene,ptsControleCbeQ[2],R1,"#FF6666",epai);
 segment(MaScene,R2,R1,"#FF6666",epai);
 Bez2(MaScene,nb,ptsControleCbeQ[2],R1,R2,coulCbe,epai);*/
 let vTmp8 = new THREE.Vector3(0,0,0); 
 vTmp8.addScaledVector(g,t2b); 
 ptsControleCbeR[3].addVectors(vectR0,vTmp8);
 ptsControleCbeR[2].copy(R2);
 ptsControleCbeR[1].copy(R1);
 ptsControleCbeR[0].copy(ptsControleCbeQ[2]);
 ptsControleCbeR[2].z=testZero(ptsControleCbeR[2].z);
 return ptsControleCbeR;
} //fin function BezierApresRebond