"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const quickQuestions = [
  "How do I submit my music?",
  "What are the service tiers?",
  "Where is the Artist Services page?",
  "How much does Starter cost?",
  "What is included in Pro?",
  "How does a Single Release Partnership work?",
  "Do you guarantee streams or playlists?",
  "What kind of artists do you accept?",
  "How do I contact the label?"
];

const greeting =
  "Hi - I am the KAMDRIDI RECORDS Assistant. I can answer questions about submissions, Starter/Pro/Premium artist services, selected partnerships, releases, and contact details.";

const submitHref = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";

function containsSubmitInfo(content: string) {
  const text = content.toLowerCase();
  return text.includes("kamdridi@proton.me") || text.includes("submit music");
}

function MessageText({ content }: { content: string }) {
  const parts = content.split(/(kamdridi@proton\.me)/g);

  return (
    <p className="whitespace-pre-wrap text-sm leading-6">
      {parts.map((part, index) =>
        part === "kamdridi@proton.me" ? (
          <a key={`${part}-${index}`} href={submitHref} className="font-bold text-[#f4c66a] underline decoration-[#f4c66a]/40 underline-offset-4">
            {part}
          </a>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </p>
  );
}

export function LabelAssistantChat({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const visibleMessages = useMemo(() => messages.slice(-10), [messages]);

  async function ask(question: string) {
    const cleanQuestion = question.trim().slice(0, 900);
    if (!cleanQuestion || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: cleanQuestion }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/label-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const payload = (await response.json()) as { reply?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.reply || "I can help with submissions, pricing, packages, partnerships, and label questions."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not reach the assistant route. You can submit music directly at kamdridi@proton.me."
        }
      ]);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: "smooth" }), 60);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <>
      {!embedded ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-[70] rounded-full border border-[#f4c66a]/45 bg-[#0b0704]/95 px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] shadow-[0_18px_70px_rgba(0,0,0,.55)] backdrop-blur-xl transition hover:border-[#f4c66a] hover:bg-[#f4c66a] hover:text-black"
        >
          Ask the Label Assistant
        </button>
      ) : null}

      {isOpen ? (
        <div className={embedded ? "w-full" : "fixed inset-x-3 bottom-3 z-[80] md:inset-auto md:bottom-5 md:right-5 md:w-[420px]"}>
          <div className="overflow-hidden rounded-[1.5rem] border border-[#f4c66a]/30 bg-[#080503]/96 shadow-[0_30px_110px_rgba(0,0,0,.65)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#f4c66a]/15 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,.16),transparent_38%),rgba(0,0,0,.4)] px-5 py-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white">KAMDRIDI RECORDS Assistant</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#f4c66a]">Artist submissions / pricing / label questions</p>
              </div>
              {!embedded ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-stone-600/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-stone-300 hover:border-[#f4c66a] hover:text-[#f4c66a]"
                >
                  Close
                </button>
              ) : null}
            </div>

            <div ref={panelRef} className="max-h-[46vh] space-y-3 overflow-y-auto px-4 py-4 md:max-h-[420px]">
              {visibleMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[88%] rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/12 px-4 py-3 text-stone-100"
                      : "max-w-[92%] rounded-2xl border border-stone-700/60 bg-black/35 px-4 py-3 text-stone-300"
                  }
                >
                  <MessageText content={message.content} />
                  {message.role === "assistant" && containsSubmitInfo(message.content) ? (
                    <a
                      href={submitHref}
                      className="mt-3 inline-flex rounded-full bg-[#f4c66a] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-black"
                    >
                      Submit Music
                    </a>
                  ) : null}
                </div>
              ))}
              {isLoading ? (
                <div className="max-w-[92%] rounded-2xl border border-stone-700/60 bg-black/35 px-4 py-3 text-sm text-stone-500">
                  Thinking through the label info...
                </div>
              ) : null}
            </div>

            <div className="border-t border-[#f4c66a]/15 px-4 py-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void ask(question)}
                    className="shrink-0 rounded-full border border-[#f4c66a]/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f4c66a] hover:bg-[#f4c66a] hover:text-black"
                  >
                    {question}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, 900))}
                  placeholder="Ask about submissions, pricing, or label deals..."
                  className="min-w-0 flex-1 rounded-full border border-stone-700 bg-black/45 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 focus:border-[#f4c66a]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
