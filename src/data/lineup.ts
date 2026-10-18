/**
 * The lineup, act by act — PROVISIONAL.
 *
 * Built so the lineup layouts can be judged with the shape of a real bill:
 * 4 to 6 acts a day, each with a photo, a short bio, a stage, a set time and
 * a Spotify and a YouTube link. None of it is the real programme.
 *
 * - Names are numbered placeholders ("Artist 01"), not invented artists.
 * - Photos are the nine performer portraits from the lineup comp
 *   (2550:20117), cycled, so some repeat.
 * - Bios are placeholder text in two lengths, to show how a layout copes
 *   with a one-line bio and a three-line one.
 * - Stages are generic ("Main stage", "Village stage"); the real stage names
 *   are not known.
 * - Days are the first three on the 2026 poster (02 – 11 July); set times
 *   overlap across the two stages on purpose, so clashes show.
 * - Spotify and YouTube links are "#" until each act is confirmed.
 *
 * Replace the whole array when the bill is announced; the layouts read only
 * these fields.
 */

export type LineupAct = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  stage: string;
  /** 24-hour "HH:MM". A set past midnight keeps counting: "00:45". */
  start: string;
  end: string;
  spotify: string;
  youtube: string;
  headliner?: boolean;
};

export type LineupDay = {
  id: string;
  /** "Thu 02 Jul" */
  label: string;
  date: string;
  acts: LineupAct[];
};

export const LINEUP_STAGES = ["Main stage", "Village stage"] as const;

const SHORT =
  "Placeholder bio — one line on who they are and the sound they bring.";
const LONG =
  "Placeholder bio — two or three lines: where they are from, what they have released, and why this set is worth arriving early for. Real copy comes with the confirmed bill.";

const [MAIN, VILLAGE] = LINEUP_STAGES;

let n = 0;
function act(
  stage: string,
  start: string,
  end: string,
  opts: { headliner?: boolean; long?: boolean } = {},
): LineupAct {
  n += 1;
  const num = String(n).padStart(2, "0");
  return {
    id: `artist-${num}`,
    name: `Artist ${num}`,
    photo: `/assets/artist-${((n - 1) % 9) + 1}.jpg`,
    bio: opts.long ? LONG : SHORT,
    stage,
    start,
    end,
    spotify: "#",
    youtube: "#",
    headliner: opts.headliner,
  };
}

export const lineup: LineupDay[] = [
  {
    id: "2026-07-02",
    label: "Thu 02 Jul",
    date: "2026-07-02",
    acts: [
      act(VILLAGE, "19:30", "20:30"),
      act(MAIN, "20:15", "21:30", { long: true }),
      act(VILLAGE, "21:15", "22:15"),
      act(MAIN, "22:00", "23:30", { headliner: true, long: true }),
      act(VILLAGE, "23:30", "00:45"),
    ],
  },
  {
    id: "2026-07-03",
    label: "Fri 03 Jul",
    date: "2026-07-03",
    acts: [
      act(VILLAGE, "19:00", "20:00"),
      act(MAIN, "19:45", "21:00", { long: true }),
      act(VILLAGE, "20:45", "21:45"),
      act(MAIN, "21:30", "22:45"),
      act(VILLAGE, "22:30", "23:30", { long: true }),
      act(MAIN, "23:15", "00:45", { headliner: true, long: true }),
    ],
  },
  {
    id: "2026-07-04",
    label: "Sat 04 Jul",
    date: "2026-07-04",
    acts: [
      act(MAIN, "19:30", "20:45"),
      act(VILLAGE, "20:30", "21:30", { long: true }),
      act(MAIN, "21:30", "23:00", { headliner: true, long: true }),
      act(VILLAGE, "23:00", "00:30"),
    ],
  },
];

/** Minutes after 18:00, so sets past midnight sort and place after 23:59. */
export function minutesFromSix(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return ((h < 12 ? h + 24 : h) - 18) * 60 + m;
}

/** Acts in running order (by start time). */
export function runningOrder(day: LineupDay) {
  return [...day.acts].sort(
    (a, b) => minutesFromSix(a.start) - minutesFromSix(b.start),
  );
}
