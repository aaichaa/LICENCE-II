"""def est_prefixe(mot1,mot2,i=0):
    if mot1[i] != mot2[i] or len(mot1)>len(mot2):
        return False
    elif i == len(mot1)-1:
        return True
    else:
        return est_prefixe (mot1,mot2,i+1)
a = input("entre le 1er mot " )
b = input("entre le 2em mot " )
print(est_prefixe(a,b))


def fusion(L1,L2):
    if L1==[]:
        return L2
    elif L2 ==[]:
        return L1
    if L1[0] <L2[0]:
        return [L1[0]] + fusion(L1[1:],L2)
    else :
        return [L2[0]] + fusion(L1,L2[1:])
print (fusion([1,2,3,45],[5,6,7,8,9,10]))
"""
#def max_pile(self):
def tri(L):
    n = len(L)
    for i in range(1,n):
        j = i; x = L[i]
        while j > 0 and L[j-1] > x :
            L[j] = L[j-1]
            j -= 1
        L[j] = x
    for i in range (1,n):
        j = i; x = L[i]
        while j > 0:
            if L[j-1] % 2 != 0 and L[j] % 2 == 0:
                L[j],L[j-1] = L[j-1],L[j]
            j-=1
                
        
    
        
    
L =   [2,1,6,8,5,3,4]
tri(L)
print(L)














    
    
        
        