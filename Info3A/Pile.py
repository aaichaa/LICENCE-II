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
    def inverse_Pile(self):
        P2=Pile()
        while not self.pile_vide():
            P2.empiler(self.depiler())
        return P2
    def copier_pile(self):
        P3=Pile()
        P3=self.inverse_Pile()
        P4=Pile()
        while not P3.pile_vide():
            x=P3.depiler()
            P4.empiler(x)
            self.empiler(x)
        return P4
    def __str__(self):
        S=""
        while not self.pile_vide():
             S=S+ str(self.depiler())+" "
        return S
    def taille_pile(self):
        cpt=0
        P5=self.copier_pile()
        while not P5.pile_vide():
            P5.depiler()
            cpt+=1
        return cpt
    def max_pile(self):
        Q=Pile()
        max=0
        s = self.copier_pile()
        while not s.pile_vide():
            
            n=s.depiler()
            Q.empiler(n)
            if max<n:
                max=n
        return max



