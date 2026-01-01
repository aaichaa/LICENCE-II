"""def mystere(L,i=0):
    n = len(L)
    if i==n//2:
        return L
    elif i < n//2 :
        L[i], L[n-i-1] = L[n-i-1], L[i]
        return mystere(L,i+1)"""

"""def mystere_mat(M,cpt=0):
    if cpt<len(M):
        M[0] = mystere(M[0])
        return mystere_mat(M[1:],cpt+1)
        
print( mystere_mat([[1,4,8,2,5,9,3], [1,8,5,6,10,15,9]]))"""



"""def mystere(L,i=0):
    n = len(L)
    if i==n//2:
        return L
    elif i < n//2 :
        L[i], L[n-i-1] = L[n-i-1], L[i]
        return mystere(L,i+1)
    
#print( mystere([1,4,8,2,5,9,3]))

def mystere_mat(M,cpt=0):
    if cpt == len(M):
        return M
    if cpt<len(M):
        M[0] = mystere(M[0])
        return mystere_mat(M[1:],cpt+1)
        
print( mystere_mat([[1,4,8,2,5,9,3], [1,8,5,6,10,15,9]]))

def cible(n):
    a=1
    S="1 "
    op = 0
    while a<n:
        if a*2<=n:
            a*=2
            S+="*2 "
            op +=1
        else:
            a+=1
            S+="+1 "
            op+=1
    return S,op
n=(int)(input("entrer n "))
print(cible(n))
def cibles(n):
    a=1
    S="1 "
    nb =0
    while a<n:
        if a * 2 <= n:
            a*=2
            S+="* 2 "
            nb+= 1
        elif a+ 1<=n:
            a+= 1
            S+="+ 1 "
            nb += 1
        
    return S,nb
print(cibles(16))"""
    
def somme_invpuis2(n):
    S=0
    for i in range(n):
        S+=1/2**i
    return S
print(somme_invpuis2(10))


def somme_invpuis2_rec(n,i=0):
    if i==n:
        return 1
    else:
        return 1/2**i+somme_invpuis2_rec(n, i+1)
print(somme_invpuis2_rec(10))
    
    
    
    
    
    
    
    
    



