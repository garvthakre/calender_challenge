export default function SpiralBinding() {
  return (
    <div
      style={{
        position: "relative",
        height: "32px",
        width: "100%",
        background: "#ede9e3",
        borderBottom: "2px solid #dbd5cc",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Horizontal wire running the full width */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "3px",
          background: "#c5bdb4",
          transform: "translateY(-50%)",
        }}
      />

      {/*
        Coils via repeating CSS background — fills entire width at any screen size.
        SVG data URI draws one U-shaped coil loop per tile.
        Using background-size: auto 100% ensures coils scale with height.
      */}
      <div
        style={{
          position: "absolute",
          bottom: "2px",
          left: 0,
          right: 0,
          height: "24px",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='24' viewBox='0 0 28 24'%3E%3Crect x='5' y='2' width='18' height='18' rx='7' ry='7' fill='%23e8e3dd' stroke='%23a09890' stroke-width='2.2'/%3E%3Crect x='5' y='12' width='18' height='12' fill='%23e8e3dd'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center bottom",
          backgroundSize: "28px 100%",
          width: "100%",
        }}
      />
    </div>
  );
}
