        AREA    Exemple, CODE, READONLY   ; Déclare une zone de code en lecture seule
        ENTRY                               ; Point d'entrée du programme
        EXPORT  __main                       ; Rendre la fonction visible

__main
        MOV     r0, #5                       ; Charger la valeur 5 dans R0
        ADD     r0, r0, #7                   ; Ajouter 7 au registre R0

        END
		