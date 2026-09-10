import { Particles } from "../animations/Particles";

export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 grid-lines mask-fade-y opacity-60" />
      <div
        className="absolute -top-[22rem] left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(61,216,186,0.14), transparent 62%)",
        }}
      />
      <div
        className="absolute top-[38%] -left-[16rem] h-[34rem] w-[34rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(111,140,255,0.1), transparent 62%)",
        }}
      />
      <div
        className="absolute bottom-[-14rem] -right-[14rem] h-[30rem] w-[30rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(61,216,186,0.08), transparent 60%)",
        }}
      />
      <Particles />
      <div className="absolute inset-0 noise" />
    </div>
  );
}