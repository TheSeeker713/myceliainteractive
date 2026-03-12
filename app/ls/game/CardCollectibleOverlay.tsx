"use client";

export function CardCollectibleOverlay({
  showCard,
  demoEnded,
  cardCollecting,
  cardLabelVisible,
  cardId,
  onCollect,
}: {
  showCard: boolean;
  demoEnded: boolean;
  cardCollecting: boolean;
  cardLabelVisible: boolean;
  cardId: "card1" | "card2";
  onCollect: () => void;
}) {
  if (!showCard || demoEnded) return null;

  const rank = cardId === "card1" ? "J" : "Q";
  const suit = cardId === "card1" ? "♣" : "♠";
  const cardLabel = cardId === "card1" ? "Jack of Clubs" : "Queen of Spades";

  return (
    <div
      className="absolute bottom-8 right-8 z-[45] flex flex-col items-center gap-3 pointer-events-auto"
      style={{
        animation: cardCollecting
          ? "card-slide-out 0.5s ease-in forwards"
          : undefined,
      }}
      onClick={onCollect}
    >
      <div
        style={{
          animation: cardCollecting
            ? undefined
            : "card-glow-pulse 1.8s ease-in-out infinite",
          cursor: "pointer",
        }}
      >
        <svg
          width="80"
          height="112"
          viewBox="0 0 80 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={cardLabel}
        >
          <rect
            width="80"
            height="112"
            rx="6"
            fill="#0e0e1a"
            stroke="rgba(139,44,245,0.7)"
            strokeWidth="1.5"
          />
          <text
            x="6"
            y="16"
            fill="white"
            fontFamily="serif"
            fontSize="12"
            fontWeight="bold"
          >
            {rank}
          </text>
          <text x="6" y="28" fill="white" fontFamily="serif" fontSize="10">
            {suit}
          </text>
          <text
            x="40"
            y="68"
            fill="white"
            fontFamily="serif"
            fontSize="48"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {suit}
          </text>
        </svg>
      </div>

      {cardLabelVisible && !cardCollecting && (
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase"
          style={{
            color: "rgba(192,132,252,0.8)",
            animation: "hint-fade-in 0.8s ease-in forwards",
          }}
        >
          pick it up?
        </p>
      )}
    </div>
  );
}
