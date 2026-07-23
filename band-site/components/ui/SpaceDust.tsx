export function SpaceDust() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden opacity-[0.15] mix-blend-screen">
      <div 
        className="absolute inset-0 h-[200%] w-full animate-space-dust"
        style={{
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          backgroundSize: '150px 150px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
