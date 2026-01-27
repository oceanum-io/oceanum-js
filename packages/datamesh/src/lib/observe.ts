/** @ignore */
let _datameshDebugEnabled =
  typeof process !== "undefined" &&
  !!process.env &&
  process.env.DATAMESH_DEBUG === "true";

export function setDatameshDebugEnabled(enabled: boolean) {
  _datameshDebugEnabled = enabled;
}

export function isDatameshDebugEnabled() {
  return _datameshDebugEnabled;
}

export function measureTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  if (!_datameshDebugEnabled) return descriptor;

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const safeArgs = args.map((arg) => {
      if (!arg || typeof arg !== "object") return arg;
      try {
        return JSON.parse(
          JSON.stringify(arg, (key, value) => {
            if (typeof key === "string") {
              const k = key.toLowerCase();
              if (
                k.includes("token") ||
                k.includes("authorization") ||
                k.includes("jwt")
              ) {
                return "[redacted]";
              }
            }
            return value;
          }),
        );
      } catch {
        return "[unserializable]";
      }
    });

    const start = Date.now();

    try {
      const result = originalMethod.apply(this, args);

      if (result && typeof result.then === "function") {
        return result.finally(() => {
          const executionTime = Date.now() - start;
          console.debug(
            `@oceanum/datamesh debug: ${propertyKey} took ${executionTime}ms`,
            safeArgs,
          );
        });
      }

      const executionTime = Date.now() - start;
      console.debug(
        `@oceanum/datamesh debug: ${propertyKey} took ${executionTime}ms`,
        safeArgs,
      );
      return result;
    } catch (err) {
      const executionTime = Date.now() - start;
      console.debug(
        `@oceanum/datamesh debug: ${propertyKey} threw after ${executionTime}ms`,
        safeArgs,
      );
      throw err;
    }
  };

  return descriptor;
}
