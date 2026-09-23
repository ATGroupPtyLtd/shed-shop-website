export const purposes = [
  {
    id: "home",
    label: "Home",
    title: "Garages & workshops",
    description:
      "Secure storage, serious workshop space and room for the things you enjoy.",
  },
  {
    id: "farm",
    label: "Farm",
    title: "Farm & machinery sheds",
    description:
      "Practical access, dependable spans and protection designed around the way you work.",
  },
  {
    id: "business",
    label: "Business",
    title: "Commercial & industrial",
    description:
      "Professional workshops, warehouses and operational buildings designed to grow with you.",
  },
  {
    id: "other",
    label: "Other",
    title: "Special-purpose buildings",
    description:
      "Hangars, community facilities, shelters and one-off buildings outside the usual categories.",
  },
] as const;

export const styles = [
  { id: "gable", label: "Gable", note: "Versatile, familiar and efficient" },
  { id: "skillion", label: "Skillion", note: "Clean contemporary roofline" },
  {
    id: "barn",
    label: "American barn",
    note: "Raised centre with twin lean-tos",
  },
  { id: "open", label: "Open-front", note: "Fast machinery and stock access" },
  { id: "custom", label: "Bespoke form", note: "A non-standard roof or form" },
] as const;

export const claddingProfiles = [
  {
    id: "corrugated",
    label: "Corrugated",
    note: "Classic fine-rib steel profile",
  },
  { id: "trimdek", label: "Trimdek", note: "Bold, clean trapezoidal ribs" },
  {
    id: "architectural-panel",
    label: "Architectural panel",
    note: "Wide-format contemporary finish",
  },
] as const;

export const colourFinishGroups = [
  { id: "classic", label: "Classic finish", count: 22 },
  { id: "matt", label: "Matt finish", count: 6 },
] as const;

export const colours = [
  { id: "dover-white", label: "Dover White", hex: "#F9FBF1", finish: "classic" },
  { id: "surfmist", label: "Surfmist", hex: "#E4E2D5", finish: "classic" },
  { id: "evening-haze", label: "Evening Haze", hex: "#C5C2AA", finish: "classic" },
  { id: "classic-cream", label: "Classic Cream", hex: "#E9DCB8", finish: "classic" },
  { id: "paperbark", label: "Paperbark", hex: "#CABFA4", finish: "classic" },
  { id: "dune", label: "Dune", hex: "#B1ADA3", finish: "classic" },
  { id: "southerly", label: "Southerly", hex: "#D2D1CB", finish: "classic" },
  { id: "shale-grey", label: "Shale Grey", hex: "#BDBFBA", finish: "classic" },
  { id: "bluegum", label: "Bluegum", hex: "#969799", finish: "classic" },
  { id: "windspray", label: "Windspray", hex: "#888B8A", finish: "classic" },
  { id: "gully", label: "Gully", hex: "#857E73", finish: "classic" },
  { id: "jasper", label: "Jasper", hex: "#6C6153", finish: "classic" },
  { id: "wallaby", label: "Wallaby", hex: "#7F7C78", finish: "classic" },
  { id: "basalt", label: "Basalt", hex: "#6D6C6E", finish: "classic" },
  { id: "woodland-grey", label: "Woodland Grey", hex: "#4B4C46", finish: "classic" },
  { id: "monument", label: "Monument", hex: "#323233", finish: "classic" },
  { id: "night-sky", label: "Night Sky", hex: "#000000", finish: "classic" },
  { id: "ironstone", label: "Ironstone", hex: "#3E434C", finish: "classic" },
  { id: "deep-ocean", label: "Deep Ocean", hex: "#364152", finish: "classic" },
  { id: "cottage-green", label: "Cottage Green", hex: "#304C3C", finish: "classic" },
  { id: "pale-eucalypt", label: "Pale Eucalypt", hex: "#7C846A", finish: "classic" },
  { id: "manor-red", label: "Manor Red", hex: "#5E1D0E", finish: "classic" },
  { id: "bluegum-matt", label: "Bluegum Matt", hex: "#969B9B", finish: "matt" },
  { id: "shale-grey-matt", label: "Shale Grey Matt", hex: "#C6C9C4", finish: "matt" },
  { id: "surfmist-matt", label: "Surfmist Matt", hex: "#EAE9E0", finish: "matt" },
  { id: "monument-matt", label: "Monument Matt", hex: "#292E2A", finish: "matt" },
  { id: "basalt-matt", label: "Basalt Matt", hex: "#5F615D", finish: "matt" },
  { id: "dune-matt", label: "Dune Matt", hex: "#BDB3A7", finish: "matt" },
] as const;

export const projects = [
  {
    image: "/projects/project-01.jpg",
    title: "Agricultural portal frame",
    description:
      "The exposed portal frame shows the building's structural skeleton taking shape before cladding is installed.",
    category: "In progress",
    type: "farm",
  },
  {
    image: "/projects/project-02.jpg",
    title: "Open machinery canopy",
    description:
      "A broad open-front canopy giving farm machinery direct access and dependable weather protection.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-03.jpg",
    title: "Rural multi-bay workshop",
    description:
      "A substantial rural workshop with multiple bays arranged for flexible equipment and vehicle access.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-04.jpg",
    title: "Commercial mezzanine facility",
    description:
      "An integrated steel mezzanine creates valuable working and storage area within the commercial footprint.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-05.jpg",
    title: "Architectural trade facility",
    description:
      "A contemporary trade facility combining a practical workshop footprint with a strong street-facing facade.",
    category: "Architectural",
    type: "custom",
  },
  {
    image: "/projects/project-06.jpg",
    title: "Residential garage workshop",
    description:
      "A secure residential garage and workshop designed to sit neatly alongside the surrounding home environment.",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-07.jpg",
    title: "Large-span warehouse interior",
    description:
      "The clear-span interior provides an open, adaptable floor area without unnecessary internal obstructions.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-08.jpg",
    title: "Detailed home workshop",
    description:
      "Brickwork, roller-door access and considered detailing give this home workshop a polished, integrated finish.",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-09.jpg",
    title: "Custom two-storey structure",
    description:
      "A bespoke two-storey steel structure carefully fitted into a compact residential setting.",
    category: "Architectural",
    type: "custom",
  },
  {
    image: "/projects/project-10.jpg",
    title: "Industrial fit-out",
    description:
      "The internal steel frame and roof system of a commercial fit-out before the space moves into operation.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-11.jpg",
    title: "Local steel fabrication",
    description:
      "A close look at local steel fabrication as structural components are prepared for the build.",
    category: "Behind the build",
    type: "process",
  },
  {
    image: "/projects/project-12.jpg",
    title: "Industrial build in progress",
    description:
      "An industrial project during construction, showing the scale of the site and structural work involved.",
    category: "In progress",
    type: "process",
  },
  {
    image: "/projects/project-13.jpg",
    title: "Rural storage workshop",
    description:
      "A long rural building providing protected storage and practical workshop space under one roof.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-14.jpg",
    title: "Traditional rural barn",
    description:
      "A traditional barn form with generous central access and practical storage along each side.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-15.jpg",
    title: "Mezzanine floor system",
    description:
      "A purpose-built steel mezzanine adding usable floor area without increasing the building footprint.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-16.jpg",
    title: "Large industrial structure",
    description:
      "A large industrial structure demonstrating the scale and clean geometry possible with portal-frame construction.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-17.jpg",
    title: "Finished workshop interior",
    description:
      "A completed workshop interior with a clear working floor, natural light and an unobstructed steel structure.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-18.jpg",
    title: "Verandah farm shed",
    description:
      "A rural shed with a deep verandah providing covered access and useful sheltered space along the building.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-19.jpg",
    title: "Multi-wing machinery shed",
    description:
      "A wide multi-wing layout designed to separate machinery storage while keeping every bay easy to reach.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-20.jpg",
    title: "Landscaped home workshop",
    description:
      "A residential workshop integrated into the property with a tidy approach, landscaping and practical access.",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-21.jpg",
    title: "Multi-bay roller-door facility",
    description:
      "Multiple roller-door bays provide independent access across a hardworking commercial facility.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-22.jpg",
    title: "Monument farm workshop",
    description:
      "A Monument-finished farm workshop with broad openings, strong proportions and a restrained rural presence.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-23.jpg",
    title: "Heavy-duty mezzanine",
    description:
      "A robust mezzanine system engineered to carry demanding storage and operational loads.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-24.jpg",
    title: "High-clearance industrial shed",
    description:
      "A high-clearance industrial building designed around tall access points and generous internal volume.",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-25.jpg",
    title: "Compact dual-bay workshop",
    description:
      "A compact workshop that makes efficient use of its frontage with two full-height roller-door bays.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-26.jpg",
    title: "Storage shed with lean-to",
    description:
      "A simple skillion-roof storage building with an efficient form and straightforward sheltered access.",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-27.jpg",
    title: "Structural steel installation",
    description:
      "Structural steel being installed on site as the building's frame and final form come together.",
    category: "In progress",
    type: "process",
  },
] as const;
