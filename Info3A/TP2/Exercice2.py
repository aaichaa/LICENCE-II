"""def rendu_glouton(s,P):
    i = len(P)-1
    L = [];                        # liste de (nb, piece)

    while s > 0 and i >= 0:
        if P[i] <= s:
            nb = s // P[i]         # combien de pièces de valeur P[i]
            if nb > 0:
                L.append((nb, P[i]))
                s -= nb * P[i]
        i -= 1                     # on passe à la pièce suivante (plus petite)

    if s != 0:
        print("Rendu impossible avec les pièces fournies.")
    return L
   
print (rendu_glouton(29,[1, 2, 5, 10, 20, 50, 100]))"""
    
 
def rendu_monnaie_rec(s, P):
    i = len(P)-1
    return rendu_glouton_aux(s, P, i)
 
def rendu_glouton_aux(s,P,i):
    if s <= 0 or i <0:
        return []
    elif P[i] <= s:
            nb = s // P[i]
            return [(nb,P[i])] + rendu_glouton_aux(s - nb * P[i],P,i-1)
    
    else:
        return  rendu_glouton_aux(s,P,i-1)
    
print (rendu_monnaie_rec(29,[1, 2, 5, 10, 20, 50, 100]))    
