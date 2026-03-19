export default function removeUndefinedFromRecord<
  T extends Record<string, unknown>,
>(record: T) {
  return Object.fromEntries(
    Object.entries(record).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export function convertToCSSVar(variablesObject: Record<string, string>) {
  const isCapital = (ch: string) => {
    return ch === ch.toUpperCase() && ch !== ch.toLowerCase();
  };

  const transformed = Object.fromEntries<string>(
    Object.entries(variablesObject).map(([key, val]): [string, string] => {
      let newKeyName: string = "--";

      for (let i = 0; i < key.length; i++) {
        if (
          isCapital(key[i]) ||
          (i !== 0 &&
            Number.isInteger(Number(key[i])) &&
            !Number.isInteger(Number(key[i - 1])))
        ) {
          newKeyName += `-${key[i].toLowerCase()}`;
        } else {
          newKeyName += key[i];
        }
      }
      return [newKeyName, val];
    }),
  );
  return transformed;
}
