
#def terme(n):
#    if n ==0 or n == 1:
#        return n
 #   a = 0
 #   b = 1
 #   for i in range(n-1):
  ##      c = a + b
  #      a = b
  #      b = c
  #  return c

#print(terme(5))
  
def liste_terme(n):  
  l = [0,1] #on met ces deux la parce que le c commence a 1 sino on aura pas les 2 premiers termes 
  a =0
  b = 1
  for i in range (n-2):#-2 parce quon a deja les deux premiers termes 
      c = a + b
      a,b=b,c
      l.append(c)
  return l
print(liste_terme(5))
         