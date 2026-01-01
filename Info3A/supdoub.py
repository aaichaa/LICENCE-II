"""def mystere(L, i=0):
    n = len(L)
    if i < n/2:
        L[i], L[n - i - 1] = L[n - i - 1], L[i]
        mystere(L, i + 1)


def mystere_mat(M, i=0):
    if i < len(M):
        mystere(M[i])      # applique mystere sur la i-ème ligne
        mystere_mat(M, i+1)

M =[[1,2,3,4,5],[6,7,8,9,10]]
mystere_mat(M)
print(M)"""

"""def mystere_mat(M):
    if len(M) == 0:
      return
    else :
        mystere(M[0])
        mystere_mat(M[1:])
M = [[1,2,3,4,5],[6,7,8,9,10]]
mystere_mat(M)
print(M) # maintenant print affiche la matrice renversée"""


"""def sup_doub(L):
    n = len(L)
    M = []
    i = 0
    while i < n-1:
        if L[i] == L[i+1]:
            i += 1
        else:
            M.append(L[i])
            i+=1
    M.append(L[i])    
        
   return M"""
"""def sup_doub(L):
    if not L:   # si la liste est vide
        return []
    M = [L[0]]
    for i in range(1, len(L)):
        if L[i] != L[i-1]:
            M.append(L[i])
    return M

print(sup_doub([1,4,4,5,5,5,5,5,8,9,9]))

def comp(A):
    m = max(A)
    C = [0]*(m+1)
    S=[]
    for i in range(len(A)):
        C[A[i]] +=1
    for i in range(len(C)):
        j = i
        while C[j] != 0:
            S.append(j)
            C[j]-=1
            
        
    return S
A=[0,1,0,2,0,1,1,1,2,0]
print(comp(A))"""

"""def pair(n):
    pair = True
    if n == 0:
        return pair
    elif n%2==0 and (n-1)%2!=0:
            return pair
    else:
        return False
    
print(pair(245858))

def impair(n):
    impair = True
    if n == 0:
        return False
    elif n%2!=0 and (n-1)%2==0:
            return impair
    else:
        return False
    
print(impair(245858))"""


"""def est_pair(n):
    if n == 0:
        return True
    else:
        return est_impair(n - 1)

def est_impair(n):
    if n == 0:
        return False
    else:
        return est_pair(n - 1)
print(est_pair(2))"""

 def creer_pile():
        return []
    def pile_vide(P):
        return P==[]
    def sommet(P):
        return P[-1]
    def depiler(P):
        return P.pop()
    def empiler(self,x):
        P.append(x)
