/** @ignore */
export function measureTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    const result = await originalMethod.apply(this, args);
    const end = Date.now();
    const executionTime = end - start;

    console.debug(`${propertyKey} took ${executionTime}ms`);

    return result;
  };

  return descriptor;
}
