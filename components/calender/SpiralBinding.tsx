export default function SpiralBinding({ accent }: { accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "8px",
        padding: "0 24px",
        height: "28px",
        background: "#f0ece5",
        borderRadius: "16px 16px 0 0",
        borderBottom: "2px solid #e0dbd3",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Hanging rod */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "20px",
        right: "20px",
        height: "3px",
        background: "#c8c0b8",
        borderRadius: "2px",
        zIndex: 0,
      }} />

      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            zIndex: 1,
            width: "16px",
            height: "20px",
            borderLeft: `2.5px solid #9a9390`,
            borderRight: `2.5px solid #9a9390`,
            borderTop: `2.5px solid #9a9390`,
            borderRadius: "8px 8px 0 0",
            background: `linear-gradient(135deg, #e8e4e0, #d0ccc8)`,
            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.15)`,
          }}
        />
      ))}
    </div>
  );
}