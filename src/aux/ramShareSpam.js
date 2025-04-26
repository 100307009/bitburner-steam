/** @param {NS} ns */

import { RunScript } from "./RunScript.js"

export async function main(ns) {
    while(true) {
        await RunScript(ns, "../basic/shareRam.js", "home", 1000)
        //await RunScript(ns, hackScript, server, 1)
        await ns.sleep(20)
    }
}