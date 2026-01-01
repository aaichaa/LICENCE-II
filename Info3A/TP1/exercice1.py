from math import *
#methode pas optimisée puisque on a 3 boucles et a chaque(a,b) on parcourt c de b+1 a 100
#for a in range(1,101):
    #for b in range (a,101):
       # for c in range(b+1,101):
          #  if c*c == a*a + b*b:
           #  print(a,b,c)

#methode optimisée ona 2 boucles on calculer la racine carrée entière,
#puis vérifier si son carré redonne le nombre de départ
for a in range(1,101):
    for b in range (a,101):
        carre = a * a + b * b   
        c = int(sqrt(carre))
        if c * c == carre and c > b and c <= 100:
            print(a,b,c)
           