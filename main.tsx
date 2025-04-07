import { Router } from "jsr:@fartlabs/rt";
import type { RtContext } from "jsr:@fartlabs/rt";
import { DIV } from "@fartlabs/htx";
import { Layout } from "./components/Layout.tsx";
import { LandingPage } from "./components/LandingPage.tsx";
import { GameView } from "./components/GameView.tsx";
import { Modal } from "./components/Modal.tsx";
import { songs as originalSongs } from "./data.ts";
import { shuffle } from "./utils/shuffle.ts";
import type { GameState } from "./types.ts";

function generateChoices(
  correctAnswer: string,
  allSongs: typeof originalSongs,
): string[] {
  // Get all unique choices from all songs
  const allChoices = [...new Set(allSongs.flatMap((song) => song.choices))];

  // Filter out the correct answer and shuffle
  const otherChoices = shuffle(
    allChoices.filter((choice) => choice !== correctAnswer),
  );

  // Take 3 random choices and combine with correct answer
  return shuffle([correctAnswer, ...otherChoices.slice(0, 3)]);
}

if (import.meta.main) {
  const gameStates = new Map<string, GameState>();
  const sessionSongs = new Map<string, typeof originalSongs>();

  const router = new Router()
    .get("/", (_request) => {
      return renderPage(<LandingPage />);
    })
    .get("/game", async (ctx: RtContext<unknown>) => {
      const url = new URL(ctx.request.url);
      const sessionId = url.searchParams.get("session") || crypto.randomUUID();
      const answer = url.searchParams.get("answer");
      const showModal = url.searchParams.get("showModal") === "true";
      const lastAnswer = url.searchParams.get("lastAnswer");

      // console.log("Request:", {
      //   url: url.toString(),
      //   sessionId,
      //   answer,
      //   showModal,
      // });

      // Initialize or get game state
      // Initialize shuffled songs for this session if they don't exist
      if (!sessionSongs.has(sessionId)) {
        sessionSongs.set(sessionId, shuffle([...originalSongs]));
      }
      const songs = sessionSongs.get(sessionId)!;

      const gameState = gameStates.get(sessionId) || {
        currentSongIndex: 0,
        score: 0,
        isGameOver: false,
        lastCorrectAnswer: null as string | null,
      };

      // console.log("Current game state:", gameState);

      // Handle answer if provided
      if (answer) {
        const currentSong = songs[gameState.currentSongIndex];
        // console.log("Checking answer:", {
        //   answer,
        //   correctAnswer: currentSong.anime,
        //   currentSongIndex: gameState.currentSongIndex,
        // });

        if (answer === currentSong.anime) {
          // console.log("Correct answer! Adding 100 points");
          gameState.score += 100;
          gameState.currentSongIndex++;

          if (gameState.currentSongIndex >= songs.length) {
            // console.log("Game over! Final score:", gameState.score);
            gameState.isGameOver = true;
          }
        } else {
          // Wrong answer - show modal first
          // console.log("Wrong answer! Setting up modal display");
          gameState.lastCorrectAnswer = currentSong.anime;
          gameStates.set(sessionId, gameState);
          return new Response(null, {
            status: 302,
            headers: {
              "Location":
                `/game?session=${sessionId}&showModal=true&lastAnswer=${
                  encodeURIComponent(answer)
                }&songIndex=${gameState.currentSongIndex}`,
            },
          });
        }
      }

      // Get the song index from URL if showing modal
      const songIndex = showModal
        ? parseInt(url.searchParams.get("songIndex") || "0")
        : gameState.currentSongIndex;
      const currentSong = songIndex < songs.length
        ? {
          ...songs[songIndex],
          choices: generateChoices(songs[songIndex].anime, songs),
        }
        : null;

      // Redirect to game over if we're past the last song
      if (!currentSong && !showModal && !url.searchParams.get("showGameOver")) {
        gameState.isGameOver = true;
        gameStates.set(sessionId, gameState);
        return new Response(null, {
          status: 302,
          headers: {
            "Location": `/game?session=${sessionId}&showGameOver=true`,
          },
        });
      }

      // Show modal for wrong answer first
      if (showModal && lastAnswer && currentSong) {
        // Check if this was the last song
        const isLastSong = songIndex + 1 >= songs.length;

        // Update game state for next navigation
        gameState.currentSongIndex = songIndex + 1;
        gameState.isGameOver = isLastSong;
        gameStates.set(sessionId, gameState);

        // Show modal with appropriate next action
        const nextAction = isLastSong
          ? `/game?session=${sessionId}&showGameOver=true`
          : `/game?session=${sessionId}`;
        const content = (
          <DIV>
            <GameView currentSong={currentSong} score={gameState.score} />
            <Modal
              message={`Sorry, "${lastAnswer}" is incorrect!`}
              correctAnswer={currentSong.anime}
              nextUrl={nextAction}
              imageUrl={currentSong.imageUrl}
            />
          </DIV>
        );
        return renderPage(content);
      }

      // Handle game over after modal is closed
      if (url.searchParams.get("showGameOver") === "true") {
        return renderPage(
          <ScoreView score={gameState.score} totalSongs={songs.length} />,
        );
      }

      // Save game state
      gameStates.set(sessionId, gameState);

      // Ensure we have a valid song
      if (!currentSong) {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": `/game?session=${sessionId}&showGameOver=true`,
          },
        });
      }

      // Render normal game view
      const content = (
        <GameView
          currentSong={currentSong}
          score={gameState.score}
        />
      );

      const page = renderPage(content);

      // Add the onAnswer function to window
      const script = `
        <script>
          (function() {
            // console.log('Setting up _onAnswer function');
            try {
              globalThis._onAnswer = function(choice) {
                // console.log('Choice clicked:', choice);
                const currentSong = ${JSON.stringify(currentSong)};
                // console.log('Current song:', currentSong);
                if (choice === currentSong.anime) {
                  // console.log('Correct answer! Updating state...');
                  fetch('/game?session=${sessionId}&answer=' + encodeURIComponent(choice))
                    .then(() => {
                      // console.log('State updated, redirecting...');
                      window.location.href = '/game?session=${sessionId}';
                    })
                    .catch(error => {
                      // console.error('Error updating state:', error);
                    });
                } else {
                  // console.log('Wrong answer! Showing modal...');
                  window.location.href = '/game?session=${sessionId}&showModal=true&lastAnswer=' + encodeURIComponent(choice) + '&songIndex=${songIndex}';
                }
              };
              // console.log('_onAnswer function is ready');

              // Auto-advance after showing modal
              ${
        showModal
          ? `
                const DISPLAY_TIME = 2000; // Show for 2 seconds
                const FADE_TIME = 300; // Fade out for 0.3 seconds
                
                setTimeout(() => {
                  // Start fade out animation
                  const modal = document.querySelector('.modal-overlay');
                  if (modal) {
                    // console.log('Starting modal fade out');
                    modal.classList.add('fade-out');
                  } else {
                    // console.error('Modal element not found');
                  }
                  
                  // Wait for fade out, then advance to next song
                  setTimeout(() => {
                    // console.log('Moving to next song...');
                    window.location.href = '/game?session=${sessionId}';
                  }, FADE_TIME);
                }, DISPLAY_TIME);
              `
          : ""
      }
            } catch(e) {
              // console.error('Error setting up _onAnswer:', e);
            }
          })();
        </script>
      `;

      // Insert script before closing body tag
      const html = await page.text();
      // console.log("Injecting script into HTML");
      const index = html.lastIndexOf("</body>");
      const newHtml = html.slice(0, index) + script + html.slice(index);

      return new Response(newHtml, {
        headers: { "Content-Type": "text/html" },
      });
    });

  Deno.serve((request) => router.fetch(request));
}

function renderPage(content: string): Response {
  return new Response(
    <Layout>{content}</Layout>,
    { headers: { "Content-Type": "text/html" } },
  );
}

function ScoreView(
  { score, totalSongs }: { score: number; totalSongs: number },
) {
  const styles = `
    .score-container {
      max-width: 800px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
      background: var(--fart-darker-dark-primary);
      border-radius: 1rem;
    }
    .final-score {
      font-size: 3rem;
      color: var(--fart-primary);
      margin: 2rem 0;
      animation: scoreIn 0.5s ease-out;
    }
    .score-message {
      font-size: 1.5rem;
      margin: 1rem 0;
      color: var(--fart-secondary);
    }
    .play-again {
      display: inline-block;
      margin-top: 1rem;
      padding: 1rem 2rem;
      background: var(--fart-primary);
      color: var(--fart-darker-dark-primary);
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    @keyframes scoreIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  const percentage = (score / (totalSongs * 100)) * 100;
  let message = "Pfft... you ain't gassy enough! 💨";
  if (percentage === 100) {
    message =
      "Holy fart! A perfect score! Didn't know you were farty like that! 😏💫";
  } else if (percentage >= 80) {
    message = "You're really ripping through these! What a blast! 💨";
  } else if (percentage >= 60) {
    message = "Not too shabby! You've got some potential toots! 💨";
  }

  return `
    <style>${styles}</style>
    <div class="score-container">
      <div class="final-score">
        Score: ${score} / ${totalSongs * 100}
      </div>
      <div class="score-message">${message}</div>
      <a href="/game" class="play-again">Play Again</a>
      <p>
        <a href="/">Back to Home</a>
      </p>
    </div>
  `;
}
