"use client";

import { useEffect, useMemo, useState } from "react";
import { triviaQuestions } from "@/lib/trivia";

type DailyRitualCheckinProps = {
  priceText: string;
  changeText: string;
  fearGreedValue: number | null;
  fearGreedLabel: string | null;
  halvingDays: number | null;
};

type RitualState = {
  streak: number;
  lastCheckIn: string | null;
  checkIns: string[];
  triviaDate: string | null;
  triviaAnswer: number | null;
  triviaCorrect: number;
};

const STORAGE_KEY = "adidab:ritual";

const defaultState: RitualState = {
  streak: 0,
  lastCheckIn: null,
  checkIns: [],
  triviaDate: null,
  triviaAnswer: null,
  triviaCorrect: 0,
};

function getLocalDateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getWeekDays(date = new Date()) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  return Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    return d;
  });
}

function loadState(): RitualState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as RitualState;
    return {
      ...defaultState,
      ...parsed,
      checkIns: parsed.checkIns ?? [],
    };
  } catch {
    return defaultState;
  }
}

export default function DailyRitualCheckin({
  priceText,
  changeText,
  fearGreedValue,
  fearGreedLabel,
  halvingDays,
}: DailyRitualCheckinProps) {
  const [state, setState] = useState<RitualState>(() =>
    typeof window === "undefined" ? defaultState : loadState()
  );
  const todayKey = getLocalDateKey();
  const questionIndex = getDayOfYear() % triviaQuestions.length;
  const question = triviaQuestions[questionIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const hasCheckedInToday = state.checkIns.includes(todayKey);
  const monthKey = todayKey.slice(0, 7);
  const monthCheckIns = state.checkIns.filter((date) =>
    date.startsWith(monthKey)
  );
  const monthProgress = Math.min(1, monthCheckIns.length / 30);

  const weekDays = getWeekDays();
  const weekMarks = weekDays.map((day) => {
    const key = getLocalDateKey(day);
    return state.checkIns.includes(key);
  });

  const achievements = useMemo(() => {
    const hasJourney =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("adidab:journey"));
    return [
      {
        id: "first-checkin",
        label: "First Check-in",
        unlocked: state.checkIns.length >= 1,
      },
      { id: "streak-7", label: "7-Day Streak", unlocked: state.streak >= 7 },
      { id: "streak-14", label: "14-Day Streak", unlocked: state.streak >= 14 },
      { id: "streak-30", label: "30-Day Streak", unlocked: state.streak >= 30 },
      { id: "goal-set", label: "Stack Goal Set", unlocked: hasJourney },
      {
        id: "trivia-3",
        label: "Trivia Learner",
        unlocked: state.triviaCorrect >= 3,
      },
    ];
  }, [state.checkIns.length, state.streak, state.triviaCorrect]);

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getLocalDateKey(yesterday);
    const newStreak =
      state.lastCheckIn === yesterdayKey ? state.streak + 1 : 1;
    const checkIns = Array.from(
      new Set([...state.checkIns, todayKey])
    ).sort();
    setState((prev) => ({
      ...prev,
      streak: newStreak,
      lastCheckIn: todayKey,
      checkIns,
    }));
  };

  const handleTriviaAnswer = (index: number) => {
    if (state.triviaDate === todayKey) return;
    const correct = index === question.answerIndex;
    setState((prev) => ({
      ...prev,
      triviaDate: todayKey,
      triviaAnswer: index,
      triviaCorrect: correct ? prev.triviaCorrect + 1 : prev.triviaCorrect,
    }));
  };

  const triviaAnswered = state.triviaDate === todayKey;

  return (
    <div className="glass-card gold-glow p-8 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Daily Check-In
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Build the Bitcoin ritual.
          </h2>
        </div>
        <button
          type="button"
          onClick={handleCheckIn}
          className={`rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition ${
            hasCheckedInToday
              ? "border border-white/10 bg-white/5 text-white/60"
              : "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 text-black shadow-premium hover:opacity-90"
          }`}
        >
          {hasCheckedInToday ? "Checked In" : "Mark Today Complete"}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Today&apos;s Briefing
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span>Price</span>
                <span className="text-white">{priceText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>24h Change</span>
                <span className="text-white">{changeText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sentiment</span>
                <span className="text-white">
                  {fearGreedLabel ?? "--"} {fearGreedValue ?? "--"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Halving</span>
                <span className="text-white">
                  {halvingDays !== null ? `${halvingDays} days` : "--"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
              <span>Monthly Progress</span>
              <span>{monthCheckIns.length}/30 days</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500"
                style={{ width: `${Math.round(monthProgress * 100)}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
              {weekMarks.map((done, index) => (
                <span
                  key={weekDays[index].toDateString()}
                  className={done ? "text-amber-300" : "text-white/30"}
                >
                  {weekDays[index].toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Streak
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {state.streak} days
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
              Keep the ritual consistent.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Achievements
            </p>
            <div className="mt-3 grid gap-2">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] ${
                    item.unlocked
                      ? "bg-amber-300/10 text-amber-200"
                      : "text-white/40"
                  }`}
                >
                  <span>{item.label}</span>
                  <span>{item.unlocked ? "Unlocked" : "Locked"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          Daily Trivia
        </p>
        <p className="mt-3 text-lg font-semibold text-white">
          {question.question}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {question.options.map((option, index) => {
            const isSelected = triviaAnswered && state.triviaAnswer === index;
            const isCorrect = triviaAnswered && index === question.answerIndex;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleTriviaAnswer(index)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  triviaAnswered
                    ? isCorrect
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : isSelected
                      ? "border-rose-400/60 bg-rose-400/10 text-rose-200"
                      : "border-white/10 text-white/50"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-amber-300/40"
                }`}
                disabled={triviaAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>
        {triviaAnswered ? (
          <p className="mt-3 text-sm text-white/60">
            {question.explanation}
          </p>
        ) : null}
      </div>
    </div>
  );
}
