type AllOrPartial<T> = T | Partial<T>;

type ZustandSet<T> = (
  partial: AllOrPartial<T> | ((state: AllOrPartial<T>) => AllOrPartial<T>),
  replace?: boolean
) => void;

type ZustandGet<T> = () => T;

export type WithZustandGet<T extends {}> = T & {
  get: ZustandGet<T>;
};

export type WithZustandSet<T extends {}> = T & {
  set: ZustandSet<T>;
};

export type WithZustandSetGet<T extends {}> = T & {
  get: ZustandGet<T>;
  set: ZustandSet<T>;
};
