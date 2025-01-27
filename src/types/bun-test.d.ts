declare module 'bun:test' {
  export const describe: (name: string, fn: () => void) => void;
  export const test: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: any;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
  export const mock: (moduleName: string, factory?: () => any) => void;
  export const jest: {
    fn: () => jest.Mock;
    mock: (moduleName: string, factory?: () => any) => void;
    clearAllMocks: () => void;
    Mock: any;
  };
} 