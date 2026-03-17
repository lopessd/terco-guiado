"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { RosaryStep } from "@/utils/rosarySteps";

interface UseAudioOptions {
  view: string;
  currentStepIndex: number;
  beadCount: number;
  rosarySteps: RosaryStep[];
  isTransitioning: boolean;
  onNext: () => void;
}

export function useAudio({
  view,
  currentStepIndex,
  beadCount,
  rosarySteps,
  isTransitioning,
  onNext,
}: UseAudioOptions) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const isAudioEnabledRef = useRef(isAudioEnabled);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setIsWaiting(false);
  }, []);

  const speakText = useCallback(
    (step: RosaryStep, beadIdx: number) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsWaiting(false);

      let textToSpeak = step.text;

      if (step.type === "beads" && step.beadIds.length === 3) {
        if (beadIdx === 0)
          textToSpeak =
            "A primeira Ave Maria em honra a Deus Pai que nos criou. " +
            textToSpeak;
        else if (beadIdx === 1)
          textToSpeak =
            "A segunda Ave Maria a Deus Filho que nos remiu. " + textToSpeak;
        else if (beadIdx === 2)
          textToSpeak =
            "A terceira Ave Maria ao Espírito Santo que nos santifica. " +
            textToSpeak;
      } else if (step.type === "meditation") {
        textToSpeak = step.title + ". " + textToSpeak;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;

      utterance.onstart = () => setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
        if (isAudioEnabledRef.current && view === "praying") {
          setIsWaiting(true);
          timeoutRef.current = setTimeout(() => {
            setIsWaiting(false);
            onNextRef.current();
          }, step.pause || 1000);
        }
      };

      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    },
    [view]
  );

  const toggleAutoPlay = useCallback(() => {
    setIsAudioEnabled((prev) => {
      if (prev) stopAudio();
      return !prev;
    });
  }, [stopAudio]);

  useEffect(() => {
    if (isTransitioning) return;

    if (isAudioEnabled && view === "praying") {
      speakText(rosarySteps[currentStepIndex], beadCount);
    } else {
      stopAudio();
    }
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, beadCount, isAudioEnabled, view, isTransitioning]);

  return {
    isAudioEnabled,
    isPlaying,
    isWaiting,
    speakText,
    stopAudio,
    toggleAutoPlay,
  };
}
