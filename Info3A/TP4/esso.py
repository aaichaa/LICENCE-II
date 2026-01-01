def glouton(L,m):
    s = []
    prix =0
    somme = 0
    L.sort(key = lambda x: x[0],reverse = True)
    for I in L :
        if I[1] <= m:
          s.append(I)
          m = m -I[1]
          prix += I[0]*I[1]
          somme += I[1]
    return s,prix,somme

print(glouton([(100,40),(700,15),(500,2),(400,9),(300,18),(200,2)],11))
    
    
 
 
     