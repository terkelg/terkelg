import { Year } from './worker';

const BP_MEDIUM = 550;
const BP_LARGE = 700;
const BODY_COPY = `I'm Terkel. A Brooklyn-based internet enthusiast, creative technologist and maker of digital ephemera.`;

interface Props {
  width?: number;
  height: number;
  theme: 'light' | 'dark';
}

interface Attributes {
  height: string;
  'data-theme': 'light' | 'dark';
  [key: string]: string;
}

const attr = (obj: Record<string, string>) =>
  Object.entries(obj).reduce((acc, [key, value]) => `${acc} ${key}="${value}"`, '');

const svg = (styles: string, html: string, attributes: Attributes) => {
  if (!attributes.width) attributes.width = '100%';
  return /*html*/ `
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" ${attr(attributes)}>
		<foreignObject width="100%" height="100%">
			<div xmlns="http://www.w3.org/1999/xhtml">
				<style>${styles}</style>
				${html}
			</div>
		</foreignObject>
	</svg>`;
};

export const shared = /* css */ `
	:root {
		--color-text-light: #255DF6;
		--color-dot-bg-0-light: #EBEDF0;
		--color-dot-bg-1-light: #A7BEFB;
		--color-dot-bg-2-light: #628BF9;
		--color-dot-bg-3-light: #4071F7;
		--color-dot-bg-4-light: #255DF6;
		--color-dot-border-light: rgb(0 0 0 / 0.06);

		--color-text-dark: #255DF6;
		--color-dot-bg-0-dark: #171B21;
		--color-dot-bg-1-dark: #152A62;
		--color-dot-bg-2-dark: #2048B3;
		--color-dot-bg-3-dark: #1951EB;
		--color-dot-bg-4-dark: #0048FF;
		--color-dot-border-dark: rgb(0 0 0 / 0.06);

		/* Initial animation offset... */
		--default-delay: 1s;
		--default-duration: 1.55s;
		--default-stagger: 0.1s;

		/* Animation orchestration */
		--animate-in-menu-delay: calc(var(--default-delay) + var(--default-stagger) * 0);
		--animate-in-links-delay: calc(var(--default-delay) + var(--default-stagger) * 1);
		--animate-in-contributions-delay: calc(var(--default-delay) + var(--default-stagger) * 5);
		--animate-in-readme-delay: calc(var(--default-delay) + var(--default-stagger) * 6);
		--animate-in-copy-delay: calc(var(--default-delay) + var(--default-stagger) * 7);
		--animate-in-graph-delay: calc(var(--default-delay) + var(--default-stagger) * 17);
	}

	[data-theme="dark"] {
		--color-text: var(--color-text-dark);
		--color-dot-bg-0: var(--color-dot-bg-0-dark);
		--color-dot-bg-1: var(--color-dot-bg-1-dark);
		--color-dot-bg-2: var(--color-dot-bg-2-dark);
		--color-dot-bg-3: var(--color-dot-bg-3-dark);
		--color-dot-bg-4: var(--color-dot-bg-4-dark);
		--color-dot-border: var(--color-dot-border-dark);
	}

	[data-theme="light"] {
		--color-text: var(--color-text-light);
		--color-dot-bg-0: var(--color-dot-bg-0-light);
		--color-dot-bg-1: var(--color-dot-bg-1-light);
		--color-dot-bg-2: var(--color-dot-bg-2-light);
		--color-dot-bg-3: var(--color-dot-bg-3-light);
		--color-dot-bg-4: var(--color-dot-bg-4-light);
		--color-dot-border: var(--color-dot-border-light);
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
	}

	.wrapper {
		contain: strict;
		block-size: calc(var(--size-height) * 1px);
		container-type: inline-size;
		position: relative;
		overflow: clip;

		font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
		color: var(--color-text);
	}

	/* Hide everything in Firefox by default – show fallback instead */
	@-moz-document url-prefix() {
		.wrapper {
			display: none;
		}
	}

	.label {
		contain: content;
		font-size: 14px;
		font-weight: 600;
	}

	.link {
		contain: content;
		font-size: 14px;
	}

	.fade-in {
		will-change: opacity;
		animation-name: fade-in;
		animation-fill-mode: both;
		animation-duration: var(--duration, var(--default-duration));
		animation-timing-function: var(--ease, ease-out);
		animation-delay: var(--delay, var(--default-delay));
	}

	p {
		constrain: content;
		margin: 0;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.shine {
		background-color: var(--color-text);
		background-image: linear-gradient(-75deg, 
			rgb(0 0 0 / 0) 0%,
			rgb(255 255 255 / 0.18) 15%, 
			rgb(0 0 0 / 0) 25%
		);
		background-size: 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;

		animation-name: shine;
		animation-duration: 14s;
		animation-iteration-count: infinite;
	}

	@keyframes shine {
		0% {
			background-position: 200%;
		}
		10% {
			background-position: 0%;
		}
		to {
			background-position: 0%;
		}
	}
`;

export type Main = {
  years: Year[];
  sizes: number[][];
  length: number;
  location: { city: string; country: string };
  dots: {
    rows: number;
    size: number;
    gap: number;
  };
  year: {
    gap: number;
  };
};

export const main = (props: Props & Main) => {
  const styles = /*css*/ `
		${shared}

		:root {
			--rows: ${props.dots.rows};
			--size-width: 100cqw;
			--size-height: ${props.height};
			--size-dot-gap: ${props.dots.gap};
			--size-dot: ${props.dots.size};
			--size-year-gap: ${props.year.gap};
			--size-label-height: 20;
			--duration: 360;
		}

		.wrapper {
			align-items: flex-end;
			grid-template-rows: 1fr auto;
			row-gap: 20px;
		}

		.intro {
			contain: content;
			grid-area: 1 / 1 / span 1 / span 6;
			font-size: 18px;
			font-weight: 300;
		}
		.intro span {
			contain: content;
			--duration: 980ms;
			--delay: calc(var(--animate-in-copy-delay) + var(--i) * 10ms);
		}

		@media (width > ${BP_MEDIUM}px) {
			.intro {
				grid-area: 1 / 3 / span 1 / span 4;
				font-size: 22px;
			}
		}
		@media (width > ${BP_LARGE}px) {
			.intro {
				grid-area: 1 / 4 / span 1 / span 3;
			}
		}

		.graph {
			--delay: var(--animate-in-graph-delay);
			grid-area: 2 / 1 / span 1 / span 6;
		}

		.years {
			--_w: var(--w);
			--_h: calc(var(--h) + var(--size-label-height));

			display: flex;
			gap: calc(var(--size-year-gap) * 1px);

			contain: strict;
			inline-size: calc(var(--_w) * 1px);
			block-size: calc(var(--_h) * 1px);
			will-change: transform;
			backface-visibility: hidden;
			transform: translateZ(0);

			animation-name: scroll, fade-in;
			animation-timing-function: linear, ease-out;
			animation-duration: calc(30s + (var(--_w) * 0.06s)), 2.5s;
			animation-fill-mode: both, both;
			animation-delay: 2s, var(--animate-in-graph-delay);
		}
		@keyframes scroll {
			0% {
				transform: translateX(60px);
			}
			100% {
				transform: translateX(calc(-100% + 100cqw));
			}
		}

		.year {
			contain: strict;
			content-visibility: auto;
			inline-size: calc(var(--w) * 1px);
			block-size: calc(var(--_h) * 1px);
		}

		.year__label {
			contain: strict;
			block-size: calc(var(--size-label-height) * 1px);
			content-visibility: auto;
			display: flex;
			align-items: end;
		}
		.year__days {
			contain: content;
			display: grid;
			grid-auto-flow: column;
			grid-template-rows: repeat(var(--rows), calc(var(--size-dot) * 1px));
			grid-auto-columns: calc(var(--size-dot) * 1px);
			gap: calc(var(--size-dot-gap) * 1px);

			contain: strict;
			content-visibility: auto;
			inline-size: calc(var(--w) * 1px);
			block-size: calc(var(--h) * 1px);
		}
		.year__days .dot {
			contain: strict;
			content-visibility: auto;
			aspect-ratio: 1;
			inline-size: calc(var(--size-dot) * 1px);
			block-size: calc(var(--size-dot) * 1px);
			border: calc(var(--size-dot) * 0.075 * 1px) solid var(--color-dot-border);
			border-radius: calc(var(--size-dot) * 0.15 * 1px);
			will-change: transform;
		}
		.dot--0 { background-color: var(--color-dot-bg-0); }
		.dot--1 { background-color: var(--color-dot-bg-1); }
		.dot--2 { background-color: var(--color-dot-bg-2); }
		.dot--3 { background-color: var(--color-dot-bg-3); }
		.dot--4 { background-color: var(--color-dot-bg-4); }
	`;

  const format = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const date = (i: number) =>
    i == 0 ? format(new Date()) : new Date(props.years[i].from).getFullYear();

  const days = (days: Year['days']) =>
    days.map((level) => `<div class="dot dot--${level}"></div>`).join('');

  const html = /* html */ `
		<main class="wrapper grid">
			<article class="intro">
				<p>${BODY_COPY.split('')
          .map((c, i) => `<span class="fade-in" style="--i: ${i};">${c}</span>`)
          .join('')}</p>
			</article>
			<article class="graph">
				<div class="years" style="--w: ${props.length}; --h: ${props.sizes[0][1]};">
					${props.years
            .map(
              (year, i) => /* html */ `
						<div class="year year--${i}" style="--w: ${props.sizes[i][0]}; --h: ${props.sizes[i][1]};">
							<div class="year__days">${days(year.days)}</div>
							<div class="year__label label"><span>${date(i)}</span></div>
						</div>
					`
            )
            .join('')}
				</div>
			</article>
		</main>
	`;

  return svg(styles, html, {
    height: `${props.height}`,
    'data-theme': `${props.theme}`
  });
};

export const top = (props: Props & { contributions: number }) => {
  const styles = /* css */ `
		${shared}

		:root {
			--size-height: ${props.height};
		}

		.wrapper {
			align-items: center;
		}

		.menu {
			--delay: var(--animate-in-menu-delay);
			contain: content;
			text-align: left;
			grid-area: 1 / 1 / span 1 / span 2;
		}
		.contributions {
			--delay: var(--animate-in-contributions-delay);
			contain: strict; /* hide, show later */
			grid-area: 1 / 3 / span 1 / span 2;
		}
		.readme {
			--delay: var(--animate-in-readme-delay);
			contain: content;
			text-align: right;
			grid-area: 1 / 5 / span 1 / span 2;
		}

		@media (width > ${BP_MEDIUM}px) {
			.menu {
				grid-area: 1 / 1 / span 1 / span 2;
			}
			.contributions {
				contain: content; /* show agian */
				grid-area: 1 / 3 / span 1 / span 2;
			}
			.readme {
				grid-area: 1 / 5 / span 1 / span 2;
			}
		}

		@media (width > ${BP_LARGE}px) {
			.menu {
				grid-area: 1 / 1 / span 1 / span 3;
			}
			.contributions {
				grid-area: 1 / 4 / span 1 / span 2;
			}
			.readme {
				grid-area: 1 / 6 / span 1 / span 1;
			}
		}
	`;

  const html = /*html*/ `
		<div class="wrapper grid label">
			<div class="menu fade-in">Menu</div>
			<div class="contributions fade-in">
				<span class="shine">${(props.contributions / 1000).toFixed(1)}k</span> Contributions
			</div>
			<div class="readme fade-in">readme.md</div>
		</div>
	`;

  return svg(styles, html, {
    height: `${props.height}`,
    'data-theme': `${props.theme}`
  });
};

export const link = (props: Props & { index: number }) => (label: string) => {
  const styles = /*css*/ `
		${shared}

		:root {
			--size-height: ${props.height};
			--size-width: ${props.width};
			--i: ${props.index};
		}

		.wrapper {
			--delay: calc(var(--animate-in-links-delay) + var(--i) * 1.2s);
		}
		@-moz-document url-prefix() {
			/* Overwrite default, allow this to show in FF */
			.wrapper {
				display: block;
			}
		}

		.link {
			display: flex;
			justify-content: start;
			align-items: center;
			gap: 3px;
		}
		.link__label {
			animation-delay: ${Math.random() * 10}s;
		}
		.link__arrow {
			font-size: 0.75em;
			position: relative;
			inset-block-start: 0.1em;
			animation-name: rotate;
			animation-duration: 5s;
			animation-timing-function: ease-in-out;
			animation-iteration-count: infinite;
			animation-delay: ${Math.random() * 5}s;
		}

		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}
			10%,
			100% {
				transform: rotate(360deg);
			}
		}
	`;

  const html = /*html*/ `
		<main class="wrapper">
			<a class="link fade-in">
				<div class="link__label shine">${label}</div>
				<div class="link__arrow">↗</div>
			</a>
		</main>
	`;

  return svg(styles, html, {
    width: `${props.width}`,
    height: `${props.height}`,
    'data-theme': `${props.theme}`
  });
};

export const fallback = (props: Props & { width: number }) => {
  const styles = /* css */ `
		${shared}

		:root {
			--size-height: ${props.height};
			--size-width: ${props.width};
		}

		.wrapper {
			display: none;
		}
		@-moz-document url-prefix() {
			/* Hide everywhere but Firefox */
			.wrapper {
				display: flex;
				align-items: end;
			}
		}

		.intro {
			font-size: 22px;
			font-weight: 300;
		}
		.intro span {
			contain: content;
			--duration: 980ms;
			--delay: calc(var(--animate-in-contributions-delay) + var(--i) * 10ms);
		}

		.hint {
			--duration: 1.2s;
			--delay: calc(var(--animate-in-contributions-delay) + 2.5s);
			margin-block-start: 10px;
			font-size: 10px;
			font-style: italic;
		}
	`;

  const html = /* html */ `
		<main class="wrapper">
			<div class="intro">
				<p>${BODY_COPY.split('')
          .map((c, i) => `<span class="fade-in" style="--i: ${i};">${c}</span>`)
          .join('')}</p>
				<p class="hint fade-in">— I'm all for the foxy browser, but try Chrome/Safari for this one!</p>
			</div>
		</main>
	`;

  return svg(styles, html, {
    width: `${props.width}`,
    height: `${props.height}`,
    'data-theme': `${props.theme}`,
    viewbox: `0 0 ${props.width} ${props.height}`
  });
};
