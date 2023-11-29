# About

A website inside an SVG, inside an image, inside HTML, inside markdown, inside a GitHub readme.md.

> [!WARNING]
> This is all very experimental and may break any time.

## Development

Install dependencies

```bash
pnpm install
```

Start the dev server.

```bash
pnpm start
```

To fetch the GitHub contributions locally run. This requires a GitHub token to be configured.

```bash
pnpm stats
```

A GitHub action will automatically build and run the CI script every 12 hours to update the contribution graph and redeploy the site.
To do a local deploy run:

```bash
pnpm run deploy
```

## Tips & Tricks

- To purge the asset from the GitHub cache run `curl -w "\n" -s -X PURGE https://camo.githubusercontent.com/....`
