def suivant(s):
    c =""
    compt = 1
    for i in range(1,len(s)+1):
        if i < len(s) and s[i-1] == s[i]:
            compt += 1
        else:
            c = c + str(compt) + s[i-1]
            compt = 1
    return c
         
s = "1121"
print(suivant(s))

#REFFAIRE CE QUE JE FAISAIS AVANT JE DEMANDE A CHAT
def conway(n):
   l=["1"]
   for i in range(1,n):
       l.append(suivant(l[len(l)-1]))
   return l    
            
print(conway(9))            
    






    