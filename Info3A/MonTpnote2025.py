from math import sqrt
from random import randint
import matplotlib.pyplot as plt

def dist(P, Q):
    x1, y1 = P
    x2, y2 = Q
    return sqrt ((x1-x2)**2 + (y1-y2)**2)
  
def trace_circuit(cir):
    for i in range(len(cir)-1):
        P1, P2 = cir[i], cir[i+1]
        plt.plot([P1[0],P2[0]],[P1[1],P2[1]], "r-") 
    plt.show()
#1)    
def plus_proche(points,P):
    dmin = dist(points[0],P)
    imin = 0
    for i in range(1,len(points)):
        if dist(points[i],P) < dist(points[0],P):
            dmin = dist(points[i],P)
            imin = i
    return imin
#2)
"""def chemin(points):
    if len(points)==1:
         return 
    else:
        
        premier = points[0]
        
        for i in range(len(points)):
            
            indproche = plus_proche(points,premier)
       
        return points[indproche],chemin(points[1:])
points = [(5,1),(17,8),(9,-7),(0,-13),(2,6)]
print(chemin(points))"""

"""def chemin(points):
    if len(points)==1:
         return [points[0]]
    else:
        
        premier = points[0]
        
        for i in range(len(points)):
            
            indproche = plus_proche(points,premier)
            #points.pop(indproche)
       
        return points.pop(indproche),chemin(points)
points = [(5,1),(17,8),(9,-7),(0,-13),(2,6)]
print(chemin(points))
"""

def chemin(points):

        premier = points.pop(0)
        lpoints = []
        lpoints.append(premier)
    
        
        #for i in range(len(points)):
        while points:    
            indproche = plus_proche(points,premier)
            premier = points.pop(indproche)
            lpoints.append(premier)
       
        return lpoints
points = [(5,1),(17,8),(9,-7),(0,-13),(2,6)]
print(chemin(points))
    
    


#3)
#a)    
def liste(n):
    pts =[]
    for i in range(n):
        x= randint(-20,20)
        y = randint(-20,20)
        pts.append((x,y))
    return pts


circuit = chemin(liste(50))
#b)
print(trace_circuit(circuit))

#exo 2
#1)
G = {'C':['M','S','L'],'M':['S','L'],'S':['C','L','M'],'L':['L','C']}

#2)
def suivant(G,x):
    for i in G[x]:
        sommet = randint(G[0],G[-1])
    
    return sommet

#3)
def parcours(G,e,n):
    liste = []
    for i in range(n):
        liste.append(suivant(G,e))
    return liste