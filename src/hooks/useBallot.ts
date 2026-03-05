"use client";

import { useReducer, useEffect, useCallback } from "react";
import { BallotState, Archetype } from "@/types";
import { categories } from "@/data/nominees";
import { computeChaosScore, getSinnersPickCount } from "@/lib/chaos";
import { getSession, saveSession, createSessionId } from "@/lib/session";

type BallotAction =
  | { type: "INIT"; archetype: Archetype; sessionId?: string; picks?: Record<string, string>; currentIndex?: number }
  | { type: "PICK"; categoryId: string; nomineeId: string }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "SUBMIT" }
  | { type: "SET_SCORE"; finalScore: number }
  | { type: "RESET" };

function createInitialState(): BallotState {
  return {
    sessionId: "",
    archetype: "safe-picker",
    picks: {},
    currentIndex: 0,
    chaosScore: 50,
    submitted: false,
  };
}

function ballotReducer(state: BallotState, action: BallotAction): BallotState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        sessionId: action.sessionId ?? createSessionId(),
        archetype: action.archetype,
        picks: action.picks ?? {},
        currentIndex: action.currentIndex ?? 0,
        chaosScore: action.picks ? computeChaosScore(action.picks) : 50,
        submitted: false,
      };

    case "PICK": {
      const newPicks = { ...state.picks, [action.categoryId]: action.nomineeId };
      return {
        ...state,
        picks: newPicks,
        chaosScore: computeChaosScore(newPicks),
      };
    }

    case "NEXT":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, categories.length - 1),
      };

    case "PREV":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case "GO_TO":
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.index, categories.length - 1)),
      };

    case "SUBMIT":
      return { ...state, submitted: true };

    case "SET_SCORE":
      return { ...state, finalScore: action.finalScore };

    case "RESET":
      return {
        ...state,
        picks: {},
        currentIndex: 0,
        chaosScore: 50,
        submitted: false,
      };

    default:
      return state;
  }
}

export function useBallot() {
  const [state, dispatch] = useReducer(ballotReducer, undefined, createInitialState);

  // Sync to localStorage on every state change
  useEffect(() => {
    if (!state.sessionId) return;
    saveSession({
      sessionId: state.sessionId,
      archetype: state.archetype,
      picks: state.picks,
      currentIndex: state.currentIndex,
      submitted: state.submitted,
      finalScore: state.finalScore,
    });
  }, [state]);

  const init = useCallback(
    (archetype: Archetype) => {
      const existing = getSession();
      if (existing && existing.archetype && !existing.submitted) {
        dispatch({
          type: "INIT",
          archetype: existing.archetype,
          sessionId: existing.sessionId,
          picks: existing.picks,
          currentIndex: existing.currentIndex,
        });
      } else {
        dispatch({ type: "INIT", archetype });
      }
    },
    []
  );

  const pick = useCallback(
    (categoryId: string, nomineeId: string) => {
      dispatch({ type: "PICK", categoryId, nomineeId });
    },
    []
  );

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const goTo = useCallback((index: number) => dispatch({ type: "GO_TO", index }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const setScore = useCallback(
    (finalScore: number) => dispatch({ type: "SET_SCORE", finalScore }),
    []
  );

  const currentCategory = categories[state.currentIndex];
  const pickCount = Object.keys(state.picks).length;
  const isComplete = pickCount >= categories.length;
  const sinnersPickCount = getSinnersPickCount(state.picks);

  return {
    state,
    currentCategory,
    pickCount,
    isComplete,
    sinnersPickCount,
    init,
    pick,
    next,
    prev,
    goTo,
    reset,
    submit,
    setScore,
  };
}
