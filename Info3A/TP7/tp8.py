from turtle import *
#def testturtle():

"""forward(100)
left(90)
forward(100)
left(90)
forward(100)
left(90)
forward(100)
forward(100)
righ(90)
backward(100)
left(90)
forward(100)
left(90)
forward(100)"""

"""forward(100)
left(90)
forward(50)
right(45)
backward(80)"""
"""def triangle_equilaterale(c):

    forward(c)
    left(120)
    forward(c)
    right(60)
    backward(c)



c = 100
triangle_equilaterale(c)"""
"""def hexagone(c):
    forward(c)
    right(60)
    forward(c)
    left(120)
    backward(c)
    left(120)
    forward(c)
    right(60)
    forward(c)
    right(60)
    forward(c)    
c = 100
hexagone(c)"""

"""def pentagramme(c,angle):
    forward(c)
    left(30)
    backward(c)
    left(30)
    forward(c)
    left(30)
    backward(c)
    left(45)
    forward(c)
    

c = 100
pentagramme(c,angle)"""

"""def spirale(c,delta,angle,n):
    if n == 0:
        return
    else:
        left(angle)
        forward(c)
        spirale(c+delta,delta,angle,n-1)

c = 10
delta = 5
angle = 90
n = 50
spirale(c,delta,angle,n) 

def polygone(n,c):# pas vraie ne marche pas 
    angle = (n - 2)*180/n
    def trace(n,c):
        if n == 0:
            return
        else :
            forward(c)
            left(angle)
            
            return trace(n-1,c)
                
            

n = 5
c = 100
polygone(n,c) """



def polygone(n,c,angle):
    if n == 0:
        return
    else :
        forward(c)
        right(angle)
        
        
            
        return polygone(n-1,c,angle)
#n = 5
#c = 100
#angle = (n - 2)*180/n
#polygone(n,c,angle)


def emboite(n,c,delta):
    if n == 0:
        return
    else :
        angle = (n - 2)*180/n
        polygone(n,c,angle)
        emboite(n-1,c-delta,delta)
    
    
emboite(7,150,5)    
        
    
    
    
    
    
    
    
    