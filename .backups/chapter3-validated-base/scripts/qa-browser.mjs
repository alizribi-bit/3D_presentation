// Reproducible browser QA on a machine without a hardware rendering context.
// The report identifies software rendering; no claim of projector/GPU fluidity follows.
export const qaArgs = [
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];
