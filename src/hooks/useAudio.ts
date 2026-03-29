"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { RosaryStep } from "@/utils/rosarySteps";
import type { MysteryKey } from "@/data/mysteries";
import { getAudioPath } from "@/utils/audioMapping";

export type PlaybackSpeed = 1 | 1.5 | 2;

interface UseAudioOptions {
  view: string;
  currentStepIndex: number;
  beadCount: number;
  rosarySteps: RosaryStep[];
  isTransitioning: boolean;
  onNext: () => void;
  prayerMode: "manual" | "auto";
  mysteryKey: MysteryKey;
}

export function useAudio({
  view,
  currentStepIndex,
  beadCount,
  rosarySteps,
  isTransitioning,
  onNext,
  prayerMode,
  mysteryKey,
}: UseAudioOptions) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [audioProgress, setAudioProgress] = useState(0);
  const [pauseProgress, setPauseProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const isAudioEnabledRef = useRef(isAudioEnabled);
  const onNextRef = useRef(onNext);
  const prayerModeRef = useRef(prayerMode);
  const playbackSpeedRef = useRef(playbackSpeed);

  // Pause tracking refs
  const isWaitingRef = useRef(false);
  const pauseStartRef = useRef(0);
  const pauseDurationMsRef = useRef(0);
  const frozenPauseElapsedRef = useRef(0);
  const wasPausedDuringWaitRef = useRef(false);

  useEffect(() => { isAudioEnabledRef.current = isAudioEnabled; }, [isAudioEnabled]);
  useEffect(() => { onNextRef.current = onNext; }, [onNext]);
  useEffect(() => { prayerModeRef.current = prayerMode; }, [prayerMode]);
  useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);

  // Update playbackRate on existing audio when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const stopProgressTracking = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration && !audio.paused) {
        setAudioProgress(audio.currentTime / audio.duration);
      }
      if (isWaitingRef.current && pauseDurationMsRef.current > 0) {
        const elapsed = performance.now() - pauseStartRef.current;
        setPauseProgress(Math.min(elapsed / pauseDurationMsRef.current, 1));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopProgressTracking]);

  const stopAudio = useCallback(() => {
    stopProgressTracking();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isWaitingRef.current = false;
    wasPausedDuringWaitRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setIsWaiting(false);
    setAudioProgress(0);
    setPauseProgress(0);
  }, [stopProgressTracking]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      stopProgressTracking();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isWaiting) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      frozenPauseElapsedRef.current =
        performance.now() - pauseStartRef.current;
      stopProgressTracking();
      isWaitingRef.current = false;
      setIsWaiting(false);
      setIsPaused(true);
      wasPausedDuringWaitRef.current = true;
    }
  }, [isPlaying, isWaiting, stopProgressTracking]);

  const resumeAudio = useCallback(() => {
    if (!isPaused) return;

    if (wasPausedDuringWaitRef.current) {
      wasPausedDuringWaitRef.current = false;
      const remaining =
        pauseDurationMsRef.current - frozenPauseElapsedRef.current;
      if (remaining <= 0) {
        setIsPaused(false);
        onNextRef.current();
        return;
      }
      // Adjust start time so progress calculation continues smoothly
      pauseStartRef.current =
        performance.now() - frozenPauseElapsedRef.current;
      isWaitingRef.current = true;
      setIsWaiting(true);
      setIsPaused(false);
      startProgressTracking();
      timeoutRef.current = setTimeout(() => {
        isWaitingRef.current = false;
        setIsWaiting(false);
        stopProgressTracking();
        onNextRef.current();
      }, remaining);
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      startProgressTracking();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      setIsPaused(false);
      onNextRef.current();
    }
  }, [isPaused, startProgressTracking, stopProgressTracking]);

  const speakText = useCallback(
    (step: RosaryStep, beadIdx: number) => {
      stopAudio();

      const src = getAudioPath(step, beadIdx, mysteryKey);
      const audio = new Audio(src);
      audio.playbackRate = playbackSpeedRef.current;
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        startProgressTracking();
      };

      audio.onended = () => {
        setIsPlaying(false);
        setAudioProgress(1);
        if (isAudioEnabledRef.current && prayerModeRef.current === "auto") {
          isWaitingRef.current = true;
          setIsWaiting(true);
          setPauseProgress(0);
          pauseStartRef.current = performance.now();
          pauseDurationMsRef.current = step.pause || 1000;
          // Keep RAF running for pause progress tracking
          timeoutRef.current = setTimeout(() => {
            isWaitingRef.current = false;
            setIsWaiting(false);
            setPauseProgress(1);
            stopProgressTracking();
            onNextRef.current();
          }, step.pause || 1000);
        } else {
          stopProgressTracking();
        }
      };

      audio.onerror = () => {
        stopProgressTracking();
        setIsPlaying(false);
      };

      audio.play().catch(() => {
        setIsPlaying(false);
      });
    },
    [mysteryKey, stopAudio, startProgressTracking, stopProgressTracking],
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
    isPaused,
    isWaiting,
    playbackSpeed,
    audioProgress,
    pauseProgress,
    speakText,
    stopAudio,
    pauseAudio,
    resumeAudio,
    toggleAutoPlay,
    setPlaybackSpeed,
    setAudioEnabled: setIsAudioEnabled,
  };
}
