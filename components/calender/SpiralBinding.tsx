export default function SpiralBinding() {
  return (
    <div
      style={{
        position: "relative",
        height: "28px",
        width: "100%",
        background: "#ede9e3",
        borderBottom: "2px solid #dbd5cc",
        flexShrink: 0,
      }}
    >
      {/* Horizontal wire running the full width */}
      <div
        style={{
          position: "absolute",
          top: "9px",
          left: 0,
          right: 0,
          height: "3px",
          background: "#c5bdb4",
        }}
      />

      {/*
        Coils via repeating CSS background — each coil is 24px wide.
        Fills the full container width automatically at any card size.
        SVG data URI draws one U-shaped coil loop per tile.
      */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20px",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' viewBox='0 0 24 20'%3E%3Crect x='4' y='0' width='16' height='18' rx='6' ry='6' fill='%23e8e3dd' stroke='%23a09890' stroke-width='2.2'/%3E%3Crect x='4' y='10' width='16' height='10' fill='%23e8e3dd'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "left bottom",
        }}
      />
    </div>
  );
}