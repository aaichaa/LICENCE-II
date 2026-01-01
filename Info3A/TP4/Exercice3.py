#print(list_alea(10)) 
def tri_pair_impair(L):
    n = len(L)
    for i in range(n):
        for j in range(n-1):
            if L[j] > L[j+1]:
                L[j],L[j+1] = L[j+1],L[j]
    return L

#print(tri_pair_impair(list_alea(9)))
                
print(tri_pair_impair([5,2,3,1,7,9,6,4]))  
def pair_impair(L):
    n = len(L)
    for i in range(n):
        for j in range(n-1):
            if  j % 2 == 0:
           
                if L[j] > L[j+1]:
                    L[j],L[j+1] = L[j+1],L[j]
            elif j % 2 ==1:
             
                if L[j] > L[j+1]:
                    L[j],L[j+1] = L[j+1],L[j]
             
    return L
print(pair_impair([5,2,3,1,7,9,6,4]))
    
    