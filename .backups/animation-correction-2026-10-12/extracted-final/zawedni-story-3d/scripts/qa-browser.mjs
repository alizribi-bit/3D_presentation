// Explicit Vulkan path for hardware checks; QA_RENDERER=default uses Chrome's normal headless selection.
export const qaArgs = process.env.QA_RENDERER === 'default' ? []
  : ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'];
