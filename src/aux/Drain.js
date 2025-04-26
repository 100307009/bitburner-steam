import { RunScript } from "./RunScript.js"


export async function Drain(ns) {
  const servers = new Set(["n00dles", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"])

  for (let server of servers) {
    if (ns.hasRootAccess(server)) {
      while (ns.getServerMoneyAvailable(server) > 10000) {
        await RunScript(ns, "../basic/hack.js", server, 1)
        await ns.sleep(20)
      }
      servers.delete(server)
    }
    else {
      servers.delete(server)
    }
    ns.toast(`Drained ${server}`)
  }
}

// param {NS} ns
export async function main(ns) {
  await Drain(ns)
}
