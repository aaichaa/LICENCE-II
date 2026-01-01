class Pile:
    def __init__(self):
        self._contenu = []
    def pile_vide(self):
        return self._contenu == []
    def empiler(self,x):
        self._contenu.append(x)
    def sommet(self):
        return self._contenu[-1]
    def depiler(self):
        return self._contenu.pop()
    def inverser_pile(self):
        Q = Pile()
        while not self.pile_vide():
            Q.empiler(self.depiler())
        return Q
    def copier_pile(self):
        p2 = Pile()
        p  = Pile()

        # On vide self dans p et p2
        while not self.pile_vide():
            x = self.depiler()
            p.empiler(x)
            p2.empiler(x)

        # On restaure self depuis p
        while not p.pile_vide():
            self.empiler(p.depiler())

        # On remet p2 dans le bon sens
        p2 = p2.inverser_pile()
        return p2
    
def bin_pile(n):
        m =Pile()
        Q = Pile()
        while n > 0:
            s = n%2
            m.empiler(s)
            n = n // 2
        while not m.pile_vide():    
            Q.empiler(m.depiler())
        return Q
def ouvrante(p):
    if p == ')':
        return '('
    if p == ']':
        return '['
    if p == '}':
        return '{'
def parenthese(s):
    L = []
    ok = True
    i = 0
    p = Pile()
    while i < len(s) and ok:
        if s[i] == '(' or s[i] == '{' or s[i] == '[':
            t = s[i]
            j = i
            p.empiler((j,t))
        else:
            if p.pile_vide():
                ok = False
            else:
                j,t = p.depiler()
                if ouvrante(s[i]) == t:
                    L.append((j,i))
        i += 1
    if p.pile_vide() and ok:
        return L
    else:
        return print('erreur')
                
print(parenthese("([))"))