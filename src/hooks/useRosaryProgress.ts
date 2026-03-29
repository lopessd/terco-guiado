"use client";

import { useState, useEffect, useMemo } from "react";
import type { RosaryStep } from "@/utils/rosarySteps";
import type { MysteryKey } from "@/data/mysteries";
import type { PlaybackSpeed } from "@/hooks/useAudio";
import { getAudioPath } from "@/utils/audioMapping";

interface Segment {
  audioSrc: string;
  pauseMs: number;
}

function buildSegments(
  rosarySteps: RosaryStep[],
  mysteryKey: MysteryKey,
): Segment[] {
  const segments: Segment[] = [];
  for (const step of rosarySteps) {
    if (step.type === "beads") {
      for (let b = 0; b < step.beadIds.length; b++) {
        segments.push({
          audioSrc: getAudioPath(step, b, mysteryKey),
          pauseMs: step.pause,
        });
      }
    } else {
      segments.push({
        audioSrc: getAudioPath(step, 0, mysteryKey),
        pauseMs: step.pause,
      });
    }
  }
  return segments;
}

function getSegmentIndex(
  rosarySteps: RosaryStep[],
  stepIndex: number,
  beadCount: number,
): number {
  let idx = 0;
  for (let i = 0; i < stepIndex; i++) {
    const step = rosarySteps[i];
    idx += step.type === "beads" ? step.beadIds.length : 1;
  }
  return idx + beadCount;
}

export function useRosaryProgress({
  rosarySteps,
  mysteryKey,
  currentStepIndex,
  beadCount,
  audioProgress,
  pauseProgress,
  playbackSpeed,
}: {
  rosarySteps: RosaryStep[];
  mysteryKey: MysteryKey;
  currentStepIndex: number;
  beadCount: number;
  audioProgress: number;
  pauseProgress: number;
  playbackSpeed: PlaybackSpeed;
}) {
  const [audioDurations, setAudioDurations] = useState<Map<string, number>>(
    new Map(),
  );
  const [durationsLoaded, setDurationsLoaded] = useState(false);

  const segments = useMemo(
    () => buildSegments(rosarySteps, mysteryKey),
    [rosarySteps, mysteryKey],
  );

  // Preload audio metadata to get durations
  useEffect(() => {
    const uniqueSrcs = [...new Set(segments.map((s) => s.audioSrc))];
    const durations = new Map<string, number>();
    let loaded = 0;

    uniqueSrcs.forEach((src) => {
      const audio = new Audio();
      audio.preload = "metadata";
      const onDone = () => {
        loaded++;
        if (loaded === uniqueSrcs.length) {
          setAudioDurations(new Map(durations));
          setDurationsLoaded(true);
        }
      };
      audio.onloadedmetadata = () => {
        durations.set(src, audio.duration);
        onDone();
      };
      audio.onerror = () => {
        durations.set(src, 0);
        onDone();
      };
      audio.src = src;
    });
  }, [segments]);

  const currentSegmentIdx = useMemo(
    () => getSegmentIndex(rosarySteps, currentStepIndex, beadCount),
    [rosarySteps, currentStepIndex, beadCount],
  );

  const { totalTime, elapsedTime, globalProgress } = useMemo(() => {
    if (!durationsLoaded) {
      return { totalTime: 0, elapsedTime: 0, globalProgress: 0 };
    }

    let total = 0;
    let elapsed = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const audioDur =
        (audioDurations.get(seg.audioSrc) ?? 0) / playbackSpeed;
      const pauseDur = seg.pauseMs / 1000;
      const segTotal = audioDur + pauseDur;

      total += segTotal;

      if (i < currentSegmentIdx) {
        // Completed segment
        elapsed += segTotal;
      } else if (i === currentSegmentIdx) {
        // Current segment: partial audio + partial pause
        elapsed += audioProgress * audioDur;
        elapsed += pauseProgress * pauseDur;
      }
    }

    return {
      totalTime: total,
      elapsedTime: elapsed,
      globalProgress: total > 0 ? Math.min(elapsed / total, 1) : 0,
    };
  }, [
    durationsLoaded,
    audioDurations,
    segments,
    currentSegmentIdx,
    audioProgress,
    pauseProgress,
    playbackSpeed,
  ]);

  return { totalTime, elapsedTime, globalProgress, durationsLoaded };
}
