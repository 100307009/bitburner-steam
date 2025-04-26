export function findPathToServer(ns, target, current = "home", path = [], visited = new Set()) {
    if (current === target) {
        return [...path, current];
    }
    
    visited.add(current);
    const neighbors = ns.scan(current);
    
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            const result = findPathToServer(ns, target, neighbor, [...path, current], visited);
            if (result) {
                return result;
            }
        }
    }
    
    return null;
}


export function GetServerList(ns, root = "home", found = new Set()) {
    found.add(root);
    for (const server of ns.scan(root))
        if (!found.has(server)){
            GetServerList(ns, server, found);
        } 
    return [...found];
}