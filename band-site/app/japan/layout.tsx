import type { ReactNode } from "react";

export default function JapanLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        #echoes-gekirin > div.pointer-events-none.absolute.inset-0.z-0.overflow-hidden > div:nth-child(1),
        #echoes-gekirin > div.pointer-events-none.absolute.inset-0.z-0.overflow-hidden > div:nth-child(2),
        #echoes-gekirin > div.pointer-events-none.absolute.inset-0.z-0.overflow-hidden > div:nth-child(3) {
          display: none !important;
        }

        #echoes-gekirin::before,
        #echoes-gekirin::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: 0;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          filter: drop-shadow(16px 24px 24px rgba(0,0,0,.88));
        }

        #echoes-gekirin::before {
          width: min(500px, 43vw);
          aspect-ratio: 1 / 1;
          left: max(-7vw, calc(50% - 710px));
          top: 48px;
          background-image: url('/japan/echoes-unearthed-exact.png');
          transform: rotate(-8deg);
        }

        #echoes-gekirin::after {
          width: min(760px, 56vw);
          aspect-ratio: 1672 / 941;
          right: max(-20vw, calc(50% - 860px));
          top: 64px;
          background-image: url('/japan/gekirin-ticket-exact.png');
          transform: rotate(7deg);
          opacity: .9;
        }

        @media (max-width: 640px) {
          #echoes-gekirin::before {
            width: 72vw;
            left: -22vw;
            top: 32px;
          }

          #echoes-gekirin::after {
            width: 108vw;
            right: -46vw;
            top: 40px;
            opacity: .8;
          }
        }
      `}</style>
      {children}
    </>
  );
}
