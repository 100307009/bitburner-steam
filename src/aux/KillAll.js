import { settings } from "./SingleSourceOfTruth.js";

export async function KillAll(ns) {
    const currentServer = ns.getHostname();
    let serverList = settings.serverList.filter(i => i !== currentServer);

    for(let server of serverList) {
        ns.killall(server);
        //await ns.sleep(10);
    }
    
    ns.killall(currentServer);
}

/** @param {NS} ns */
export async function main(ns) {
    await KillAll(ns);
}