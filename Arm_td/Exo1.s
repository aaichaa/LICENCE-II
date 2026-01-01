        AREA    Exemple, CODE, READONLY
		EXPORT  main 		; Déclare une zone de code en lecture seule
        ENTRY                               ; Point d'entrée du programme
                              ; Rendre la fonction visible

main
        MOV     r0, #5                       ; Charger la valeur 5 dans R0
        ADD     r0, r0, #7                   ; Ajouter 7 au registre R0
STOP    B STOP
        END
		