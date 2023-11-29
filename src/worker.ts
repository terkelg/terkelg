import { fallback, link, main, top } from './render.js';
import data from './stats.json';

export type Year = {
  from: string;
  to: string;
  days: number[];
};

const MAX_YEARS = 3;

const worker: ExportedHandler = {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const theme = (searchParams.get('theme') ?? 'light') as 'light' | 'dark';
    const section = searchParams.get('section') ?? '';
    let content = ':-)';

    if (section === 'top') {
      const { contributions } = data;
      content = top({ height: 20, contributions, theme });
    } else if (section === 'link-website') {
      const index = Number(searchParams.get('i')) ?? 0;
      content = link({ height: 18, width: 100, index, theme })('Website');
    } else if (section === 'link-twitter') {
      const index = Number(searchParams.get('i')) ?? 0;
      content = link({ height: 18, width: 100, index, theme })('Twitter');
    } else if (section === 'link-instagram') {
      const index = Number(searchParams.get('i')) ?? 0;
      content = link({ height: 18, width: 100, index, theme })('Instagram');
    } else if (section == 'fallback') {
      content = fallback({ height: 180, width: 420, theme });
    } else {
      const years = data.years.slice(0, MAX_YEARS);
      const location = {
        city: (request.cf?.city || '') as string,
        country: (request.cf?.country || '') as string
      };
      const options = {
        dots: {
          rows: 6,
          size: 24,
          gap: 5
        },
        year: {
          gap: 5
        }
      };

      // Used to give the containing div `contain: strict` for perforamnce reasons.
      const sizes = years.map((year) => {
        const columns = Math.ceil(year.days.length / options.dots.rows);
        const width = columns * options.dots.size + (columns - 1) * options.dots.gap;
        const height =
          options.dots.rows * options.dots.size + (options.dots.rows - 1) * options.dots.gap;
        return [width, height];
      });

      // Calculate total length based on the width of the columns and the year gap
      const length =
        sizes.reduce((acc, size) => {
          acc += size[0] + options.year.gap;
          return acc;
        }, 0) - options.year.gap;

      content = main({ height: 290, years, sizes, length, location, theme, ...options });
    }

    return new Response(content, {
      headers: {
        'content-type': 'image/svg+xml',
        'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        pragma: 'no-cache',
        expires: '0'
      }
    });
  }
};

export default worker;
