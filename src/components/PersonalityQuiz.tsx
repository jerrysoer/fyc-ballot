"use client";

import { useState } from "react";
import { Archetype } from "@/types";
import { quizQuestions, computeArchetype } from "@/data/quiz";
import { archetypeReveals } from "@/data/copy";
import { trackEvent } from "@/lib/analytics";

interface PersonalityQuizProps {
  onComplete: (archetype: Archetype) => void;
}

export default function PersonalityQuiz({ onComplete }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Archetype[]>([]);
  const [reveal, setReveal] = useState<Archetype | null>(null);

  const question = quizQuestions[currentQuestion];

  function handleAnswer(archetype: Archetype) {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const result = computeArchetype(newAnswers);
      setReveal(result);
      trackEvent("quiz-completed", { archetype: result });
    }
  }

  if (reveal) {
    const info = archetypeReveals[reveal];
    return (
      <div className="animate-fade-in-up text-center max-w-lg mx-auto">
        <p className="text-sm font-mono text-muted uppercase tracking-widest mb-4">
          Your archetype
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-3">
          {info.title}
        </h2>
        <p className="font-serif italic text-lg text-gold mb-6">
          {info.tagline}
        </p>
        <p className="text-muted leading-relaxed mb-10">
          {info.description}
        </p>
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gold/20 rounded-lg blur-sm" />
          <button
            onClick={() => onComplete(reveal)}
            className="relative px-8 py-4 bg-gold text-white font-semibold rounded-lg
                       hover:bg-gold/90 transition-colors min-h-[48px]"
          >
            Fill Out Your Ballot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex gap-2 mb-8">
        {quizQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentQuestion ? "bg-gold" : "bg-border"
            }`}
          />
        ))}
      </div>

      <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">
        Question {currentQuestion + 1} of {quizQuestions.length}
      </p>

      <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8 animate-fade-in">
        {question.question}
      </h2>

      <div className="space-y-3 animate-fade-in-up">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option.archetype)}
            className="w-full text-left p-4 rounded-xl border border-border bg-card-bg
                       hover:border-gold hover:bg-gold-dim transition-all min-h-[48px]
                       active:scale-[0.98]"
          >
            <span className="text-ink">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
