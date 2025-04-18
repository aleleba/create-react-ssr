declare module '*.svg' {
    const content: any;
    export default content;
}

declare const module: {
    hot?: {
      accept(dep?: string, callback?: () => void): void;
      dispose(callback: () => void): void;
    };
};
