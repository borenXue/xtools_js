export type Treeable<
  T extends object,
  TID extends keyof T,
  childrenKey extends string,
> = (T & {
  [k in childrenKey]: Treeable<T, TID, childrenKey>[]
})[];


// npm 包: path-prop 中的 flat 函数
// https://stackoverflow.com/questions/66614528/flatten-object-with-custom-keys-in-typescript
export type FlattenObject<T extends object> = object extends T
  ? object
  : {
      [K in keyof T]-?: (
        x: NonNullable<T[K]> extends infer V
          ? V extends object
            ? V extends readonly any[]
              ? Pick<T, K>
              : FlattenObject<V> extends infer FV
              ? {
                  [P in keyof FV as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: FV[P];
                }
              : never
            : Pick<T, K>
          : never,
      ) => void;
    } extends Record<keyof T, (y: infer O) => void>
  ? O extends infer U
    ? { [K in keyof O]: O[K] }
    : never
  : never;
