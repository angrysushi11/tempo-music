import assert from "node:assert/strict";
import test from "node:test";

import {
  BPM_MAX,
  BPM_MIN,
  DEFAULT_BPM,
  STYLE_PRESETS,
  buildPrompt,
  buildPromptBlocks,
  clamp,
  estimateTapBpm,
  getDurationLabel,
  getDurationMeta,
  getPulseInstruction,
  getStyle,
} from "../src/index.js";

test("publishes exactly the styles exposed by the live interface", () => {
  assert.deepEqual(Object.keys(STYLE_PRESETS), ["trap", "house", "dnb", "techno", "hip-hop", "rock"]);
  assert.equal(getStyle("house").label, "House");
  assert.equal(getStyle("unknown"), STYLE_PRESETS.trap);
});

test("keeps the public BPM boundary and default stable", () => {
  assert.equal(BPM_MIN, 60);
  assert.equal(BPM_MAX, 220);
  assert.equal(DEFAULT_BPM, 100);
  assert.equal(clamp(40, BPM_MIN, BPM_MAX), 60);
  assert.equal(clamp(142, BPM_MIN, BPM_MAX), 142);
  assert.equal(clamp(260, BPM_MIN, BPM_MAX), 220);
});

test("estimates tap tempo deterministically and rejects insufficient evidence", () => {
  assert.equal(estimateTapBpm([0, 500]), null);
  assert.equal(estimateTapBpm([0, 500, 1000]), 120);
  assert.equal(estimateTapBpm([0, 400, 800, 1200, 1600]), 150);
  assert.equal(estimateTapBpm([0, 100, 600, 1100]), 120);
});

test("uses the same duration language as the live tool", () => {
  assert.equal(getDurationLabel("30"), "30-second");
  assert.equal(getDurationLabel("60"), "60-second");
  assert.equal(getDurationLabel("90"), "90-second");
  assert.equal(getDurationLabel("120"), "2-minute");
  assert.equal(getDurationMeta("120"), "120 SECONDS");
});

test("changes pulse instructions only at the documented boundaries", () => {
  assert.match(getPulseInstruction(80), /slow but not sleepy/);
  assert.match(getPulseInstruction(100), /direct and stable/);
  assert.match(getPulseInstruction(170), /85 BPM half-time/);
  assert.match(getPulseInstruction(170), /follow 170 BPM/);
});

test("builds the live default prompt without vocals or copyrighted material", () => {
  const style = getStyle("trap");
  const blocks = buildPromptBlocks(100, style);
  const prompt = buildPrompt(100, style, "60", blocks);

  assert.equal(blocks.map(({ label }) => label).join(","), "Requirement,Sound,Structure,Avoid,Format");
  assert.match(prompt, /^Create a 60-second original instrumental workout track in a trap workout track style at 100 BPM\./);
  assert.match(prompt, /Instrumental only: no singing, no spoken words, no lyrics, no vocal hook\./);
  assert.match(prompt, /artist imitation, existing melodies, and copyrighted tracks\./);
});

test("applies the selected style and high-tempo constraint to the output", () => {
  const style = getStyle("house");
  const prompt = buildPrompt(170, style, "120");

  assert.match(prompt, /^Create a 2-minute original instrumental workout track in a house workout track style at 170 BPM\./);
  assert.match(prompt, /punchy four-on-the-floor kick/);
  assert.match(prompt, /85 BPM half-time/);
});
