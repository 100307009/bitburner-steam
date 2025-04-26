import * as SSOT from './SingleSourceOfTruth.js';

export const createToggle = (value, onChange, label="") => {
    return React.createElement("div", { style: common.marginBottom },
      React.createElement("label", { style: toggle.label },
        React.createElement("div", {
          style: {
            ...toggle.switch,
            backgroundColor: value ? "#4CAF50" : "#ccc"
          }
        },
          React.createElement("div", {
            style: {
              ...toggle.handle,
              left: value ? "26px" : "2px"
            }
          })
        ),
        React.createElement("input", {
          type: "checkbox",
          checked: value,
          onChange: (e) => {
            onChange(e.target.checked);
            SSOT.setNeedsUpdate(true);
          },
          style: toggle.input
        }),
        label
      )
    );
  };

  export const createDropdown = (value, options, onChange) => {
    return React.createElement("div", { style: dropdown.container },
      React.createElement("select", {
        id: "dropdownSelect",
        value: value,
        onChange: (e) => {
          onChange(e.target.value);
          SSOT.setNeedsUpdate(true);
        },
        style: dropdown.select
      },
        options.map(option => 
          React.createElement("option", {
            value: option.value,
            style: dropdown.option
          }, option.label)
        )
      )
    );
  };

  export const createCollapsible = (isExpanded, onToggle, content) => {
    return React.createElement("div", { style: collapsible.container },
      React.createElement("div", {
        style: {
          ...collapsible.header,
          marginBottom: isExpanded ? "10px" : "0"
        },
        onClick: () => {
          onToggle(!isExpanded);
          SSOT.setNeedsUpdate(true);
        }
      }, "SERVERS"),
      isExpanded && React.createElement("div", { style: collapsible.content },
        content
      )
    );
  };

  export const createTooltip = (showTooltip, onToggle, content) => {
    return React.createElement("div", { style: tooltip.container },
      React.createElement("div", {
        style: tooltip.box,
        onClick: (e) => {
          e.stopPropagation();
          onToggle(!showTooltip);
          SSOT.setNeedsUpdate(true);
        }
      }, "SERVERS"),
      showTooltip && React.createElement("div", { 
        style: tooltip.overlay,
        onClick: (e) => {
          e.stopPropagation();
          onToggle(false);
          SSOT.setNeedsUpdate(true);
        }
      }),
      showTooltip && React.createElement("div", { 
        style: {
          ...tooltip.content,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000
        },
        onClick: (e) => {
          e.stopPropagation();
        }
      }, content)
    );
  };

  /** @param {NS} ns */
  export const createServerGrid = (ns, count = 25) => {
    // Force update when servers change
    SSOT.setNeedsUpdate(true);
    
    const servers = ns.getPurchasedServers();
    const serverInfo = servers.map(server => {
      const ram = ns.getServerMaxRam(server);
      return `${server}\n${ns.formatRam(ram)}`;
    });

    return React.createElement("div", { 
      style: {
        ...tooltip.grid,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        borderRadius: "4px"
      }
    },
      Array(count).fill(0).map((_, i) => {
        const serverIndex = i % serverInfo.length;
        return React.createElement("div", {
          key: i,
          style: {
            ...tooltip.cell,
            whiteSpace: "pre-line",
            textAlign: "center",
            padding: "8px 12px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "12px"
          }
        }, serverInfo[serverIndex] || "Empty");
      })
    );
  };

  export const createHorizontalLayout = (elements, options = {}) => {
    const {
      label,
      justifyContent = "flex-start",
      elementWidth = "auto"
    } = options;

    return React.createElement("div", {
      style: {
        ...horizontal.container,
        justifyContent: horizontal[justifyContent]?.justifyContent || justifyContent
      }
    },
      label && React.createElement("div", { style: horizontal.label }, label),
      elements.map((element, index) => 
        React.createElement("div", {
          key: index,
          style: {
            ...horizontal.element,
            ...(elementWidth === "fixed" ? horizontal.fixedWidth : horizontal.autoWidth)
          }
        }, element)
      )
    );
  };

  export const createButton = (label, onClick) => {
    return React.createElement("div", { style: button.container },
      React.createElement("button", {
        style: {
          ...button.button,
          backgroundColor: SSOT.settings.isKillallDisabled ? "#cccccc" : "#4CAF50",
          cursor: SSOT.settings.isKillallDisabled ? "not-allowed" : "pointer"
        },
        disabled: SSOT.settings.isKillallDisabled,
        onClick: async () => {
          if (SSOT.settings.isKillallDisabled) return;
          SSOT.settings.isKillallDisabled = true;
          try {
            await onClick();
          } finally {
            SSOT.settings.isKillallDisabled = false;
          }
          SSOT.setNeedsUpdate(true);
        }
      }, label)
    );
  };

// Common styles
export const common = {
    container: {
      padding: "10px"
    },
    marginBottom: {
      marginBottom: "10px"
    },
    marginTop: {
      marginTop: "10px"
    }
  };
  
  // Toggle styles
  export const toggle = {
    label: {
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer"
    },
    switch: {
      position: "relative",
      width: "50px",
      height: "24px",
      borderRadius: "12px",
      transition: "background-color 0.3s",
      marginRight: "10px"
    },
    handle: {
      position: "absolute",
      top: "2px",
      width: "20px",
      height: "20px",
      backgroundColor: "black",
      borderRadius: "50%",
      transition: "left 0.3s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
    },
    input: {
      display: "none"
    }
  };
  
  // Dropdown styles
  export const dropdown = {
    container: {
      marginBottom: "10px"
    },
    select: {
      padding: "5px 10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      border: "1px solid #ddd",
      cursor: "pointer",
      fontSize: "14px",
      minWidth: "150px",
      outline: "none",
      transition: "border-color 0.3s, box-shadow 0.3s"
    },
    option: {
      padding: "5px",
      backgroundColor: "#fff"
    }
  };
  
  // Collapsible styles
  export const collapsible = {
    container: {
      marginTop: "10px"
    },
    header: {
      cursor: "pointer",
      padding: "5px",
      borderRadius: "4px"
    },
    content: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "5px",
      padding: "10px",
      borderRadius: "4px"
    },
    cell: {
      padding: "5px",
      borderRadius: "2px",
      textAlign: "center",
      fontSize: "12px",
      border: "1px solid #ddd"
    }
  };
  
  // Tooltip styles
  export const tooltip = {
    container: {
      position: "relative",
      display: "inline-block",
      marginTop: "10px"
    },
    box: {
      padding: "5px 10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      cursor: "pointer",
      border: "1px solid #ddd"
    },
    content: {
      position: "fixed",
      zIndex: 1000,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      border: "1px solid #ddd",
      minWidth: "300px",
      maxWidth: "80vw",
      maxHeight: "80vh",
      overflow: "auto"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "10px"
    },
    cell: {
      padding: "8px",
      backgroundColor: "#f8f8f8",
      borderRadius: "4px",
      textAlign: "center",
      fontSize: "14px",
      border: "1px solid #ddd"
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999
    }
  };
  
  // Horizontal layout styles
  export const horizontal = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px"
    },
    label: {
      minWidth: "100px",
      fontWeight: "bold"
    },
    element: {
      flex: 1
    },
    fixedWidth: {
      width: "150px"
    },
    autoWidth: {
      width: "auto"
    },
    spaceBetween: {
      justifyContent: "space-between"
    },
    spaceAround: {
      justifyContent: "space-around"
    },
    center: {
      justifyContent: "center"
    }
  };
  
  // Button styles
  export const button = {
    container: {
      marginBottom: "10px"
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background-color 0.3s, transform 0.1s",
      outline: "none",
      ":hover": {
        backgroundColor: "#45a049"
      },
      ":active": {
        transform: "scale(0.98)"
      }
    }
  }; 