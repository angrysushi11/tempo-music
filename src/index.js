export const BPM_MIN = 60;
export const BPM_MAX = 220;
export const DEFAULT_BPM = 100;

export const STYLE_PRESETS = Object.freeze({
  trap: Object.freeze({
    label: "Trap",
    prompt: "trap workout track",
    production: "dry trap drums, crisp hats, rounded low-end, sparse plucks or bell-like accents, and a steady bounce",
  }),
  house: Object.freeze({
    label: "House",
    prompt: "house workout track",
    production: "punchy four-on-the-floor kick, warm bass, filtered chords, and a tight looping groove",
  }),
  dnb: Object.freeze({
    label: "Drum & Bass",
    prompt: "drum and bass workout track",
    production: "fast breakbeats, deep sub-bass, and a relentless rolling groove with clean transients",
  }),
  techno: Object.freeze({
    label: "Techno",
    prompt: "techno workout track",
    production: "driving kick, hypnotic percussion loops, restrained synth stabs, and a hard even pulse",
  }),
  "hip-hop": Object.freeze({
    label: "Hip-hop",
    prompt: "hip-hop workout track",
    production: "dry hip-hop drums, crisp hats, rounded low-end, short rhythmic accents, and a direct pocket that keeps the pulse exposed",
  }),
  rock: Object.freeze({
    label: "Rock",
    prompt: "rock workout track",
    production: "tight live drums, driving bass, clipped rhythm guitar, and a steady backbeat with no tempo drift",
  }),
});

export function getStyle(styleKey) {
  return STYLE_PRESETS[styleKey] || STYLE_PRESETS.trap;
}

export function buildPrompt(bpm, style, durationSeconds, blocks = buildPromptBlocks(bpm, style)) {
  const duration = getDurationLabel(durationSeconds);
  const intro = `Create a ${duration} original instrumental workout track in a ${style.prompt} style at ${bpm} BPM.`;
  return [intro, "", blocks.map((block) => `${block.label}: ${block.text}`).join("\n\n")].join("\n");
}

export function buildPromptBlocks(bpm, style) {
  return [
    {
      label: "Requirement",
      text: `Keep the body on tempo. The rhythm must hold a clear, steady pulse at ${bpm} BPM from the first few seconds to the end. ${getPulseInstruction(bpm)}`,
    },
    {
      label: "Sound",
      text: `Make it musical, not a metronome: use ${style.production}. The pulse should be easy to move with for boxing, running, jump rope, or general conditioning.`,
    },
    {
      label: "Structure",
      text: "Quick 2-4 second pickup, then a stable main groove. Add small variations every 8-16 bars, but preserve the tempo cue and do not hide the beat.",
    },
    {
      label: "Avoid",
      text: "Vocal pop structure, singing, spoken words, lyrics, vocal hook, tempo drift, long beatless intros, long breakdowns, sudden half-speed sections, sad cinematic chords, dreamy ambient wash, spoken coaching, metronome beeps, countdown voice, artist imitation, existing melodies, and copyrighted tracks.",
    },
    {
      label: "Format",
      text: "Instrumental only: no singing, no spoken words, no lyrics, no vocal hook. Make it fully original.",
    },
  ];
}

export function estimateTapBpm(times) {
  const intervals = [];
  for (let index = 1; index < times.length; index += 1) {
    const interval = times[index] - times[index - 1];
    if (interval >= 260 && interval <= 2000) intervals.push(interval);
  }

  if (intervals.length < 2) return null;

  const sorted = [...intervals].sort((a, b) => a - b);
  const usable = sorted.length > 3 ? sorted.slice(1, -1) : sorted;
  const averageInterval = usable.reduce((sum, interval) => sum + interval, 0) / usable.length;
  return clamp(Math.round(60000 / averageInterval), BPM_MIN, BPM_MAX);
}

export function getPulseInstruction(bpm) {
  if (bpm >= 155) {
    const halfTime = Math.round(bpm / 2);
    return `If the musical groove works better at ${halfTime} BPM half-time, include clear double-time subdivisions so the body can still follow ${bpm} BPM.`;
  }

  if (bpm <= 85) {
    return "Keep the groove slow but not sleepy; make every beat feel intentional and physically followable.";
  }

  return "Keep the main groove direct and stable; do not let arrangement changes weaken the tempo cue.";
}

export function getDurationLabel(durationSeconds) {
  const seconds = Number.parseInt(durationSeconds, 10);
  if (seconds >= 120) return "2-minute";
  if (seconds >= 90) return "90-second";
  if (seconds >= 60) return "60-second";
  return "30-second";
}

export function getDurationMeta(durationSeconds) {
  const seconds = Number.parseInt(durationSeconds, 10);
  return seconds === 120 ? "120 SECONDS" : `${seconds} SECONDS`;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
