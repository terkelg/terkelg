import { writeFile } from 'node:fs/promises';
import type { Year } from '../src/worker';

export const START_DATE = new Date('2012-09-07T04:00:00.000Z');

export type Contribution = {
  contributionCount: number;
  date: string;
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE';
};

export type Response = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: Contribution[];
          }[];
        };
      };
    };
  };
};

/**
 * Get a range of contributions from GitHub. You are limited to 1 year at a time.
 * @param date range of contributions to fetch (Max 1 year)
 */
export async function request(date: { from?: Date; to?: Date }) {
  const body = {
    query: `query ($username: String!, $from: DateTime, $to: DateTime) {
			user(login: $username) {
				contributionsCollection(from: $from, to: $to) {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
								contributionLevel
							}
						}
					}
				}
			}
		}
		`,
    variables: {
      username: 'terkelg',
      from: date.from?.toISOString(),
      to: date.to?.toISOString()
    }
  };
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'terkelg/readme',
      Authorization: `bearer ${process.env.API_TOKEN_GITHUB}`
    },
    body: JSON.stringify(body)
  }).then((res) => res.json() as Promise<Response>);
  const calender = response.data.user.contributionsCollection.contributionCalendar;
  const weeks = calender.weeks;
  return { weeks, contributions: calender.totalContributions };
}

/**
 * Turn the GitHub contribution level into a number
 * @param level Contribution level
 */
const levelToInt = (level: Contribution['contributionLevel']) => {
  switch (level) {
    case 'NONE':
      return 0;
    case 'FIRST_QUARTILE':
      return 1;
    case 'SECOND_QUARTILE':
      return 2;
    case 'THIRD_QUARTILE':
      return 3;
    case 'FOURTH_QUARTILE':
      return 4;
  }
};

/**
 * Retrieves GitHub contributions within a specified date range.
 * Automatically handles pagination and fetches all contributions.
 * Limited to fetching 1-year intervals per GitHub's current restrictions.
 * Sorts contributions in reverse chronological order, showing most recent commits first.
 */
async function getAllContributions(start: Date, end = new Date()) {
  const years: Year[] = [];
  let cursor = start;
  let contributions = 0;

  while (cursor < end) {
    let next = new Date(cursor.getFullYear() + 1, 0, 1);
    // prevent fetching data beyond the current date
    if (next > end) next = end;
    console.info('...Fetching from', cursor.toISOString(), next.toISOString());
    const data = await request({ to: next, from: cursor });
    contributions += data.contributions;
    years.push({
      from: cursor.toISOString(),
      to: next.toISOString(),
      days: data.weeks
        .flatMap((week) => week.contributionDays.map((day) => levelToInt(day.contributionLevel)))
        .reverse()
    });
    cursor = next;
  }
  return [years.reverse(), contributions];
}

const [years, contributions] = await getAllContributions(START_DATE);

await writeFile('src/stats.json', JSON.stringify({ years, contributions }));

console.log('...Done');
