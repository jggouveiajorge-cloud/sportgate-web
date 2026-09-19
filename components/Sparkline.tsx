interface SparklineProps {
  values: number[];
  className?: string;
}

/**
 * Perfil de elevación ilustrativo: una sola serie, sin ejes ni leyenda (no
 * hace falta con un único trazo), extremos redondeados y área de relleno muy
 * sutil para dar sensación de "terreno" sin competir con el número real.
 */
export function Sparkline({ values, className }: SparklineProps) {
  const w = 300;
  const h = 64;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label="Perfil de elevación ilustrativo del reto"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" stroke="none" />
      <path d={linePath} fill="none" stroke="#2dd4bf" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
