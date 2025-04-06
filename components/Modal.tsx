import { DIV, IMG, P, SCRIPT, STYLE } from "@fartlabs/htx";

export interface ModalProps {
  message: string;
  correctAnswer: string;
  nextUrl?: string;
  imageUrl?: string;
}

export function Modal(
  { message, correctAnswer, nextUrl = "/game", imageUrl }: ModalProps,
) {
  const styles = `
    .modal-overlay {
      position: fixed !important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
      opacity: 1;
      transition: opacity 0.3s ease-out;
    }
    .modal-overlay.fade-out {
      opacity: 0;
    }
    .modal-content {
      background: var(--fart-darker-dark-primary);
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      max-width: 90%;
      width: 500px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      animation: slideIn 0.3s ease-out;
      border: 2px solid var(--fart-primary);
    }
    .modal-message {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--fart-primary);
    }
    .correct-answer {
      color: var(--fart-secondary);
      font-size: 1.8rem;
      font-weight: bold;
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .anime-image {
      max-width: 100%;
      max-height: 250px;
      width: auto;
      height: auto;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transform: translateY(10px);
      animation: imageSlideIn 0.6s ease-out 0.2s forwards;
    }
    @keyframes imageSlideIn {
      from { 
        opacity: 0;
        transform: translateY(10px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  return (
    <DIV class="modal-overlay">
      <STYLE>{styles}</STYLE>
      <DIV class="modal-content">
        <DIV class="modal-message">{message}</DIV>
        <DIV class="correct-answer">
          <P>Correct Answer: {correctAnswer}</P>
        </DIV>
        {imageUrl && (
          <IMG class="anime-image" src={imageUrl} alt="Anime visual" />
        )}
      </DIV>
      <SCRIPT>
        {`
        setTimeout(() => {
          document.querySelector('.modal-overlay').classList.add('fade-out');
          document.querySelector('.modal-content').style.transform = 'translateY(20px)';
          setTimeout(() => {
            window.location.href = '${nextUrl}';
          }, 300);
        }, 1500);
      `}
      </SCRIPT>
    </DIV>
  );
}
