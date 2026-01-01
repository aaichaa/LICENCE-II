def tri_pair_impair(L):
    
    
    n = len(L)
   
    echange = True
    while echange: #i < n - 1 and
        echange = False
        i = 0
        while i < n - 1: 
            if L[i] > L[i+1] :
                L[i],L[i+1] = L[i+1],L[i]
                echange = True
            i+=2    
        j = 1
        while j < n - 1:
            if L[j] > L[j+1] :   
                L[j],L[j+1] = L[j+1],L[j]
                echange = True
            j+=2
           
    return L  
print(tri_pair_impair([10,2,3,1,7,9,6,4]))

"""  while echange: 
        echange = False
        for i in range(0,n,2):
            if i < n - 1 and L[i] > L[i+1] :
                  L[i],L[i+1] = L[i+1],L[i]
                  echange = True
              
        for i in range(1,n,2):
            if i < n - 1 and L[i] > L[i+1] :
                L[i],L[i+1] = L[i+1],L[i]
                echange = True
            
    return L  
print(tri_pair_impair([5,2,3,1,7,9,6,4])) 
  
  """
