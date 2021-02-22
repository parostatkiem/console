export function backendModulesExist(
  existingBackendModules = [],
  backendModules = [],
) {
  if (!existingBackendModules.length || !backendModules.length) {
    return false;
  }
  const allBM = existingBackendModules.map(bm => bm.name);

  for (const backendModule of backendModules) {
    if (!allBM.includes(backendModule)) {
      return false;
    }
  }

  return true;
}
