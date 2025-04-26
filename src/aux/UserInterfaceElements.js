import * as SSOT from './SingleSourceOfTruth.js';

export const createToggle = (value, onChange, label="") => {
    return React.createElement("div", { style: common.marginBottom },
      React.createElement("label", { style: toggle.label },
        React.createElement("div", {
          style: {
            ...toggle.switch(value),
            backgroundColor: value ? "#4CAF50" : "#ccc"
          }
        },
          React.createElement("div", {
            style: {
              ...toggle.handle(value),
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
      return `${ns.formatRam(ram)}`;
    });
    if (serverInfo.length < 25) {
      serverInfo.push(...Array(25 - serverInfo.length).fill("NaN"));
    }

    return React.createElement("div", { 
      style: tooltip.grid
    },
      Array(count).fill(0).map((_, i) => {
        const serverIndex = i % serverInfo.length;
        return React.createElement("div", {
          key: i,
          style: {
            ...tooltip.cell,
            whiteSpace: "pre-line"
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

// Bitburner game style variables
const bbColors = {
  green: "#00b300",
  greenDim: "#009900",
  black: "#111",
  border: "#00b300",
  disabled: "#222",
  toggleOffBg: "#222",
  toggleOffHandle: "#333"
};

const bbFont = {
  fontFamily: '"Fira Mono", "Consolas", "Menlo", "Monaco", monospace',
  fontSize: "15px",
  color: bbColors.green
};

const bbBorder = {
  border: `1px solid ${bbColors.border}`,
  borderRadius: "3px"
};

const bbButton = {
  ...bbFont,
  background: bbColors.black,
  color: bbColors.green,
  textTransform: "uppercase",
  padding: "6px 16px",
  ...bbBorder,
  cursor: "pointer",
  outline: "none",
  transition: "background 0.2s, color 0.2s",
  fontWeight: "bold"
};

// Common styles
export const common = {
  container: {
    ...bbFont,
    background: bbColors.black,
    padding: "10px",
    ...bbBorder
  },
  marginBottom: { marginBottom: "10px" },
  marginTop: { marginTop: "10px" }
};

// Toggle styles
export const toggle = {
  label: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    ...bbFont
  },
  switch: (value) => ({
    position: "relative",
    width: "50px",
    height: "24px",
    background: value ? bbColors.green : bbColors.toggleOffBg,
    ...bbBorder,
    marginRight: "10px",
    transition: "background 0.2s"
  }),
  handle: (value) => ({
    position: "absolute",
    top: "2px",
    width: "20px",
    height: "20px",
    backgroundColor: value ? bbColors.black : bbColors.toggleOffHandle,
    borderRadius: "2px",
    left: value ? "26px" : "2px",
    transition: "left 0.3s, background 0.2s"
  }),
  input: {
    display: "none"
  }
};

// Dropdown styles
export const dropdown = {
  container: { marginBottom: "10px" },
  select: {
    ...bbFont,
    background: bbColors.black,
    color: bbColors.green,
    ...bbBorder,
    padding: "5px 10px",
    minWidth: "150px",
    outline: "none",
    textTransform: "lowercase"
  },
  option: {
    background: bbColors.black,
    color: bbColors.green
  }
};

// Collapsible styles
export const collapsible = {
  container: { marginTop: "10px" },
  header: {
    ...bbFont,
    ...bbBorder,
    background: bbColors.black,
    color: bbColors.green,
    cursor: "pointer",
    padding: "5px",
    textTransform: "uppercase"
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "5px",
    padding: "10px",
    background: bbColors.black
  },
  cell: {
    ...bbFont,
    ...bbBorder,
    background: bbColors.black,
    color: bbColors.green,
    textAlign: "center",
    fontSize: "12px"
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
    ...bbFont,
    ...bbBorder,
    background: bbColors.black,
    color: bbColors.green,
    padding: "5px 10px",
    cursor: "pointer",
    textTransform: "uppercase"
  },
  content: {
    ...bbFont,
    ...bbBorder,
    background: bbColors.black,
    color: bbColors.green,
    position: "fixed",
    zIndex: 1000,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
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
    ...bbFont,
    ...bbBorder,
    background: bbColors.black,
    color: bbColors.green,
    textAlign: "center",
    fontSize: "14px",
    padding: "8px 12px"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 179, 0, 0.1)",
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
    ...bbFont,
    minWidth: "100px",
    fontWeight: "bold",
    color: bbColors.green,
    textTransform: "uppercase"
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
  container: { marginBottom: "10px" },
  button: {
    ...bbButton,
    borderColor: bbColors.border,
    background: bbColors.black,
    color: bbColors.green,
    ':hover': {
      background: bbColors.greenDim,
      color: bbColors.black
    },
    ':active': {
      background: bbColors.green,
      color: bbColors.black
    }
  }
}; 