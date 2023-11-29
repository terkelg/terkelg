// @see scripts/build.ts
declare module '~STATS~' {
  type Year = import('./worker').Year;

  const value: {
    years: Year[];
    contributions: number;
  };

  export default value;
}
