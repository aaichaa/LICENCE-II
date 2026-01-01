'''
Info3A
TP6
correction partielle
'''
class Arbre:
    """arbre défini à partir de la _valeur de sa racine, 
    de son fils gauche et de son fils droit"""

    def __init__(self):
        self._valeur = None
        self._gauche = None
        self._droit = None
        
    def est_vide(self):
        return self._valeur==None and self._droit==None and self._gauche==None

  #place un élément dans l'arbre
    def place(self, e):
        if self.est_vide():
              self._valeur=e
              self._gauche=Arbre()
              self._droit=Arbre()
        else:
          if e<self._valeur:
             self._gauche.place(e)
          if e>self._valeur:
             self._droit.place(e)
            
    #2 retourne une copie en profondeur de l'instance courante  
    def copie(self):
        if self.est_vide():
            return Arbre()
        else:
            A=Arbre()
            A._gauche=self._gauche.copie()
            A._valeur=self._valeur
            A._droit=self._droit.copie()
            return A
        
    #6 restitue sa hauteur (nombre de niveaux)
    def hauteur(self):
        #un arbre réduit à une feuille a pour hauteur 0
        if self.est_vide() or self.est_feuille():
            return 0
        else:
            return 1 + max(self._gauche.hauteur(), self._droit.hauteur())


    #7 indique si l'arbre est équilibré
    # pour chaque noeud, les hauteurs des deux sous-arbres diffèrent au plus de 1
    def est_equilibre(self):
        if not self.est_vide():
            return abs(self._gauche.hauteur() - self._droit.hauteur()) <= 1 and self._gauche.est_equilibre() and self._droit.est_equilibre()
        return True
    
    #12 ajoute un arbre à l'instance courante
    def ajoute(self, A):
        if not A.est_vide():
            self.ajoute(A._gauche)
            self.place(A._valeur)
            self.ajoute(A._droit)
    
    #13 parcours en largeur d'un arbre, en affichant les noeuds
    #parcourus, avec leurs profondeurs (distances à la racine)
    #Parcourt les noeuds strate par strate
    def parcours_largeur(self):
        f = File()
        f.enfiler((self, 0))
        while not f.file_vide():
            arbre, profondeur = f.defiler()
            if  not arbre.est_vide():
                print(arbre._valeur, profondeur)
                f.enfiler((arbre._gauche, profondeur + 1))
                f.enfiler((arbre._droit, profondeur + 1))
            
######################################################################
"""
Info3A
TP7
correction partielle
"""
#2.2 coloration gloutonne
def color_glout(G):
    coul=[0]*len(G) #couleur de chaque sommet
    nc=1 #nb de couleurs
    for s in range(len(G)): #pour chaque sommet s
        c=1
        while c<=nc and coul[s]==0: #tant qu'on n'a pas épuisé les couleurs disponibles
                                    # et qu'on n'a pas attribué de couleur à s
            ok=True
            for v in G[s]: #un voisin de s a-t-il la couleur c ?
                if coul[v]==c:
                    ok=False
            if ok: #si non, s prend la couleur c
                coul[s]=c
            else: #si oui, on essaie la couleur suivante
                c+=1
        if coul[s]==0: #si on n'a pas pu donner de couleur à s
            nc+=1
            coul[s]=nc #on lui donne une nouvelle couleur
    return coul

print(color_glout(G)) #[1, 2, 1, 2, 1, 2, 1, 2]
# print(color_glout(G1)) #[1, 2, 1, 2, 1, 3]


#2.3 liste cours ordre croissant -> liste d'adjacence du graphe d'incompatibilités
def list2graphe(L):
    l=len(L)
    G=[[] for i in range(l)]
    for i in range(l-1):
        for j in range(i+1,l):
            if L[i][1]>L[j][0]: #si les cours n°i et n°j se  chevauchent
                G[i].append(j) #cours n° i incompatible avec cours n° j
                G[j].append(i) #cours n° j incompatible avec cours n° i
    return G
            
L = [[13,15], [14,17], [15,20], [17,18.5], [18.5,19]]
# G = list2graphe(L)
#graphe des incompatibilités des intervalles de temps
# print(G) #[[1], [0,2], [1,3,4], [2], [2]]
# print(color_glout(G)) #[1, 2, 1, 2, 2] #2 couleurs -> 2 salles

#Remarque
#Dans l'exemple du CM, l'algo glouton est optimal si les intervalles sont
#triés par heures de fin croissantes.
#Ici l'algo glouton est optimal si les intervalles sont triés par heures de début croissantes

######################################################################
"""
Info3A
TP8
correction partielle
"""
import turtle as t
t.speed(0) #vitesse la plus rapide
#2 arbre
def arbre1(c,a):
    t.forward(c/3)
    t.left(a)
    t.forward(c/3*2)
    t.backward(c/3*2)
    t.right(2*a)
    t.forward(c/3*2)
    t.backward(c/3*2)
    t.left(a)
    t.backward(c/3)

#pour voir comment faire les appels récursifs
def arbre2(c,a):
    t.forward(c/3)
    t.left(a)
    
    t.forward(c/3/3*2)
    t.left(a)
    t.forward(c/3*2/3*2)
    t.backward(c/3*2/3*2)
    t.right(2*a)
    t.forward(c/3*2/3*2)
    t.backward(c/3*2/3*2)
    t.left(a)
    t.backward(c/3/3*2)

    t.right(2*a)
    
    t.forward(c/3/3*2)
    t.left(a)
    t.forward(c/3*2/3*2)
    t.backward(c/3*2/3*2)
    t.right(2*a)
    t.forward(c/3*2/3*2)
    t.backward(c/3*2/3*2)
    t.left(a)
    t.backward(c/3/3*2)
    
    t.left(a)
    t.backward(c/3)
    
#avec appels à arbre1
def arbre22(c,a):
    t.forward(c/3)
    t.left(a)
    
    arbre1(c*2/3, a)

    t.right(2*a)
    
    arbre1(c*2/3, a)
    
    t.left(a)
    t.backward(c/3)

def arbre(c,a,n):
    if n == 0:
        t.pencolor("red") #pour avoir des feuilles rouges
        t.forward(c)
        t.backward(c)
        t.pencolor("black")
    else :
        t.pensize(n)   #branches de plus en plus fines du tronc vers les feuilles
        t.forward(c/3)
        t.left(a)
        arbre(c*2/3,a,n-1)
        t.right(2*a)
        arbre(c*2/3,a,n-1)
        t.left(a)
        t.backward(c/3)

# t.left(90)
# arbre1(200,30)
# arbre2(200,30)
# arbre22(200,30)
# arbre(400,30,11)


# 3 sierpinski
def gen_sierpinski(c) :
#     t.left(60)
    t.right(-60)
    t.forward(c/2)
    t.right(60)
    t.forward(c/2)
    t.right(60)
    t.forward(c/2)
#     t.left(60)
    t.right(-60)

# gen_sierpinski(300)

#pour "voir" les appels récursifs
def c2_sierpinski(c) :
    t.right(-60)
    
    t.right(60)
    t.forward(c/4)
    t.right(-60)
    t.forward(c/4)
    t.right(-60)
    t.forward(c/4)
    t.right(60)
    
    t.right(60)
    
    t.right(-60)
    t.forward(c/4)
    t.right(60)
    t.forward(c/4)
    t.right(60)
    t.forward(c/4)
    t.right(-60)
    
    t.right(60)

    t.right(60)
    t.forward(c/4)
    t.right(-60)
    t.forward(c/4)
    t.right(-60)
    t.forward(c/4)
    t.right(60)
    
    t.right(-60)
    
# c2_sierpinski(300)

#avec paramètre signe
def courbe_sierpinski(c,n,signe=1):
    if (n == 0) :
        t.forward(c)
    else :
        t.right(-60 * signe)
        courbe_sierpinski(c/2, n-1, -signe)
        t.right(60 * signe)
        courbe_sierpinski(c/2, n-1, signe)
        t.right(60 * signe)
        courbe_sierpinski(c/2, n-1, -signe)
        t.right(-60 * signe)

#avec paramètre angle
def courbe_sierpinski2(c,n,angle=60):
    if (n == 0) :
        t.forward(c)
    else :
        t.right(-angle)
        courbe_sierpinski2(c/2, n-1, -angle)
        t.right(angle)
        courbe_sierpinski2(c/2, n-1, angle)
        t.right(angle)
        courbe_sierpinski2(c/2, n-1, -angle)
        t.right(-angle)
        
# courbe_sierpinski(300,7)
# courbe_sierpinski2(300,7)

##########################################################
"""
Info3A
TP9
correction partielle
"""
import matplotlib.pyplot as plt
from random import random, randrange, uniform, randint
from math import *

#4 genere et trace n points dans le carre c x c d'origine (0,0)
#retourne une estimation de l'aire du polygone pol
def aire(pol,n,c):
    k=0.0
    for i in range(n):
        x=uniform(0,c)
        y=uniform(0,c)
        if dedans((x,y),pol):
            plt.plot([x],[y],"bo") #points bleus dedans
            k+=1
        else:
            plt.plot([x],[y],"ro") #points rouges dehors
    print("Estimation de l'aire : ", (c*c*k/n))

carre = [(100,100), (100,400), (400,400), (400,100)]
# plt.figure()
# aire(carre,10000,600)
# plt.show()


#5
"""
Calcul de pi avec les aiguilles de Buffon
lattes verticales
nb_essais = nombre de fois où l'expérience est répétée
n = nombre de fois où l'aiguille est lancée
a = longueur de l'aiguille
l = distance entre 2 lattes
theta = angle formée par l'aiguille et l'horizontale 
x = abscise du milieu de l'aiguille sur le sol
"""
def buffon(nb_essais,n,a,l):
    moy=0
    for i in range(nb_essais):
        cpt = 0
        for j in range(n):
            #positions possibles du centre de l'aiguille : [0,l/2]
            x = uniform(0,l/2) 
            #angles possibles formés avec l'horizontale [0,pi/2]
            theta = uniform(0,pi/2) 
            #si x est plus petit que la composante horizontale de la moitié gauche de l'aiguille
            #l'aiguille dépasse de la latte à gauche
            if x <= a/2*cos(theta):  
                cpt += 1
        p=cpt/n
        approx_pi = 2*a/(p*l)
        moy+=approx_pi
    return moy/nb_essais

#1000 essais avec 5000 aiguilles de longueur 1 et des lattes espacées de 1
# print(buffon(1000,5000,1,1)) 


#6 Trouve 1 solution au probleme des reines
def prise2(reines,i,j):
    #on ne teste ici que la position des reines en diagonale
    #deux reines sont sur la meme diagonale si la pente vaut 1 ou -1
    return abs(reines[j]-reines[i]) == abs(j-i)

#idem position_valide du CM, mais utilise prise2
def position_valide2(reines,k):
    ok = True
    i=0
    while ok and i<k-1 :
        j = i+1
        while ok and j<=k-1 :
            ok = not prise2(reines,i,j)
            j += 1
        i += 1
    return ok

def echanger(reines):
    n=len(reines)
    a=randint(0,n-1) 
    b=randint(0,n-1)
    while b==a:
        b=randint(0,n-1)
    reines[a], reines[b] = reines[b], reines[a]

def une_solution(n=8): # n : nombre de reines
    reines = list(range(n))  # position des reines dans les n colonnes
    nb_echanges = 0
    while not position_valide2(reines,n):
        echanger(reines)
        nb_echanges += 1
    print(reines)
    print(nb_echanges,"echanges")

# une_solution()