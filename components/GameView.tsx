import {
  A,
  AUDIO,
  DIV,
  H1,
  H2,
  LI,
  P,
  SCRIPT,
  SPAN,
  STYLE,
  UL,
} from "@fartlabs/htx";
import type { Song } from "../types.ts";

export interface GameViewProps {
  currentSong: Song;
  score: number;
}

export function GameView({ currentSong, score }: GameViewProps) {
  const styles = `
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
      background: var(--fart-darker-dark-primary);
      border-radius: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 2.5rem;
      color: var(--fart-primary);
      margin-bottom: 2rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }
    .controls {
      margin: 2rem 0;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 1rem;
    }
    audio {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
    h2 {
      font-size: 1.8rem;
      color: var(--fart-secondary);
      margin: 2rem 0;
    }
    .choices {
      list-style: none;
      padding: 0;
      margin: 2rem 0;
      display: grid;
      gap: 1rem;
      max-width: 600px;
      margin: 2rem auto;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .choice {
      background: var(--fart-dark-primary);
      padding: 1rem 2rem;
      border-radius: 0.8rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      font-size: 1.2rem;
      position: relative;
      overflow: hidden;
    }

    .choice:hover {
      background: var(--fart-primary);
      color: var(--fart-darker-dark-primary);
      border-color: var(--fart-secondary);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      animation: bounce 0.5s ease infinite;
    }

    .choice:active {
      transform: translateY(2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .score {
      font-size: 1.5rem;
      color: var(--fart-primary);
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.8rem;
      display: inline-block;
    }
    .score-value {
      color: var(--fart-secondary);
      font-weight: bold;
      margin-left: 0.5rem;
    }
    .back-link {
      display: inline-block;
      margin-top: 2rem;
      color: var(--fart-primary);
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .back-link:hover {
      opacity: 1;
    }
  `;

  return (
    <DIV>
      <STYLE>{styles}</STYLE>
      <DIV class="container">
        <H1>🎵 Anime Song Quiz</H1>

        <DIV class="controls">
          <AUDIO controls="controls" src={currentSong.url} preload="auto">
          </AUDIO>
        </DIV>

        <H2>Which anime is this song from?</H2>

        <SCRIPT>
          {`
          if (!globalThis._playRandomFart) {
            const fartSounds = [
              'https://www.myinstants.com/media/sounds/quick-fart.mp3',
              'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3',
              'https://www.myinstants.com/media/sounds/fart-short.mp3',
              'https://www.myinstants.com/media/sounds/wet-fart.mp3',
              'https://www.myinstants.com/media/sounds/fart_9.mp3'
            ];
            const audioPool = fartSounds.map(src => {
              const audio = new Audio(src);
              audio.volume = 0.2;
              return audio;
            });
            let lastIndex = -1;

            globalThis._playRandomFart = function() {
              let index;
              do {
                index = Math.floor(Math.random() * audioPool.length);
              } while (index === lastIndex && audioPool.length > 1);
              
              const audio = audioPool[index];
              audio.currentTime = 0;
              audio.play();
              lastIndex = index;
            };
          }
        `}
        </SCRIPT>
        <UL class="choices">
          {currentSong.choices.map((choice) => (
            <LI
              class="choice"
              onclick={`try { globalThis._onAnswer('${
                choice.replace(/'/g, "\\'")
              }')} catch(e) { console.error('Error in onclick:', e); }`}
              onmouseenter="try { globalThis._playRandomFart(); } catch(e) { console.error('Error playing sound:', e); }"
            >
              {choice}
            </LI>
          ))}
        </UL>

        <P class="score">
          Score: <SPAN class="score-value">{score}</SPAN>
        </P>

        <P>
          <A href="/" class="back-link">Back to Home</A>
        </P>
      </DIV>
    </DIV>
  );
}
