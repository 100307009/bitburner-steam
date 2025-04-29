/** @param {NS} ns */

import { HackExplore } from "./HackExplore.js"

const FLAGS = [['verbose', false], ['refreshRate', 200]];


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
    const target = ns.args[0]
    if (!target) {
        ns.tprint("No target provided")
        return
    }
    const path = findPathToServer(ns, target)
    for (const server of path) {
        ns.singularity.connect(server);
    }
}

export function autocomplete(data, args) {
	const servers = data.servers;
	const lastArg = args[args.length - 1] || '';
	return servers.filter(server => 
		server.toLowerCase().includes(lastArg.toLowerCase())
	);
}