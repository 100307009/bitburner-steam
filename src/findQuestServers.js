/** @param {NS} ns */

import { HackExplore } from "./aux/HackExplore.js"

function findPathToServer(ns, target, current = "home", path = [], visited = new Set()) {
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

export async function main(ns) {
    const questServers = ["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z", "The-Cave", "fulcrumassets"];
    
    for (const server of questServers) {
        const path = findPathToServer(ns, server);
        if (path) {
            ns.tprint(`\nPath to ${server}: connect ${path.slice(1).join(" ; connect ")}\n\n`);
        } else {
            ns.tprint(`Could not find path to ${server}`);
        }
    }
}