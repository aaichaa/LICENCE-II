def tri_bulles(L):
  n=len(L)
  trie=False #optimisé grâce à un booléen : arrêt dés que L est triée
  while not trie:
   trie=True
   for i in range(n-1):
     if L[i]>L[i+1]: #si 2 valeurs sont mal classées, on les échange
      L[i],L[i+1]=L[i+1],L[i]
      trie=False
   n-=1#o
   
   
   
def tri_comptage(A): #trie la liste A
  k=max(A) #détermination de la longueur de C
  C=[0]*(k+1) #initialisation de C
  for i in range(len(A)): #pour chaque valeur rencontrée dans A, on
#incrémente le compteur correspondant dans C
   C[A[i]]+=1
   p=0 #indice pour remplir la liste A
   for i in range(k+1): #parcours de C
     for j in range(C[i]): #on écrit C[i] fois la valeur i dans A
      A[p]=i
      p+=1
      
      
def trie(A):
 max = L[0]
 for i in range(1,len(A)):
     if A[i]>A[max]:
         max = A[i]
 C=[0]*(max + 1)
 for i in range(len(C)):
     x = A[i]
     C[x] = C[x] + 1
     j = 0
     A[j] = C[i] * i
     j+=1
L=[7,2,6,3,4]
trie(L)
print(L)


