// Define instrucciones por propiedad (tú ajustas textos/acciones).
// La clave (propertyKey) debe venir de Hospitable (nombre de listing, id, etc).
export const PROPERTY_INSTRUCTIONS = {
  "Oasis Retreat - Cozy studio in Union...": {
    property: "Oasis Retreat - Cozy studio in Union",
    address: "Union City, NJ",
    steps: [
      {
        id: "bldg",
        title: "Building entry",
        description: "Use the intercom / Butterfly link to open the main door.",
        actionLabel: "Open main door"
      },
      {
        id: "apt",
        title: "Apartment entry",
        description: "Use the keypad code or smart-lock link.",
        actionLabel: "Get door code"
      },
      {
        id: "wifi",
        title: "Wi-Fi",
        description: "Network name and password are shown below.",
        actionLabel: "Copy Wi-Fi"
      }
    ]
  },

  // EJEMPLO otra propiedad:
  "Miami House - NW 53rd St": {
    property: "Miami House - NW 53rd St",
    address: "Miami, FL",
    steps: [
      { id: "gate", title: "Gate", description: "Gate code: ####", actionLabel: "Copy code" },
      { id: "door", title: "Front door", description: "Use smart lock link.", actionLabel: "Open door" }
    ]
  }
};

// fallback si no matchea ninguna propiedad
export const DEFAULT_INSTRUCTIONS = {
  property: "Your stay",
  address: "",
  steps: [
    { id: "s1", title: "Access", description: "Instructions will appear here shortly." }
  ]
};
