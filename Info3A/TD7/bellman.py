def bellman(G,so):
    dist={k: float('inf') for k in G}
    pred={k: -1 for k in G}
    dist[so] = 0
    for s in G:
        for v,c in G[s]:
            if dist[s] + c < dist[v]:
                dist[v] = dist[s] + c
                pred [v] = s
    return dist,pred

def bellman_neg(G,so):
    dist={k: float('inf') for k in G}
    dist[so] = 0
    for s in G:
        for v,c in G[s]:
            if dist[s] + c < dist[v]:
                dist[v] = dist[s] + c
    for s in G:
        for v,c in G[s]:
            if dist[s] + c < dist[v]:
                print('cycle neg detecté')
                return True
    return False
G = {0:[(2,-2)], 1:[(0,4),(2,-3)],2:[(3,2)],3:[(1,-1)]}
print(bellman_neg(G,0))