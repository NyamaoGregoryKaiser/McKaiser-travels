declare module 'zustand' {
  export type StateCreator<T> = (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => T;
  
  export type SetState<T> = <K extends keyof T>(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean
  ) => void;
  
  export type GetState<T> = () => T;
  
  export interface StoreApi<T> {
    setState: SetState<T>;
    getState: GetState<T>;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }
  
  export type UseBoundStore<T> = {
    (): T;
    <U>(selector: (state: T) => U): U;
  } & StoreApi<T>;
  
  export function create<T>(initializer: StateCreator<T>): UseBoundStore<T>;
} 