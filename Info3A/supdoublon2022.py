"""def sup_doub(L):
    i = len(L)-1
    P = []
    while i >= 0:
        while L[i] == L[i-1]:
            i-= 1
        else:
            P.append(L[i])
            i-=1
    return P
print(sup_doub([1,4,4,5,5,5,5,5,8,9,9]))
"""
def sup_doub_aux(L):
    i = 0
    return sup_db(L,i)
    
def sup_db(L,i):
    if i == len(L):
        return []
    elif i < len(L)-1 and L[i] == L[i+1]:
        return sup_db(L,i+1)
    else:
        return [L[i]] + sup_db(L,i+1)    
print(sup_doub_aux([3,3,5,7,7,8]))















