"use client";

import { useId, useMemo } from "react";

type SparklineProps = {
  data: number[];
  height?: number;
  className?: string;
};

function buildPath(data: number[], width: number, height: number) {
  if (data.length < 2) {
    return "";
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  return data
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function Sparkline({
  data,
  height = 120,
  className,
}: SparklineProps) {
  const width = 420;
  const path = useMemo(() => buildPath(data, width, height), [data, height]);
  const resolvedClassName = className ?? "h-32";
  const uid = useId();
  const strokeId = `${uid}-sparkline-stroke`;
  const fillId = `${uid}-sparkline-fill`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`${resolvedClassName} w-full`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="100%" stopColor="#f18a3d" />
        </linearGradient>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(244, 176, 58, 0.35)" />
          <stop offset="100%" stopColor="rgba(244, 176, 58, 0)" />
        </linearGradient>
      </defs>
      {path ? (
        <>
          <path
            d={`${path} L ${width} ${height} L 0 ${height} Z`}
            fill={`url(#${fillId})`}
          />
          <path
            d={path}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <rect width="100%" height="100%" fill="transparent" />
      )}
    </svg>
  );
}
