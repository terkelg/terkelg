declare module '*.json' {
  type Year = import('./src/worker').Year;

  const value: {
    years: Year[];
    contributions: number;
  };

  export default value;
}
