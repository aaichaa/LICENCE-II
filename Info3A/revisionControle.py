from math import *
from random import*
from Pile import*
"""def triangle(a,b):
    for a in range(1,101):
        for b in range(a,101):
            carre = a * a + b * b
            c = int(sqrt(carre))
            if c * c == carre and c > b and c <= 100:
                print(a,b,c)
triangle(5,5)
EXO2
def somme(n):
    c = str(n)
    s = 0
    for i in range(len(c)):
        s+= int(c[i])
        
    return s
print(somme(321))
#EXO3
def fibo(n):
    if n == 0 or n == 1:
        return n
    else:
        a = 0
        b = 1
        s = [0,1]
    for i in range(2,n):
        c = a + b
        a,b  = b,c
        s.append(b)
    return s
print(fibo(5))
#Exo 4
def suivant(s):
    cpt = 1
    c = ""
    for i in range(1,len(s)+1):
        if i < len(s) and s[i] == s[i-1]:
            cpt+=1
        else:
            c+= str(cpt) + s[i-1]
            cpt=1
    return c            
        
def conway(n):
    L= [1]
    c = suivant("1")
    L.append(c)
    for i in range(2,n):
      c = suivant(c)
      L.append(c)
    return L        
print(conway(16))
#print(suivant("1211"))"""

#Exo 5"""
"""def init_mat(m,n):
    cpt = 0; M=[]
    for i in range(m):
        L=[]
        for j in range(n):
            L.append(cpt)
            cpt+=1
        M.append(L)    
    return M            
#print(init_mat(3,4))
def init_mat_alea1(m,n,sup):
     M=[]
     for i in range(m):
        L=[]
        for j in range(n):
            L.append(randint(0,sup))
            
        M.append(L)    
     return M
print(init_mat_alea1(3,4,20))

def init_mat_alea2(m,n,sup):
     T = [[0]*n for j in range(m)]
     for i in range(m):
        L=[]
        for j in range(n):
            T[i][j] = randint(0,sup)
            
            
     return T
print(init_mat_alea2(3,4,20))

#def affiche_mat(T):
def somme(T):
    s=0
    for i in range(len(T)):
        for j in range(len(T[0])):
            s+=T[i][j]
    return s
T = init_mat_alea2(3,4,20)
print(somme(T))


def pos_min(T):
    im, jm = 0, 0
    for i in range(len(T)):
        for j in range(len(T[0])):
            if T[i][j] < T[im][jm]:
                im, jm = i, j
    return im, jm  # bien à gauche, après les deux boucles

print(pos_min(T))

"""


#TP2
""" 
      
        
    
    
def reines_rec_aux(reines,n,k):
    
    
    
def reines_rec(n):
    [[0]*n for i in range(n)]
    
def pos_valide(r,k):
#initialisations
    ok, i = True, 0
#parcours des colonnes [0:k-2] pour reine1
    while ok and i<k-1:
#parcours des colonnes [i+1:k-1] pour reine2
        j=i+1
        while ok and j<k:
#test de validité de la position des reines
            ok = not en_prise(r,i,j)
            j += 1
        i += 1
    return ok    
    
    
  """  
    
"""
def rendu_monaie(s,P):
    
    L =[]
    i = len(P)-1
    while  s > 0:
        if P[i] <= s:
            L.append(P[i])
            s = s - P[i]
        else:
             i -= 1
    return L    
L = [1,2,10,20,50]    
print(rendu_monaie(63,L))

def aux(s, P, i):
    if s == 0:
        return []
    if i < 0:
        return None
    if P[i] <= s:
        rest = aux(s - P[i], P, i)
        if rest is None:
            return None
        return [P[i]] + rest
    return aux(s, P, i - 1)
"""
"""def aux(s, P, i):
    if s == 0:
        return []
    if i < 0:
        return None
    if P[i] <= s:
         return [P[i]] + aux(s - P[i], P, i)
    else:    
        return aux(s, P, i - 1)
def rendu_monnaie_rec(s, P):
    return aux(s, P, len(P)-1)
   
P = [1,2,10,20,50]
print(rendu_monnaie_rec(63,P))    
    
def rendu_glouton(s,P):
    compt = 1
    L = []
    while s >0:
        if P[i] >= s:
            
   
def rendu_monaie(s,P):
    cpt =1
    L =[]
    Q = []
    i = len(P)-1
    while  s > 0:
        if P[i] <= s:
            L.append(P[i])
            s = s - P[i]
        else:
             i -= 1
    for i in range (len(L)-1):
        if L[i] == L[i+1]:
            cpt += 1
            Q.append((cpt,L[i]))
        else:
            Q.append((cpt,L[i]))
            cpt = 1    
    return Q    
L = [1, 2, 5, 10, 20, 50, 100]   
print(rendu_monaie(29,L))       
     
  
   """
class Pile:
    def __init__(self):
        self._contenu = []
    def pile_vide(self):
        return self._contenu == []
    def empiler(self,x):
        self._contenu.append(x)
    def sommet(self):
        return self._contenu[-1]
    def depiler(self):
        return self._contenu.pop()
    def inverser_pile(self):
        Q = Pile()
        while not self.pile_vide():
            Q.empiler(self.depiler())
        return Q

def fusion(self,P):
    P1 = Pile()
    m=P.inverser_pile()
    n=self.inverser_pile()
    while not m.pile_vide() and not n.pile_vide():
        if m.sommet()>=n.sommet():
            P1.empiler(m.depiler())
            
        else:
            P1.empiler(n.depiler())
            
    while not m.pile_vide():
          P1.empiler(m.depiler())
          
    while not n.pile_vide():
          P1.empiler(n.depiler())
          
    return P1
P1 = Pile()
P1.empiler(13)
P1.empiler(11)
P1.empiler(5)
P1.empiler(3)
P1.empiler(1)
P2 = Pile()
P2.empiler(8)
P2.empiler(6)
P2.empiler(4)
P2.empiler(2)
P2.empiler(0)
"""print(P2._contenu)
o1=P2.inverser_pile()
print(o1._contenu)
print(P1._contenu)
o=P1.inverser_pile()
print(o._contenu)"""
M=fusion(P1,P2)

print(M._contenu)
"""
def melanger(P1,P2):
    P3 = Pile()
    while not P1.pile_vide() and not P2.pile_vide():
        x = randint(1,2)
        if x == 1:
            P3.empiler(P1.depiler())
        else:
            P3.empiler(P2.depiler())
    if P1.pile_vide():
       while not P2.pile_vide():
          P3.empiler(P2.depiler()) 
    else:
        P3.empiler(P1.depiler())
        
    return P3    
#P3 = melanger([1,3,5,11,13],[0,2,4,6,8])

P1 = Pile()
P1.empiler(13)
P1.empiler(11)
P1.empiler(5)
P1.empiler(3)
P1.empiler(1)
P2 = Pile()
P2.empiler(8)
P2.empiler(6)
P2.empiler(4)
P2.empiler(2)
P2.empiler(0)
print(melanger(P1,P2))    
    
"""    
#cc 2022

    