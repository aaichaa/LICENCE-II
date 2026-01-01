#Nombre d'inversions d'une liste

#1 méthode naïve, O(n^2)
"""def nb_inv(L):
    n = len(L)
    cpt=0
    for i in range(n-1):
        for j in range(i+1,n):
            if L[i] > L[j]:
                cpt+=1
    return cpt"""

#2a
#version demandée, complexité linéaire
def nb_inv_trie(L1, L2):
    i, j, cpt = 0, 0, 0
    n1, n2 = len(L1), len(L2)
    while i < n1 and j < n2:
        #si L1[i] > L2[j], on incrémente le nombre d'inversions et on avance dans L2
        if L1[i] > L2[j]: #dans ce cas, L1[k]>L2[k] pour tout i<k<=n1
            cpt += n1-i
#             print("L1[",i,"]>L2[",j,"]", "+",n1-i)
            j += 1
        else: #sinon, on avance dans L1
            i += 1
    return cpt
            
# print(nb_inv_trie_pas_efficace([6,9,11,13,15],[7,12,14]))
# print(nb_inv_trie([6,9,11,13,15],[7,12,14]))

#2b


def nb_inv_rec(L):
    n = len(L)
    #cas de base
    if n <= 1:
        return 0
    #cas général:
    else:
        #Séparer la liste en deux listes de tailles égales (à une unité près)
        m = n//2
        L1 = L[:m]
        L2 = L[m:]
        #faire des appels récursifs sur chacune de ces listes
        nb_inv1 = nb_inv_rec(L1)
        nb_inv2 = nb_inv_rec(L2)
        #trier les deux listes
        L1.sort()
        L2.sort()
        #ajouter au nombre d'inversions précédemment comptées le nombre renvoyé par la
        #fonction nb_inv_trie avec pour arguments ces deux listes triées
        return nb_inv1 + nb_inv2 + nb_inv_trie(L1, L2)
    
    #verifie si on enleve ces deux la ce que ca fait et comprendre surtout nb_inv1 + nb_inv2

L = [5, 1, 8, 3, 18, 2, 22, 9]
# print(nb_inv(L))
print(nb_inv_rec(L))
# L=[6,9,11,13,15,7,12,14]
# print(nb_inv(L))
# print(nb_inv_rec(L))