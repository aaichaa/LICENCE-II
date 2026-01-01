"""def tri_comptage(A): #trie la liste A
    k=max(A) #détermination de la longueur de C
    C=[0]*(k+1) #initialisation de C
    for i in range(len(A)): #pour chaque valeur rencontrée dans A, onincrémente le compteur correspondant dans C

         C[A[i]]+=1
    p=0 #indice pour remplir la liste A
    for i in range(k+1): #parcours de C
        for _ in range(C[i]): #on écrit C[i] fois la valeur i dans A
            A[p]=i
            p+=1 #
    return A        
A = [0,1,0,1,0,1,1,1,0]       
print(tri_comptage(A)) 

def ajoute(G, a):
    s1 = a[0]
    s2 = a[1]

    # si un sommet n'existe pas, on ne modifie pas
    if s1 not in G or s2 not in G:
        return

    # graphe non orienté : ajouter dans les 2 sens (sans doublon)
    if s2 not in G[s1]:
        G[s1].append(s2)
    if s1 not in G[s2]:
        G[s2].append(s1)
G = {
  0: [1, 4],
  1: [0, 5],
  2: [3],
  3: [2],
  4: [0, 5],
  5: [1, 4]
}

ajoute(G, [0, 3])
print(G)
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
    def copier_pile(self):
        p2 = Pile()
        p  = Pile()

        # On vide self dans p et p2
        while not self.pile_vide():
            x = self.depiler()
            p.empiler(x)
            p2.empiler(x)

        # On restaure self depuis p
        while not p.pile_vide():
            self.empiler(p.depiler())

        # On remet p2 dans le bon sens
        p2 = p2.inverser_pile()
        return p2
class File:
    def __init__(self):
        self.data = []

    def enfiler(self, x):
        self.data.append(x)      # ajoute à la fin

    def defiler(self):
        return self.data.pop(0)  # enlève au début

    def file_vide(self):
        return self.data == []
    
def cycle_bfs(G, s0):
    dist = [-1] * len(G)
    parent = [None] * len(G)

    grey = File()
    grey.enfiler(s0)
    dist[s0] = 0
    #parent[s0] = -1   # pas de parent pour la source

    while not grey.file_vide():
        x = grey.defiler()

        for v in G[x]:
            if dist[v] == -1:
                dist[v] = dist[x] + 1
                #parent[v] = x
                grey.enfiler(v)
            
            else:
                if dist[v] != -1 and dist[v] >= dist[x] and parent[x] != v:
                    return True


    return False
G = {0: [1, 4, 3], 1: [0, 5], 2: [3], 3: [2, 0], 4: [0, 5], 5: [1, 4]}
print(cycle_bfs(G,0))