import { findPathToServer } from "./utils.js";

export async function HackExplore(ns, root = "home", found = new Set()) {
    found.add(root);
    for (const server of ns.scan(root))
        if (!found.has(server)){
            await HackExplore(ns, server, found);
            await rootThis(ns, server);
        } 
    return [...found];
}

async function rootThis(ns, target) {
    const isElementPresent = (set, element) => set.has(element);

    const questServers = new Set(["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z", "The-Cave", 
        //corporate zone
        "fulcrumassets", "ecorp", "megacorp", "kuai-gong", "4sigma", "nwo", "blade", "omnitek", 
        "bachman", "clarke", 
        //farm zone
        "foodnstuff", "n00dles"])

    let playerTools = sumHackingTools(ns)
    if(!ns.hasRootAccess(target) && ns.getServerNumPortsRequired(target) <= playerTools) {
        if(ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target)
        }
        if(ns.fileExists("FTPCrack.exe", "home")) {
            ns.ftpcrack(target)
        }
        if(ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(target)
        }
        if(ns.fileExists("HTTPWorm.exe", "home")) {
            ns.httpworm(target)
        }
        if(ns.fileExists("SQLInject.exe", "home")) {
            ns.sqlinject(target)
        }
        ns.nuke(target)
            
    }
    if(isElementPresent(questServers, target) && 
        !ns.getServer(target).backdoorInstalled && 
        ns.getServer(target).requiredHackingSkill <= ns.getPlayer().skills.hacking &&
        ns.hasRootAccess(target)){

            const path = findPathToServer(ns, target)
            for (const server of path) {
                ns.singularity.connect(server);
            }
            await ns.singularity.installBackdoor(target)
            await ns.singularity.connect("home")
    }
}

export function sumHackingTools(ns) {
    let playerTools = 0
    if(ns.fileExists("BruteSSH.exe", "home")) {
        playerTools += 1
    }
    if(ns.fileExists("FTPCrack.exe", "home")) {
        playerTools += 1
    }
    if(ns.fileExists("relaySMTP.exe", "home")) {
        playerTools += 1
    }
    if(ns.fileExists("HTTPWorm.exe", "home")) {
        playerTools += 1
    }
    if(ns.fileExists("SQLInject.exe", "home")) {
        playerTools += 1
    }
    return playerTools
}

export async function main(ns) {
    while(true) {
        await HackExplore(ns)
        await ns.sleep(1000)
    }
}