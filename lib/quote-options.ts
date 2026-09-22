export const projectScopes = [
  { id: "supply", label: "Supply only" },
  { id: "install", label: "Supply and installation" },
  { id: "turnkey", label: "Complete turnkey project" },
  { id: "unsure", label: "Not sure — please advise" },
] as const;

export const frameSystems = [
  { id: "unsure", label: "Please recommend the right frame" },
  { id: "rhs", label: "RHS — rectangular hollow section" },
  { id: "ub", label: "UB — universal beam" },
] as const;

export const rollerDoorSizes = [
  { id: "unsure", label: "Not sure — please recommend" },
  { id: "2.4x2.4", label: "2.4 m wide × 2.4 m high" },
  { id: "3x3", label: "3.0 m wide × 3.0 m high" },
  { id: "3.6x3.6", label: "3.6 m wide × 3.6 m high" },
  { id: "4x4", label: "4.0 m wide × 4.0 m high" },
  { id: "4.8x4.8", label: "4.8 m wide × 4.8 m high" },
  { id: "custom", label: "Custom or mixed sizes" },
] as const;

export const windowSizes = [
  { id: "unsure", label: "Not sure — please recommend" },
  { id: "1200x900", label: "1200 mm wide × 900 mm high" },
  { id: "1500x900", label: "1500 mm wide × 900 mm high" },
  { id: "1800x900", label: "1800 mm wide × 900 mm high" },
  { id: "custom", label: "Custom or mixed sizes" },
] as const;

export const roofInsulationOptions = [
  { id: "unsure", label: "Not sure — please recommend" },
  { id: "none", label: "No roof insulation" },
  { id: "sisalation", label: "Sisalation foil" },
  { id: "aircell", label: "AirCell reflective insulation" },
  { id: "blanket-55", label: "55 mm insulation blanket" },
] as const;

export const wallInsulationOptions = [
  { id: "unsure", label: "Not sure — please recommend" },
  { id: "none", label: "No wall insulation" },
  { id: "sisalation", label: "Sisalation foil" },
  { id: "aircell", label: "AirCell reflective insulation" },
  { id: "insulated-system", label: "Insulated wall system" },
] as const;

export const accessoryOptions = [
  { id: "skylights", label: "Skylights" },
  { id: "roof-vents", label: "Roof vents" },
  { id: "verandah", label: "Verandah or awning" },
  { id: "mezzanine", label: "Mezzanine" },
  { id: "glass-slider", label: "Glass sliding door" },
  { id: "steel-sliders", label: "Steel sliding doors" },
] as const;

export const buildTimelines = [
  { id: "asap", label: "As soon as practical" },
  { id: "three-months", label: "Within 3 months" },
  { id: "six-months", label: "Within 6 months" },
  { id: "twelve-months", label: "Within 12 months" },
  { id: "exploring", label: "Planning ahead / exploring options" },
  { id: "flexible", label: "Flexible" },
] as const;

export const quoteGoals = [
  { id: "formal-quote", label: "A detailed project quote" },
  { id: "budget", label: "A preliminary budget estimate" },
  { id: "discussion", label: "A design and site discussion first" },
  { id: "unsure", label: "Not sure — guide me" },
] as const;

export const quantityOptions = (maximum: number) =>
  Array.from({ length: maximum + 1 }, (_, value) => ({
    id: String(value),
    label: value === 0 ? "None" : String(value),
  }));
