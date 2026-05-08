"use client";

import { useRef, useState } from "react";
import { Loader2, Mic, RotateCcw, Square, Volume2 } from "lucide-react";
import { JarqAvatar, JarqEmotion } from "@/components/JarqAvatar";
import { VoiceChatResponse, VoiceChatStatus, resolveApiUrl, sendVoiceChat } from "@/lib/api";

type VoiceChatProps = {
  userId?: string;
  personaId?: string;
  courseId?: string | null;
  lessonId?: string | null;
};

const statusLabel: Record<VoiceChatStatus, string> = {
  idle: "Готово",
  recording: "Слушаю",
  processing: "Думаю",
  speaking: "Говорю",
};

const emotionClass: Record<string, string> = {
  happy: "bg-mint/20 text-ink",
  serious: "bg-ink text-white",
  funny: "bg-coral/20 text-ink",
  confused: "bg-sky/20 text-ink",
  proud: "bg-mint text-ink",
  calm: "bg-paper text-ink",
};

const emotionLabel: Record<string, string> = {
  happy: "радостно",
  serious: "серьезно",
  funny: "весело",
  confused: "вдумчиво",
  proud: "гордится",
  calm: "спокойно",
};

const isVoiceDemoMode = process.env.NEXT_PUBLIC_VOICE_DEMO_MODE !== "false";

export function VoiceChat({
  userId = "demo-user",
  personaId = "jarq_classic",
  courseId = null,
  lessonId = null,
}: VoiceChatProps) {
  const [status, setStatus] = useState<VoiceChatStatus>("idle");
  const [response, setResponse] = useState<VoiceChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isBusy = status === "processing" || status === "speaking";
  const currentEmotion = (response?.jarq.emotion ?? "calm") as JarqEmotion;

  async function toggleRecording() {
    if (status === "recording") {
      stopRecording();
      return;
    }

    if (isBusy) return;
    await startRecording();
  }

  async function startRecording() {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Запись с микрофона не поддерживается в этом браузере.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        void submitAudio(audioBlob);
        cleanupStream();
      };

      recorder.start();
      setStatus("recording");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось получить доступ к микрофону.");
      cleanupStream();
      setStatus("idle");
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setStatus("processing");
    }
  }

  async function submitAudio(audioBlob: Blob) {
    setStatus("processing");

    if (isVoiceDemoMode) {
      setResponse({
        transcript: "Демо-режим: микрофон записан, но STT/TTS ключи ещё не подключены.",
        jarq: {
          text: "Я слышу, что ты готов тренироваться. Подключим STT/TTS ключи — и я буду отвечать голосом.",
          emotion: "calm",
          tone: "поддерживающе",
          action: "Жду подключение голосовых ключей",
        },
        audio_url: "",
      });
      setStatus("idle");
      return;
    }

    try {
      const voiceResponse = await sendVoiceChat({
        audio: audioBlob,
        userId,
        personaId,
        courseId,
        lessonId,
      });
      setResponse(voiceResponse);
      await playAudio(voiceResponse.audio_url);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Голосовой чат не сработал.");
      setStatus("idle");
    }
  }

  async function playAudio(audioUrl: string) {
    if (!audioUrl) {
      setStatus("idle");
      return;
    }

    const audio = new Audio(resolveApiUrl(audioUrl));
    audioRef.current = audio;
    setStatus("speaking");

    audio.onended = () => setStatus("idle");
    audio.onerror = () => setStatus("idle");

    try {
      await audio.play();
    } catch {
      setStatus("idle");
    }
  }

  function replayVoice() {
    if (!response?.audio_url || isBusy) return;
    void playAudio(response.audio_url);
  }

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }

  return (
    <section className="min-w-0 border-t pt-4 jarq-border">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Голосовой чат</h2>
          <p className="text-sm jarq-muted">{statusLabel[status]}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            response ? emotionClass[response.jarq.emotion] ?? "jarq-soft jarq-text" : "jarq-soft jarq-muted"
          }`}
        >
          {emotionLabel[response?.jarq.emotion ?? "calm"] ?? "спокойно"}
        </span>
      </div>

      {isVoiceDemoMode ? (
        <div className="mt-4 rounded-md border border-cyan-300/25 bg-cyan-300/10 p-3 text-sm leading-5 jarq-text">
          Голос работает в демо-режиме, пока не настроены ключи STT/TTS.
        </div>
      ) : null}

      <div className="mt-4 hidden sm:block">
        <JarqAvatar
          emotion={currentEmotion}
          speaking={status === "speaking"}
          recording={status === "recording"}
          processing={status === "processing"}
        />
      </div>

      <div className="mt-4 grid place-items-center sm:mt-5">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isBusy}
          title={status === "recording" ? "Остановить запись" : "Начать запись"}
          className={`button-lift relative grid h-16 w-16 place-items-center rounded-full text-white shadow-soft transition sm:h-24 sm:w-24 ${
            status === "recording" ? "bg-coral" : "bg-ink hover:bg-ink/90"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {status === "recording" ? (
            <>
              <span className="absolute h-16 w-16 animate-ping rounded-full bg-coral/35 sm:h-24 sm:w-24" />
              <Square className="relative" size={24} />
            </>
          ) : status === "processing" ? (
            <Loader2 className="animate-spin" size={26} />
          ) : (
            <Mic size={28} />
          )}
        </button>
      </div>

      {status === "processing" ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm jarq-muted">
          <Loader2 className="animate-spin" size={16} />
          JARQ думает...
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {response?.transcript ? (
          <div className="min-w-0 rounded-md p-3 jarq-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">Расшифровка</div>
            <p className="mt-1 text-sm leading-6">{response.transcript}</p>
          </div>
        ) : null}

        {response?.jarq.text ? (
          <div className="rounded-md border p-3 jarq-border">
            <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">
                JARQ · {response.jarq.tone}
              </div>
              <div className="text-xs jarq-muted">{response.jarq.action}</div>
            </div>
            <p className="mt-2 text-sm leading-6">{response.jarq.text}</p>
          </div>
        ) : null}

        {error ? <div className="rounded-md bg-purple-400/15 p-3 text-sm jarq-text">{error}</div> : null}
      </div>

      <button
        type="button"
        onClick={replayVoice}
        disabled={!response?.audio_url || isBusy}
        className="button-lift mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-semibold transition hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 jarq-border jarq-soft jarq-text"
      >
        <Volume2 size={17} />
        Повторить голос
        <RotateCcw size={15} />
      </button>
    </section>
  );
}
