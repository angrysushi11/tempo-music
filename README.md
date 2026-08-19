# Tempo Music engine

This is the zero-dependency prompt and tap-tempo engine behind [Tempo Music](https://www.doubledash.me/tools/tempo-music/).

Tempo Music does not generate audio. It turns a target BPM, track length, and musical style into a structured prompt for an original workout track that keeps a stable physical pulse.

## What is included

- deterministic tap-tempo estimation;
- BPM limits and half-time guidance;
- six styles exposed by the live tool: trap, house, drum and bass, techno, hip-hop, and rock;
- 30-, 60-, 90-, and 120-second prompt language;
- prompt blocks for tempo, sound, structure, exclusions, and instrumental format;
- tests for public inputs, boundaries, and generated output.

The branded DoubleDash page, website navigation, analytics, and unrelated tools are deliberately not part of this repository.

## Run the tests

Tempo Music has no runtime dependencies.

```bash
npm test
```

## Use the engine

```js
import {
  buildPrompt,
  getStyle,
} from "./src/index.js";

const prompt = buildPrompt(
  142,
  getStyle("house"),
  90,
);

console.log(prompt);
```

## Public boundary

- Inputs stay in the browser in the live implementation.
- The engine makes no network requests and stores no user data.
- Output is a text prompt, not generated music.
- The prompt explicitly rejects artist imitation, existing melodies, copyrighted tracks, lyrics, and spoken coaching.
- A generated track still depends on the downstream music model and should be checked for tempo, duration, rights, and fitness for the intended session.

## Source relationship

`src/index.js` is the reusable engine used by the verified DoubleDash integration candidate. The website wrapper owns DOM events, copy-to-clipboard behavior, and presentation. The public engine stays independent of Astro and the private website repository.

## License

Apache License 2.0. See [`LICENSE`](./LICENSE).
