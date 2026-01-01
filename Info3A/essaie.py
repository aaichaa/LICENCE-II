n = int(input ("enter un nombre"))

def somme_chiffres(n):
    somme = 0
    while n > 0:
        chiffre = n % 10       # on récupère le dernier chiffre
        somme += chiffre       # on l’ajoute à la somme
        n = n // 10            # on enlève le dernier chiffre
    return somme
print("Somme des chiffres de", n, "=", somme_chiffres(n))
    
    
def binaire(n):
    c = ""
    while n > 0:
        r = n % 2
        c = str(r) + c
        n = n // 2
    return c
print("Somme des chiffres de", n, "=", binaire(n))

    