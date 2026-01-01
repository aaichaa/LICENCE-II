from random import randint
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

class File:
    """Classe définissant une file à l'aide de deux piles _entree et _sortie"""

    def __init__(self):
        self._entree = Pile()
        self._sortie = Pile()

    def file_vide(self):
        """Retourne True si la file est vide"""
        return self._entree.pile_vide() and self._sortie.pile_vide()

    def enfiler(self, x):
        """Ajoute un élément x dans la file"""
        self._entree.empiler(x)

    def defiler(self):
        """Retire et retourne l'élément en tête de la file"""
        # Si la pile sortie est vide, on transfère tout depuis entrée
        if self._sortie.pile_vide():
            while not self._entree.pile_vide():
                self._sortie.empiler(self._entree.depiler())

        # Si la file est toujours vide
        if self._sortie.pile_vide():
            print("Defiler sur une file vide")

        return self._sortie.depiler()



def dist_bfs(G,som):
    pred = [-1]*len(G)
    dist = [-1]*len(G)
    dist[som] = 0
    grey = File()
    grey.enfiler(som)
    while not grey.file_vide():
        s = grey.defiler()
        for v in G[s]:
            if dist[v] == -1:
                dist[v] = dist[s] +1
                pred[v] = s
                grey.enfiler(v)
                
                
                
    return pred,dist
#G = [[4,1],[0,5,6,2],[6,3],[2,7],[5],[],[7],[6]]   
#print(dist_bfs(G,0))

def pcc_bfs2(G,s,t):
    L =[]
    
    pred,dist = dist_bfs(G,s)
    if s == t:
        return [s]

    if t >= len(G):
        print(t," n'appartient pas au graphe")
        return []
    if pred[t] == -1:
        print(s ,"ne peut pas atteindre",t)
        return []
    
    L.append(t)
    while pred[t] != s:
        L.append(pred[t])
        t = pred[t]
    L.append(pred[t])        
    return L [::-1]
G = [[4,1],[0,5,6,2],[6,3],[2,7],[5],[],[7],[6]]   
#print(pcc_bfs2(G,3,3))




  
def pcc_bfs(G,s,t):
    l =[]
    pred,dist = dist_bfs(G,s)
    l.append(t)
    if t >= len(G):
        print(t,"n'appartient pas au graphe")
        return []
    if pred[t] == -1 :
        print(s,"ne peut pas atteindre",t)
        return []
 
    while pred[t] != -1 and pred[t] != s:
        l.append(pred[t])
        t = pred[t]
    if pred[t] == s:
        l.append(s)
   
    #print (pred)
    return l[::-1]
#G = [[4,1],[0,5,6,2],[6,3],[2,7],[5],[],[7],[6]]   
#print(pcc_bfs(G,3,0))


#exercice 2
def dfs_it(G,s):
    grey = Pile()
    vus = [0]*len(G)
    grey.empiler(s)
    while not grey.pile_vide():
        x = grey.depiler()
        if vus[x] == 0:
            vus[x] = 1
        for v in G[x]:
            if vus[v] == vus[x]:
                return False
            else:
                if vus[v] == 0:
                    if vus[x] == 1:
                        vus[v] = 2
                    else:
                        vus[v] = 1
                    grey.empiler(v)
    return True,vus                    
#G=[[1],[0,2], [1,3,7], [2,4], [3,5], [4,6], [5,7], [6,2]]
#G = [[1],[0,2,5], [3,1], [2,4], [3,5], [4,1]]
#print(dfs_it(G,0))

#2 glouton
def glouton(G):
    n=len(G)
    coul = [0]*len(G)
    coul[0] = 1
    for i in range(1,n):
        for v in G[i]:
            if coul[v] != 0:
                """if coul[v] == 1:
                    coul[i] = coul[v] + 1
                else:
                    coul[i] = coul[v] - 1
            else:
                 coul[i] = coul[v] + 1"""
    return coul
#G=[[1],[0,2], [1,3,7], [2,4], [3,5], [4,6], [5,7], [6,2]]
#G=[[1],[0,2,3], [1], [1,4], [3]]
#G=[[1],[1,3], [2],[0,2]]
G=[[1], [0,2],[1,3],[2]]
#G=[[2],[0,3], [2,1], [3]] faux
#G=[[2],[3], [0,3], [2,1]] faux
print(glouton(G))