import { DIV, H1, P, STYLE } from "@fartlabs/htx";

export function LandingPage() {
  const styles = `
    .landing {
      max-width: 800px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
      background: var(--fart-darker-dark-primary);
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .title {
      font-size: 3.5rem;
      color: var(--fart-primary);
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .subtitle {
      font-size: 1.5rem;
      color: var(--fart-secondary);
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .coming-soon {
      font-size: 1.2rem;
      color: var(--fart-primary);
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 2rem 0;
      border: 1px solid var(--fart-primary);
    }
    .start-button {
      display: inline-block;
      margin-top: 2rem;
      padding: 1rem 2.5rem;
      font-size: 1.4rem;
      background: var(--fart-primary);
      color: var(--fart-darker-dark-primary);
      border: none;
      border-radius: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .start-button:hover {
      background: var(--fart-secondary);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }
  `;

  return (
    <DIV>
      <STYLE>{styles}</STYLE>
      <DIV class="landing">
        <H1 class="title">🎵 Kusai</H1>
        <P class="subtitle">Test your anime music knowledge!</P>
        <P>Guess the anime from its iconic opening and ending themes.</P>
        <P class="coming-soon">
          💨 Coming Soon: Anime songs recreated with fart sounds! 💨
        </P>
        <DIV
          class="start-button"
          onclick={`window.location.href='/game'`}
        >
          Start Game 🎮
        </DIV>
      </DIV>
    </DIV>
  );
}
