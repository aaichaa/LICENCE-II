def code(s,p):
    l=[]
    i = len(p)-1
    while s>0 and i>=0:
        if s >= p[i]:
            l.append(p[i])
            s = s - p[i]
        else:
            i=i-1
    return l
print(code(13,[1,8,9,10]))

def autre(L):
    S=[]
    for I in L:
        ok = True
        for J in S:
            if max(I[0],J[0])<min(I[1],J[1]):
                ok = False
        if ok:
            S.append(I)
    return S

print(autre([[13, 16], [14, 15], [10, 12], [13, 14], [9, 12]]))