       AREA    Exemple, CODE, READONLY    ; Zone de code en lecture seule
        ENTRY                              ; Définit l'entrée du programme
        EXPORT  __main                     ; Fonction appelée par les programmes d'initialisation

__main
        MOV     r0, #5                     ; Charger la valeur 5 dans le registre R0
        ADD     r0, r0, #7                 ; Ajouter la valeur 7 au registre R0

        END