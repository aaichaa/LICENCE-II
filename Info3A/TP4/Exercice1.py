def list_alea(n):
    L = []
    L= list(range(0,n))
    for j in range(0,n-2):
        for k in range(j,n-1):
            L[j],L[k]=L[k],L[j]
    return L
    
    

print(list_alea(9)) 

            
def list_auxiliaire(L):
    min_val = min(L)
    max_val = max(L)
    C = [0] * (max_val - min_val + 1)
    
    for i in L:
        C[i - min_val] += 1  # décalage
    
    return C, min_val       
        
L=[512, 482, 765, 512, 687, 765, 512]
print(list_auxiliaire(L))
