"""def plssc(s, t):
    def rec(i, j):
        # i = longueur considérée dans s, j = longueur considérée dans t
        if i == 0 or j == 0:
            return 0
        if s[i-1] == t[j-1]:
            return 1 + rec(i-1, j-1)
        return max(rec(i-1, j), rec(i, j-1))

    return rec(len(s), len(t))



print(plssc('abcde','bice'))"""


"""def graphe(G):
    L=[]
    M = []
    for i in range(len(G)):
        for S in G:
           if S in G[i]:
                M.append[i]
        L.append(M)
        M = []
    return L""" # marche pas
L = []
M = []
def graphe(G):
    
    for i in range(len(G)):          # sommet i du graphe transposé
       
        for s in range(len(G)):      # sommet s du graphe original
            if i in G[s]:            # s -> i dans G
                M.append(s)
        L.append(M)
        M = []
    return L

print(graphe(G = [
    [1, 4],        # 0
    [0, 2, 5, 6],  # 1
    [3, 6],        # 2
    [2, 7],        # 3
    [5],           # 4
    [],            # 5
    [7],           # 6
    [6]            # 7
]
))