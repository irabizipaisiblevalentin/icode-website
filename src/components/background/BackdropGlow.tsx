export function BackdropGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-[38rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 max-w-[120vw]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(61,216,186,0.12), transparent 65%)",
        }}
      />
      <div className="absolute inset-0 noise" />
    </div>
  );
}