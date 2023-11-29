declare module '*.json' {
  type Year = import('./worker').Year;

  const value: {
    years: Year[];
    contributions: number;
  };

  export default value;
}
