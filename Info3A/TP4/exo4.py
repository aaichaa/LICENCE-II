def maximun(L,k):
    #max = L[k]
    indice = k
    for i in range(k,len(L)):
        #if L[i] > max:
        if L[i] > L[indice]:
            #max = L[i]
            indice = i
    return indice
#L = [4, 9, 2, 7, 5]
#print(maximun(L,2))

def retourne(L,k):
    
    m = (len(L) - k)//2
    for i in range(m):
        L[k+i],L[len(L)-1-i]=L[len(L)-1-i],L[k+i]
            
    return L        
#L = [1, 2, 3, 4, 5, 6]
            
#h = retourne(L,2)
#print(h)            
            
def tri_crepe(L):
  for i in range(len(L)):
      sup = maximun(L,i)
      retourne(L,sup)
      retourne(L,i)

# pile = [7,6,1,3,2,8,9,5,4]
pile = [4,9,2,7,5]
print(pile)
tri_crepe(pile)
print(pile)
  