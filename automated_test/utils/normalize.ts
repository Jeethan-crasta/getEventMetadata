export function normalizeCommon(data: any) {
  if (!data) return data;

  // top-level dynamic fields
  delete data.requestId;
  delete data.timestamp;
  delete data.executionTime;

  return data;
}

/**
 * Remove timestamps & volatile fields from arrays
 */
export function normalizeArray(
  arr: any[],
  fieldsToRemove: string[]
) {
  if (!Array.isArray(arr)) return arr;

  return arr.map(item => {
    const clone = { ...item };
    fieldsToRemove.forEach(f => delete clone[f]);
    return clone;
  });
}
