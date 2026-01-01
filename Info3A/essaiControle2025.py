"""def mystere(n):
    if n<=1:
        return 0
    return 1+mystere(n//2)
print(mystere(16))"""


def partition(L,deb,fin):
    
    x = L[deb]
    for i in range(1,fin):
        j = i
        while j < fin-1 and L[j]< x:
            L[j-1] = L[j]
            j+=1
            
        L[j-1] = x
        
    for i in range(fin):
        if L[i] == x:
            return i
L = [5,2,3,1,7,9,6,4]       
print(partition(L,0,8))


def tri_bulles_opt(L):
    n=len(L)
    print(L)
    trie=False #optimisé grâce à un booléen : arrêt dés que L est triée
    while not trie:
        trie=True
        for i in range(n-1):
             if L[i]>L[i+1]: #si 2 valeurs sont mal classées, on les échange
                 L[i],L[i+1]=L[i+1],L[i]
                 trie=False
        
        n-=1
        print(L)
        
        
L = [3,6,9,1,2,4,5,8]        
print(tri_bulles_opt(L))      