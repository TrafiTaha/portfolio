// Shared SVG filters. #wobble gives every line a hand-drawn tremble
// (feTurbulence noise displacing the source); static, so it costs one raster pass.
export default function InkDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute pointer-events-none">
      <defs>
        <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wobble-lg" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* #ink: wobble + slight bleed (blur then re-tighten alpha) + a faint offset duplicate stroke, like a print pass */}
        <filter id="ink" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" result="w" />
          <feGaussianBlur in="w" stdDeviation="0.45" result="b" />
          <feComponentTransfer in="b" result="bleed">
            <feFuncA type="linear" slope="2.2" intercept="-0.25" />
          </feComponentTransfer>
          <feOffset in="w" dx="0.9" dy="0.7" result="off" />
          <feComponentTransfer in="off" result="dup">
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="dup" />
            <feMergeNode in="bleed" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
