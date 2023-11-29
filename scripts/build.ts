import { build } from 'esbuild';

await build({
  entryPoints: ['src/worker.ts'],
  outfile: 'build/worker.js',
  bundle: true,
  splitting: false,
  treeShaking: true,
  target: 'es2022',
  format: 'esm',
  minify: true,
  write: true,
  plugins: [
    {
      name: 'stats',
      setup(build) {
        let filter = /^~STATS~$/;

        // stage: "find this"
        build.onResolve({ filter }, (args) => {
          return {
            path: args.path,
            namespace: 'stats' // "this is ours"
          };
        });

        // stage: "find data"
        build.onLoad({ filter }, async () => {
          // TODO: import your stats script & call it here
          let stats = await Promise.resolve({
            years: [],
            contributions: 0
          });

          return {
            contents: JSON.stringify(stats),
            loader: 'json'
          };
        });
      }
    }
  ]
});
