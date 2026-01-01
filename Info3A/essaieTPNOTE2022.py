"""def inversion(L):
    cpt =0
    for i in range(len(L)-1):
        for j in range(i+1,len(L)):
            if L[i]>L[j]:
                cpt +=1
            
    return cpt
print(inversion([5,1,8,3,18,2,22,9]))"""

def inversion(L1,L2):
    cpt =0
    i = 0
    j=0
    while i <len(L1) and j <len(L2):
        if L1[i] > L2[j]:
            cpt += len(L1)-i
            j+=1
        else:
            i +=1
    return cpt        
print(inversion([6,9,11,13,15],[7,12,14]))
