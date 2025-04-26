import { RunScript } from "./RunScript.js"


export async function Drain(ns) {
  const servers = new Set(["n00dles", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"])

  while (servers.size > 0) {
    if (ns.hasRootAccess(server[0])) {
      while (ns.getServerMoneyAvailable(server[0]) > 10000) {
        await RunScript(ns, "../basic/hack.js", server[0], 4)
        await ns.sleep(20)
      }
      servers.delete(server[0])
      ns.toast(`Drained ${server[0]}`)
    }
    else {
      ns.nuke(target)
    }
  }
}

// param {NS} ns
export async function main(ns) {
  await Drain(ns)
}
