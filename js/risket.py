import random
dado = random.choice((1, 2, 3, 4, 5, 6))
atacante = 0
defensor = 0
dados_att = []
dados_def = []
def getWar():
    """\
    Metodo para calcular el numero de atantes y defensores
    """
    if defensor > 1 and atacante > 3:
        while atacante > 3:
            ataque = [dado, dado, dado]
            defensa = [dado, dado]
            faceWar(ataque, defensa)
    if defensor > 0 and atacante == 3:
        ataque = [dado, dado]
        defensa = [dado]
        faceWar(ataque, defensa)
    if defensor > 0 and atacante == 2:
        ataque = [dado]
        defensa = [dado]
        faceSingleWar(ataque, defensa)

def faceWar(ataque, defensa):
    """\
    Metodo para enfrentar al atacante con el defensor
    """
    # Comparamos el mayor de los atacantes con el mayor de los defensores, lo mismo para los menores
    if max(ataque) > max(defensa) or min(ataque) > min(defensa):
        defensor - 1
    elif max(ataque) < max(defensa) or min(ataque) < min(defensa):
        atacante - 1
    elif max(ataque) == max(defensa) or min(ataque) == min(defensa):
        atacante - 1
        defensor - 1

def faceSingleWar(ataque, defensa):
    """\
    Metodo para enfrentar al atacante con el defensor
    """
    # Comparamos el mayor de los atacantes con el mayor de los defensores, lo mismo para los menores
    if ataque > defensa:
        defensor - 1
