import { common, createToggle, createDropdown, 
    createCollapsible, createTooltip, createServerGrid, 
    createHorizontalLayout, createButton
  } from './aux/UserInterfaceElements.js';
  
  import { HackExplore } from "./aux/HackExplore.js"
  import { AutobuyServers } from "./aux/AutobuyServers.js"
  import { settings, setSettings, needsUpdate, setNeedsUpdate, showTooltip, setShowTooltip, isExpanded, setIsExpanded } from "./aux/SingleSourceOfTruth.js";
  
  
  /** @param {NS} ns */
  export async function main(ns) {
    ns.disableLog("ALL");
    ns.ui.openTail();
    
    let storedSettings = await ns.read("settings.json")
    if(storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  
  
    const createUI = () => {
  
      const collapsibleElement = createCollapsible(
        isExpanded,
        (value) => { isExpanded = value; },
        createServerGrid(ns)
      );
  
      const autobuyToggleElement = createToggle(
        settings.autobuyServers,
        (value) => { settings.autobuyServers = value; },
        "AUTOBUY SERVERS"
      );
  
      const hackexploreToggleElement = createToggle(
        settings.hackexplore,
        (value) => { settings.hackexplore = value; },
        "HACK-EXPLORE"
      );
  
      const boughtServersTooltipElement = createTooltip(
        showTooltip,
        (value) => { setShowTooltip(value); },
        createServerGrid(ns)
      );
  
      const killallButtonElement = createButton(
        React.createElement("svg", {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "red",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
          React.createElement("path", { d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" })
        ),
        async () => { settings.killallTrigger = !settings.killallTrigger }
      );
  
      const batcherOptionsDropdownElement = createDropdown(
        settings.batcherTarget,
        [
          { value: "none", label: "STOP" },
          { value: "foodnstuff", label: "foodnstuff" },
          { value: "catalyst", label: "catalyst" },
          { value: "4sigma", label: "4Sigma" }
  
        ],
        (value) => { settings.batcherTarget = value; }
      );
  
      // autobuy servers && hackexplore
      const firstLine = createHorizontalLayout(
        [autobuyToggleElement, hackexploreToggleElement],
        { justifyContent: "spaceBetween" }
      );
  
      // bought servers
      const secondLine = createHorizontalLayout(
        [boughtServersTooltipElement],
        { justifyContent: "spaceBetween" }
      );
  
      // batcher
      const thirdLine = createHorizontalLayout(
        [batcherOptionsDropdownElement,killallButtonElement],
        { 
          label: "BATCHER",
          justifyContent: "spaceBetween"
        }
      );

      const fourthLine = createHorizontalLayout(
        [],
        { 
          label: "Karma: " + ns.heart.break(),
          justifyContent: "spaceBetween"
        }
      );
  
      ns.clearLog();
      return React.createElement("div", { style: common.container },
        firstLine,
        secondLine,
        thirdLine,
        fourthLine
      );
    };
  
    // Initial render
    ns.printRaw(createUI());
  
    // Keep script running and update UI when needed
    while(true) {
      if (needsUpdate) {
        ns.printRaw(createUI());
        setNeedsUpdate(false);
      }
      //routines
      await routine(ns)
      await ns.asleep(50);
    }
  }
  
  async function routine(ns) {
    if(settings.autobuyServers) {await AutobuyServers(ns)}
    if(settings.hackexplore) {settings.serverList = await HackExplore(ns)}
    if(settings.killallTrigger) {settings.killallTrigger = false; KillAll(ns)}
    //ns.exec("./ctt.js", "home")
    await saveSettings(ns)
  }
  
  async function saveSettings(ns) {
    var isEqualsJson = (obj1,obj2)=>{
      let keys1 = Object.keys(obj1);
      let keys2 = Object.keys(obj2);
  
      //return true when the two json has same length and all the properties has same value key by key
      return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
    }
  
    let storedSettings = await ns.read("settings.json")
    if(!isEqualsJson(settings,storedSettings)) {
      await ns.write("settings.json", JSON.stringify(settings, null, 2), "w")
    }
  }

  function KillAll(ns) {
    const currentServer = "home"
    let serverList = settings.serverList.filter(i => i !== currentServer);

    for(let server of serverList) {
        ns.killall(server);
        //await ns.sleep(10);
    }
    ns.killall(currentServer);
}
  
  