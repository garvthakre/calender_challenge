export default function SpiralBinding() {
  return (
    /* spiral bar */
    <div className="relative h-[26px] bg-[#ede9e3] border-b-2 border-[#dbd5cc] flex items-end justify-center gap-[9px] px-6 shrink-0">
      {/* horizontal wire */}
      <div className="absolute top-2 left-5 right-5 h-[3px] bg-[#c5bdb4] rounded-sm" />

      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="relative z-10 w-[15px] h-[18px] border-[2.5px] border-b-0 border-[#a09890] rounded-t-lg"
          style={{
            background: "linear-gradient(135deg, #e8e3dd 0%, #cec8c2 100%)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.15)"
          }}
        />
      ))}
    </div>
  );
}