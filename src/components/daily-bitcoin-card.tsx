"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatPercent, formatUsd } from "@/lib/market";

type DailyBitcoinCardProps = {
  price: number | null;
  change24h: number | null;
  fearGreedValue: number | null;
  fearGreedLabel: string | null;
  halvingDays: number | null;
};

export default function DailyBitcoinCard({
  price,
  change24h,
  fearGreedValue,
  fearGreedLabel,
  halvingDays,
}: DailyBitcoinCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const title = "Adidab Daily Bitcoin";
  const priceText = price ? formatUsd(price, 2) : "--";
  const changeText =
    change24h !== null ? formatPercent(change24h) : "--";
  const sentimentText =
    fearGreedValue !== null && fearGreedLabel
      ? `${fearGreedLabel} ${fearGreedValue}`
      : "--";

  const halvingText =
    halvingDays !== null ? `${halvingDays} days` : "--";

  const canvasSize = useMemo(() => ({ width: 1200, height: 630 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1b1b1f");
    gradient.addColorStop(0.45, "#121214");
    gradient.addColorStop(1, "#0b0b0d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(244, 176, 58, 0.08)";
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.2, 260, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 210, 122, 0.12)";
    ctx.beginPath();
    ctx.ellipse(width * 0.8, height * 0.15, 240, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(244, 176, 58, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.fillStyle = "#f4b03a";
    ctx.font = "600 24px SF Pro Display, -apple-system, sans-serif";
    ctx.fillText(title, 80, 110);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 64px SF Pro Display, -apple-system, sans-serif";
    ctx.fillText(priceText, 80, 200);

    ctx.fillStyle = change24h !== null && change24h >= 0 ? "#4de2b1" : "#f87171";
    ctx.font = "600 28px SF Pro Display, -apple-system, sans-serif";
    ctx.fillText(changeText, 80, 245);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "500 20px SF Pro Text, -apple-system, sans-serif";
    ctx.fillText("24h Change", 80, 275);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 34px SF Pro Display, -apple-system, sans-serif";
    ctx.fillText(`Sentiment: ${sentimentText}`, 80, 360);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 34px SF Pro Display, -apple-system, sans-serif";
    ctx.fillText(`Next Halving: ${halvingText}`, 80, 420);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "500 20px SF Pro Text, -apple-system, sans-serif";
    ctx.fillText("adidab.com", 80, 520);

  }, [
    canvasSize.height,
    canvasSize.width,
    change24h,
    changeText,
    halvingText,
    priceText,
    sentimentText,
    title,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "adidab-daily-bitcoin.png";
    link.click();
  };

  return (
    <div className="glass-card gold-glow p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Daily Bitcoin Card
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Share your daily ritual.
          </h3>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
        >
          Download Card
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-4">
        <canvas
          ref={canvasRef}
          className="h-auto w-full rounded-xl"
          aria-label="Daily Bitcoin share card"
        />
      </div>
    </div>
  );
}
