import { DIV, STYLE } from "@fartlabs/htx";

export interface ModalProps {
  message: string;
  correctAnswer: string;
}

export function Modal({ message, correctAnswer }: ModalProps) {
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
      width: 400px;
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
        <DIV class="correct-answer">{correctAnswer}</DIV>
      </DIV>
    </DIV>
  );
}
