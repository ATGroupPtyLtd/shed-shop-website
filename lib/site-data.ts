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
    id: "custom",
    label: "Custom",
    title: "Architectural structures",
    description:
      "Mezzanines, architectural cladding and uncommon buildings without off-the-shelf compromise.",
  },
] as const;

export const styles = [
  { id: "gable", label: "Gable", note: "Versatile, familiar and efficient" },
  { id: "skillion", label: "Skillion", note: "Clean contemporary roofline" },
  { id: "barn", label: "American barn", note: "Character with useful height" },
  { id: "open", label: "Open-front", note: "Fast machinery and stock access" },
  { id: "custom", label: "Custom", note: "Tailored to a specific brief" },
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

export const colours = [
  { id: "monument", label: "Monument", hex: "#323333" },
  { id: "surfmist", label: "Surfmist", hex: "#E4E2D5" },
  { id: "woodland-grey", label: "Woodland Grey", hex: "#4B4C46" },
  { id: "night-sky", label: "Night Sky", hex: "#000000" },
  { id: "shale-grey", label: "Shale Grey", hex: "#BDBFBA" },
  { id: "basalt", label: "Basalt", hex: "#6D6C6E" },
  { id: "dune", label: "Dune", hex: "#B1ADA3" },
  { id: "pale-eucalypt", label: "Pale Eucalypt", hex: "#7C846A" },
  { id: "ironstone", label: "Ironstone", hex: "#3E434C" },
  { id: "deep-ocean", label: "Deep Ocean", hex: "#364152" },
  { id: "manor-red", label: "Manor Red", hex: "#5E1D0E" },
  { id: "classic-cream", label: "Classic Cream", hex: "#E9DCB8" },
] as const;

export const projects = [
  {
    image: "/projects/project-01.jpg",
    title: "Agricultural portal frame",
    category: "In progress",
    type: "farm",
  },
  {
    image: "/projects/project-02.jpg",
    title: "Open machinery canopy",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-03.jpg",
    title: "Rural multi-bay workshop",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-04.jpg",
    title: "Commercial mezzanine facility",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-05.jpg",
    title: "Architectural trade facility",
    category: "Architectural",
    type: "custom",
  },
  {
    image: "/projects/project-06.jpg",
    title: "Residential garage workshop",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-07.jpg",
    title: "Large-span warehouse interior",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-08.jpg",
    title: "Detailed home workshop",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-09.jpg",
    title: "Custom two-storey structure",
    category: "Architectural",
    type: "custom",
  },
  {
    image: "/projects/project-10.jpg",
    title: "Industrial fit-out",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-11.jpg",
    title: "Local steel fabrication",
    category: "Behind the build",
    type: "process",
  },
  {
    image: "/projects/project-12.jpg",
    title: "Industrial build in progress",
    category: "In progress",
    type: "process",
  },
  {
    image: "/projects/project-13.jpg",
    title: "Rural storage workshop",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-14.jpg",
    title: "Traditional rural barn",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-15.jpg",
    title: "Mezzanine floor system",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-16.jpg",
    title: "Large industrial structure",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-17.jpg",
    title: "Finished workshop interior",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-18.jpg",
    title: "Verandah farm shed",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-19.jpg",
    title: "Multi-wing machinery shed",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-20.jpg",
    title: "Landscaped home workshop",
    category: "Residential",
    type: "home",
  },
  {
    image: "/projects/project-21.jpg",
    title: "Multi-bay roller-door facility",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-22.jpg",
    title: "Monument farm workshop",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-23.jpg",
    title: "Heavy-duty mezzanine",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-24.jpg",
    title: "High-clearance industrial shed",
    category: "Commercial",
    type: "commercial",
  },
  {
    image: "/projects/project-25.jpg",
    title: "Compact dual-bay workshop",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-26.jpg",
    title: "Skillion storage shed",
    category: "Agricultural",
    type: "farm",
  },
  {
    image: "/projects/project-27.jpg",
    title: "Structural steel installation",
    category: "In progress",
    type: "process",
  },
  {
    image: "/projects/project-28.jpg",
    title: "Custom architectural concept",
    category: "Architectural",
    type: "custom",
  },
] as const;
