/** @param {NS} ns */

export async function main(ns) {
    while(true) {
        await ns.share()
        //await ns.sleep(10000)
    }
}