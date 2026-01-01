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



def dist_bfs(G,s):
    pred = [-1]*len(G)
    dist = [-1]*len(G)
    dist[s] = 0
    grey = File()
    grey.enfiler(s)
    while not grey.file_vide():
        s = grey.defiler()
        for v in G[s]:
            if dist[v] == -1:
                dist[v] = dist[s] +1
                pred[v] = s
                grey.enfiler(v)
                
                
                
    return pred,dist
G = [[4,1],[0,5,6,2],[6,3],[2,7],[5],[],[7],[6]]   
print(dist_bfs(G,0))  
  
def pcc_bfs(G,s,t):
    l =[]
    pred,dist = dist_bfs(G,s)
    l.append(t)
    if t >= len(G):
        print(t,"n'appartient pas au graphe")
        return []
    if pred[t] == -1 :
        print(t,"ne peut pas atteindre",s)
        return []
 
    while pred[t] != -1 and pred[t] != s:
        l.append(pred[t])
        t = pred[t]
    if pred[t] == s:
        l.append(s)
   
    #print (pred)
    return l[::-1]
G = [[4,1],[0,5,6,2],[6,3],[2,7],[5],[],[7],[6]]   
print(pcc_bfs(G,3,0))



   