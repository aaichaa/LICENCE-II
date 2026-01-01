def rendu_monnaie_aux(s, P, i):
   
    if s <= 0:
        return []                 

   
    elif s >= P[i]:
        
        return [P[i]] + rendu_monnaie_aux(s - P[i], P, i)
    else:
       
        return rendu_monnaie_aux(s, P, i - 1)


def rendu_monnaie_rec(s, P):
    i = len(P)-1
    return rendu_monnaie_aux(s, P, i)


P =[1, 2, 5, 10]
print(rendu_monnaie_rec(13, P))   
