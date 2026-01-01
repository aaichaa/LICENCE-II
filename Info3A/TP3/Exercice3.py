
def puis(x,n):
    p=1
    for i in range(n):
        p*=x
    return p
def eval_pol(L, x): #L contient [a0, a1,...]
    s=0
    for i in range(len(L)):
        s=s+L[i]*puis(x,i)
    return s
L=[-3, 5, 2, 7, -2, 3]
print(eval_pol(L, -1))