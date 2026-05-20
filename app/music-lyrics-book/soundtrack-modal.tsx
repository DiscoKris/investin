"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Track = {
  id: string;
  title: string;
  performer?: string;
  actScene: string;
  src: string;
};

const tracks: Track[] = [
  {
    id: "londoner",
    title: "Londoner Feeling",
    performer: "Full Cast",
    actScene: "Act 2, Scene 1",
    src: "/assets/audio/londoner.mp3",
  },
  {
    id: "rise",
    title: "Rise",
    performer: "Braithwaite",
    actScene: "Act 1, Scene 5",
    src: "/assets/audio/rise.mp3",
  },
  {
    id: "jack",
    title: "You Don't Know Jack",
    performer: "The Students",
    actScene: "Act 1, Scene 3",
    src: "/assets/audio/jack.mp3",
  },
  {
    id: "falling",
    title: "Falling",
    performer: "Blanchard",
    actScene: "Act 1, Scene 6",
    src: "/assets/audio/falling.mp3",
  },
  {
    id: "never",
    title: "Never Getting Over You",
    performer: "Dare",
    actScene: "Act 2, Scene 2",
    src: "/assets/audio/never.mp3",
  },
  {
    id: "tswl",
    title: "To Sir, With Love",
    performer: "Full Cast",
    actScene: "Act 2, Scene 9",
    src: "/assets/audio/tswl.mp3",
  },
];

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function SoundtrackModal() {
  const [open, setOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [currentTimes, setCurrentTimes] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const stopAllTracks = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
    });

    setActiveTrackId(null);
    setCurrentTimes({});
  }, []);

  const closeModal = useCallback(() => {
    stopAllTracks();
    setOpen(false);
  }, [stopAllTracks]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, open]);

  async function toggleTrack(trackId: string) {
    const selectedAudio = audioRefs.current[trackId];

    if (!selectedAudio) {
      return;
    }

    if (activeTrackId === trackId && !selectedAudio.paused) {
      selectedAudio.pause();
      setActiveTrackId(null);
      return;
    }

    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (!audio || id === trackId) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
    });

    try {
      await selectedAudio.play();
      setActiveTrackId(trackId);
    } catch {
      setActiveTrackId(null);
    }
  }

  function updateProgress(trackId: string, value: number) {
    const audio = audioRefs.current[trackId];

    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTimes((previous) => ({ ...previous, [trackId]: value }));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(214,180,103,0.92)] bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_50%_50%,rgba(14,23,17,0.86),rgba(7,12,9,0.96))] shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
      >
        <span className="pointer-events-none absolute inset-[0.5rem] rounded-full border border-[rgba(232,222,203,0.12)]" />
        <span className="pointer-events-none absolute inset-[1.2rem] rounded-full border border-[rgba(200,168,110,0.16)]" />
        <span className="pointer-events-none absolute ml-1 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-[var(--color-gold)] transition duration-300 group-hover:scale-105" />
        <span className="sr-only">Open soundtrack samples</span>
      </button>

      {typeof document !== "undefined" && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,10,8,0.92)] px-4 py-6 backdrop-blur-md sm:py-8">
          <div className="relative w-full max-w-6xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute left-1 top-[-2.75rem] text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)] transition hover:text-[var(--color-gold)]"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-1 top-[-2.75rem] text-[0.82rem] font-medium uppercase tracking-[0.18em] text-[var(--color-cream)] transition hover:text-[var(--color-gold)]"
            >
              Close
            </button>

            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto rounded-[2rem] border border-[rgba(232,222,203,0.14)] bg-[linear-gradient(180deg,rgba(21,29,24,0.98),rgba(11,17,13,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,233,188,0.08),transparent_20%),radial-gradient(circle_at_84%_18%,rgba(214,180,103,0.1),transparent_18%)]" />
              <div className="relative border-b border-[rgba(232,222,203,0.08)] px-5 py-4 text-center sm:px-7 sm:py-5 lg:px-8">
                <h2 className="text-[2rem] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.5rem] lg:text-[3rem]">
                  Sample of Some of the Songs
                </h2>
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-gold)] sm:text-[0.76rem]">
                  Full Score Available Upon Request
                </p>
              </div>

              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:gap-5 lg:p-6">
                {tracks.map((track) => {
                  const isActive = activeTrackId === track.id;
                  const currentTime = currentTimes[track.id] ?? 0;
                  const duration = durations[track.id] ?? 0;
                  const progressMax = duration > 0 ? duration : 1;

                  return (
                    <div
                      key={track.id}
                      className="rounded-[1.5rem] border border-[rgba(232,222,203,0.1)] bg-[linear-gradient(180deg,rgba(35,48,39,0.78),rgba(17,24,19,0.86))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[1.1rem] font-semibold leading-[1.2] text-[var(--color-ivory)] sm:text-[1.2rem]">
                            {track.title}
                          </p>
                          <p className="mt-2 text-[0.82rem] font-medium uppercase tracking-[0.16em] text-[var(--color-gold)]">
                            {track.performer}
                          </p>
                          <p className="mt-1 text-[0.92rem] text-[var(--color-cream)]">
                            {track.actScene}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleTrack(track.id)}
                          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(214,180,103,0.85)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.12),transparent_22%),rgba(8,13,10,0.9)] text-[var(--color-gold)] transition hover:-translate-y-0.5 hover:border-[rgba(214,180,103,1)]"
                          aria-label={isActive ? `Pause ${track.title}` : `Play ${track.title}`}
                        >
                          {isActive ? (
                            <span className="flex gap-1">
                              <span className="h-4 w-1.5 rounded-full bg-current" />
                              <span className="h-4 w-1.5 rounded-full bg-current" />
                            </span>
                          ) : (
                            <span className="ml-0.5 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-current" />
                          )}
                        </button>
                      </div>

                      <div className="mt-5">
                        <audio
                          ref={(node) => {
                            audioRefs.current[track.id] = node;
                          }}
                          src={track.src}
                          preload="metadata"
                          onPlay={() => setActiveTrackId(track.id)}
                          onPause={() => {
                            const audio = audioRefs.current[track.id];

                            if (audio?.ended) {
                              return;
                            }

                            setActiveTrackId((previous) =>
                              previous === track.id ? null : previous
                            );
                          }}
                          onEnded={() => {
                            setActiveTrackId(null);
                            setCurrentTimes((previous) => ({
                              ...previous,
                              [track.id]: 0,
                            }));
                          }}
                          onTimeUpdate={(event) => {
                            const audio = event.currentTarget;
                            const currentTime = Number.isFinite(audio.currentTime)
                              ? audio.currentTime
                              : 0;

                            setCurrentTimes((previous) => ({
                              ...previous,
                              [track.id]: currentTime,
                            }));
                          }}
                          onLoadedMetadata={(event) => {
                            const audio = event.currentTarget;
                            const duration = Number.isFinite(audio.duration)
                              ? audio.duration
                              : 0;

                            setDurations((previous) => ({
                              ...previous,
                              [track.id]: duration,
                            }));
                          }}
                        />

                        <input
                          type="range"
                          min={0}
                          max={progressMax}
                          step={0.1}
                          value={Math.min(currentTime, progressMax)}
                          onChange={(event) =>
                            updateProgress(track.id, Number(event.target.value))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(232,222,203,0.14)] accent-[var(--color-gold)]"
                        />

                        <div className="mt-2 flex items-center justify-between text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-cream)]">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
