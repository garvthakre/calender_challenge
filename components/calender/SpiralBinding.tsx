export default function SpiralBinding() {
  return (
    <div className="spiral-bar">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="spiral-coil" />
      ))}
    </div>
  );
}