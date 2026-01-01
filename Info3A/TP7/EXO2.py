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
    
    
def dfs_it(G, s=0):
    vus = randint(1,2)*len(G)
    grey=Pile() #pile stockant les voisins des sommets visités
    grey.empiler(s)
    while not grey.pile_vide(): #tant qu'il reste des voisins non visités
    s=grey.depiler() #nouveau voisin
    for v in G[s]:
        if vus[v] == vus[s]:
            return False
    
    """def dfs_it(G, s=0): #G : liste d'adjacence, s : source
 black=[] #stockage des sommets visités
 vus=[False]*len(G) #marquage des sommets visités
 grey=Pile() #pile stockant les voisins des sommets visités
 grey.empiler(s)
 while not grey.pile_vide(): #tant qu'il reste des voisins non visités
 s=grey.depiler() #nouveau voisin
 if not vus[s]: #si pas déjà visité
 black.append(s) #ajout à la liste des visités
 vus[s]=True
 for v in G[s]: #parcours des voisins
 if not vus[v]: #si pas déjà visité
 grey.empiler(v) #ajout à la pile
 return black"""