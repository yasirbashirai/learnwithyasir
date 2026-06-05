import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Download, RotateCcw, Send,
  Compass, Trophy, Lightbulb, AlertTriangle, ChevronRight, Gauge,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import {
  QUESTIONS, scoreQuiz, profileHeadline, isAnswered, sectionOf, chosenId,
  DIM_META, DIMS,
  type Answers, type AnswerValue, type Question, type QuizResult,
} from "@/data/quiz";
import { saveQuiz, type QuizLead } from "@/lib/quizStore";

type Phase = "intro" | "quiz" | "result";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = phase === "quiz" ? Math.round((step / total) * 100) : phase === "result" ? 100 : 0;
  const cur = answers[q?.id];
  const answered = q ? isAnswered(q, cur) : false;

  // Jump back to the top whenever the question or phase changes. This runs
  // *after* the new content renders (via requestAnimationFrame), which is the
  // part mobile browsers need, calling scrollTo inside the click handler fires
  // before the new question lays out and iOS Safari then ignores it, leaving
  // the user stranded where the "Next" button was.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      // Belt-and-braces for older mobile WebKit, which doesn't always move the
      // window via scrollTo but does respond to these.
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    return () => cancelAnimationFrame(id);
  }, [phase, step]);

  function setAnswer(value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      // Last question, score and show the result preview right away.
      setResult(scoreQuiz(answers));
      setPhase("result");
    }
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
    else setPhase("intro");
  }

  function restart() {
    setAnswers({}); setStep(0); setResult(null);
    setPhase("intro");
  }

  // Optional, the person can choose to send their result to Yasir.
  async function submitToYasir(lead: QuizLead) {
    if (!result) return;
    await saveQuiz({ ...lead, goal: chosenId(answers, "goal") ?? "" }, answers, result);
  }

  return (
    <div className="min-h-screen">
      <Seo
        title="Find Your Skill, Free Skill-Fit Evaluation"
        description="A friendly, mixed-format evaluation that works for anyone, whether you build apps or have never heard the word website. It scores your interests, strengths, values and readiness, then shows the skill that fits you, with a PDF you can download."
        path="/quiz"
      />

      <div className="print:hidden">
        <Navbar />

        {phase !== "intro" && (
          <div className="sticky top-0 z-30 h-1.5 bg-teal/10">
            <motion.div className="h-full bg-gradient-to-r from-teal to-gold"
              animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
        )}

        <main className="px-4 py-10">
          <div className="max-w-3xl mx-auto">

            {/* ===================== INTRO ===================== */}
            {phase === "intro" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/5 px-4 py-1.5 text-sm text-teal font-medium">
                  <Compass className="w-4 h-4" /> Skill-Fit Evaluation
                </div>
                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-ink mt-5 leading-tight">
                  Not sure which skill to learn?<br />
                  <span className="text-teal">Let's figure out what fits you.</span>
                </h1>
                <p className="text-ink/65 text-lg mt-5 max-w-xl mx-auto">
                  This works for everyone, whether you already build things on a computer
                  or you've never even heard the word website. There are no trick questions
                  and no tech knowledge needed. Just answer honestly, and at the end you'll
                  see the skill that truly fits you, plus a PDF you can keep.
                </p>
                <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-sm">
                  {[["🧲", "What you enjoy"], ["💪", "What you're good at"], ["⭐", "What you value"], ["📋", "Your readiness"]].map(([e, t]) => (
                    <div key={t} className="rounded-xl border border-line bg-surface/60 py-3 px-2">
                      <div className="text-xl">{e}</div><div className="text-ink/70 mt-1">{t}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPhase("quiz")} className="btn-primary text-base mt-8 px-7 py-3.5 inline-flex items-center gap-2">
                  Start, it's free <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-ink/40 text-xs mt-4">{total} short questions, about 4 minutes, honest answers give the best result.</p>
              </motion.div>
            )}

            {/* ===================== QUIZ ===================== */}
            {phase === "quiz" && q && (
              <div>
                <div className="flex items-center justify-between text-sm text-ink/50 mb-4">
                  <span>Question {step + 1} of {total}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-2.5 py-1">
                    {sectionOf(q).emoji} {sectionOf(q).label}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={q.id}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}>
                    <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">{q.title}</h2>
                    {q.help && <p className="text-ink/55 mt-2">{q.help}</p>}
                    <div className="mt-6">
                      <QuestionBody q={q} value={cur} onChange={setAnswer} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between">
                  <button onClick={back} className="btn-ghost inline-flex items-center gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={next} disabled={!answered}
                    className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                    {step === total - 1 ? "See my result" : "Next"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {phase === "result" && result && (
              <ResultView result={result} onRestart={restart} onSubmit={submitToYasir} />
            )}
          </div>
        </main>
        <Footer />
      </div>

      {result && <PrintReport result={result} />}
    </div>
  );
}

/* ================================================================== */
/* Question renderers                                                 */
/* ================================================================== */

function QuestionBody({ q, value, onChange }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void }) {
  if (q.type === "rank") return <RankBody q={q} value={value} onChange={onChange} />;
  if (q.type === "rating") return <RatingBody q={q} value={value} onChange={onChange} />;
  if (q.type === "text") return <TextBody q={q} value={value} onChange={onChange} />;
  return <ChoiceBody q={q} value={value} onChange={onChange} />;
}

function ChoiceBody({ q, value, onChange }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void }) {
  const ids = value && value.type === "choices" ? value.ids : [];
  const multi = q.type === "multi";
  function toggle(id: string) {
    if (!multi) return onChange({ type: "choices", ids: [id] });
    const has = ids.includes(id);
    if (has) return onChange({ type: "choices", ids: ids.filter((x) => x !== id) });
    if (q.maxPick && ids.length >= q.maxPick) return;
    onChange({ type: "choices", ids: [...ids, id] });
  }
  return (
    <>
      {multi && q.maxPick && <p className="text-teal text-sm -mt-3 mb-3 font-medium">{ids.length} of {q.maxPick} selected</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {q.choices?.map((c) => {
          const on = ids.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)}
              className={`text-left rounded-2xl border p-4 transition-all flex gap-3 items-start ${
                on ? "border-teal bg-teal/10 shadow-soft -translate-y-0.5" : "border-line bg-surface/60 hover:border-teal/50 hover:-translate-y-0.5"
              }`}>
              {c.emoji && <span className="text-2xl leading-none mt-0.5">{c.emoji}</span>}
              <span className="flex-1">
                <span className="font-semibold text-ink block">{c.label}</span>
                {c.desc && <span className="text-ink/55 text-sm block mt-0.5">{c.desc}</span>}
              </span>
              <span className={`w-5 h-5 rounded-full border grid place-items-center shrink-0 mt-0.5 ${on ? "bg-teal border-teal" : "border-ink/25"}`}>
                {on && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function RankBody({ q, value, onChange }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void }) {
  const order = value && value.type === "rank" ? value.order : [];
  function tap(id: string) {
    if (order.includes(id)) onChange({ type: "rank", order: order.filter((x) => x !== id) });
    else onChange({ type: "rank", order: [...order, id] });
  }
  return (
    <>
      <p className="text-ink/50 text-sm -mt-3 mb-3">Tap in order, 1 means most important. Tap again to undo.</p>
      <div className="grid gap-2.5">
        {q.choices?.map((c) => {
          const rank = order.indexOf(c.id);
          const on = rank >= 0;
          return (
            <button key={c.id} onClick={() => tap(c.id)}
              className={`text-left rounded-2xl border p-4 transition-all flex gap-3 items-center ${
                on ? "border-teal bg-teal/10 shadow-soft" : "border-line bg-surface/60 hover:border-teal/50"
              }`}>
              <span className={`w-8 h-8 rounded-full grid place-items-center shrink-0 font-bold text-sm ${on ? "bg-teal text-white" : "bg-surface border border-ink/20 text-ink/40"}`}>
                {on ? rank + 1 : "•"}
              </span>
              {c.emoji && <span className="text-2xl">{c.emoji}</span>}
              <span className="font-semibold text-ink">{c.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function RatingBody({ q, value, onChange }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void }) {
  const values = value && value.type === "rating" ? value.values : {};
  function rate(itemId: string, n: number) {
    onChange({ type: "rating", values: { ...values, [itemId]: n } });
  }
  const done = Object.keys(values).length;
  return (
    <div className="space-y-4">
      <p className="text-teal text-sm -mt-3 font-medium">{done} of {q.items?.length} rated</p>
      {q.items?.map((item) => (
        <div key={item.id} className="rounded-2xl border border-line bg-surface/60 p-4">
          <p className="text-ink font-medium">{item.text}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-ink/40 hidden sm:inline w-14">Not me</span>
            <div className="flex gap-1.5 flex-1 justify-center">
              {[1, 2, 3, 4, 5].map((n) => {
                const on = values[item.id] === n;
                return (
                  <button key={n} onClick={() => rate(item.id, n)}
                    className={`w-10 h-10 rounded-xl border font-bold transition-all ${
                      on ? "bg-teal border-teal text-white scale-110 shadow-soft" : "border-ink/20 text-ink/50 hover:border-teal/50"
                    }`}>{n}</button>
                );
              })}
            </div>
            <span className="text-xs text-ink/40 hidden sm:inline w-14 text-right">Totally me</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TextBody({ q, value, onChange }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void }) {
  const text = value && value.type === "text" ? value.text : "";
  const tags = value && value.type === "text" ? value.tags : [];
  function setText(t: string) { onChange({ type: "text", text: t, tags }); }
  function toggleTag(id: string) {
    onChange({ type: "text", text, tags: tags.includes(id) ? tags.filter((x) => x !== id) : [...tags, id] });
  }
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={q.placeholder} rows={3}
        className="w-full rounded-2xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 resize-none" />
      {q.tags && (
        <>
          <p className="text-ink/50 text-sm mt-3 mb-2">Tap whatever's closest:</p>
          <div className="flex flex-wrap gap-2">
            {q.tags.map((t) => {
              const on = tags.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleTag(t.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                    on ? "border-teal bg-teal/10 text-teal" : "border-line bg-surface/60 text-ink/70 hover:border-teal/50"
                  }`}>{t.emoji} {t.label}</button>
              );
            })}
          </div>
        </>
      )}
      {q.optional && <p className="text-ink/40 text-xs mt-3">This one's optional, you can skip ahead.</p>}
    </div>
  );
}

/* ================================================================== */
/* Result view                                                        */
/* ================================================================== */

function fitTone(score: number) {
  if (score >= 70) return { label: "Strong fit", cls: "text-teal bg-teal/10 border-teal/30" };
  if (score >= 50) return { label: "Good fit", cls: "text-gold-dark bg-gold/10 border-gold/30" };
  return { label: "Possible fit", cls: "text-ink/60 bg-surface border-line" };
}

function Bars({ data }: { data: Record<string, number> }) {
  return (
    <div className="space-y-2">
      {DIMS.map((d) => (
        <div key={d} className="flex items-center gap-3">
          <span className="w-28 text-sm text-ink/70 shrink-0">{DIM_META[d].emoji} {DIM_META[d].label}</span>
          <div className="flex-1 h-2.5 rounded-full bg-teal/10 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
              initial={{ width: 0 }} animate={{ width: `${data[d]}%` }} transition={{ duration: 0.7, delay: 0.1 }} />
          </div>
          <span className="w-9 text-right text-xs text-ink/50">{data[d]}</span>
        </div>
      ))}
    </div>
  );
}

function ResultView({ result, onRestart, onSubmit }: { result: QuizResult; onRestart: () => void; onSubmit: (lead: QuizLead) => Promise<void> }) {
  const top = result.matches[0];
  const headline = useMemo(() => profileHeadline(result), [result]);
  const sc = result.scorecard;

  const [showForm, setShowForm] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await onSubmit({ name: lead.name.trim(), email: lead.email.trim(), phone: lead.phone.trim() });
    setSending(false);
    setSent(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* hero */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold-dark font-medium">
          <Trophy className="w-4 h-4" /> Here's your result
        </div>
        <div className="text-6xl mt-5">{result.archetype.emoji}</div>
        <h1 className="font-heading font-extrabold text-4xl text-ink mt-3">{result.archetype.title}</h1>
        <p className="text-ink/70 text-lg mt-3 max-w-xl mx-auto">{result.archetype.blurb}</p>
        <p className="text-teal font-medium mt-3 max-w-xl mx-auto">{headline}</p>
      </div>

      {/* scorecard */}
      <div className="mt-10">
        <h3 className="font-heading font-bold text-xl text-ink mb-3 flex items-center gap-2"><Gauge className="w-5 h-5 text-teal" /> Your scorecard</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-line bg-surface/60 p-5">
            <div className="text-sm font-semibold text-ink/80 mb-3">🧲 What you enjoy</div>
            <Bars data={sc.interests} />
          </div>
          <div className="rounded-3xl border border-line bg-surface/60 p-5">
            <div className="text-sm font-semibold text-ink/80 mb-3">💪 What you're naturally good at</div>
            <Bars data={sc.aptitudes} />
          </div>
          <div className="rounded-3xl border border-line bg-surface/60 p-5">
            <div className="text-sm font-semibold text-ink/80 mb-3">⭐ What drives you</div>
            <ol className="space-y-2">
              {sc.values.slice(0, 4).map((v, i) => (
                <li key={v.key} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal/10 text-teal grid place-items-center text-xs font-bold">{i + 1}</span>
                  <span className="text-ink/80">{v.emoji} {v.label}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-line bg-surface/60 p-5">
            <div className="text-sm font-semibold text-ink/80 mb-3">📋 How ready you are to start</div>
            <div className="flex items-end gap-3">
              <div className="text-4xl font-extrabold text-teal">{sc.readiness}<span className="text-lg text-ink/40">/100</span></div>
              <div className="pb-1">
                <div className="inline-block text-xs rounded-full border border-teal/30 bg-teal/10 text-teal px-2 py-0.5 font-medium">{sc.readinessBand.label}</div>
              </div>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-teal/10 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-teal to-gold" initial={{ width: 0 }} animate={{ width: `${sc.readiness}%` }} transition={{ duration: 0.8 }} />
            </div>
            <p className="text-sm text-ink/60 mt-3">{sc.readinessBand.blurb}</p>
          </div>
        </div>
      </div>

      {/* #1 match */}
      <div className="mt-8">
        <h3 className="font-heading font-bold text-xl text-ink mb-3">🎯 Your number one skill match</h3>
        <div className="rounded-3xl border-2 border-teal bg-teal/[0.06] p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{top.icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-heading font-extrabold text-2xl text-ink">{top.title}</h4>
                <span className="text-xs rounded-full border border-teal/30 bg-teal/10 text-teal px-2 py-0.5">{top.level}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-teal/15 overflow-hidden max-w-[200px]">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${top.score}%` }} />
                </div>
                <span className="text-teal font-bold text-sm">{top.score}% fit</span>
              </div>
              {top.reasons.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {top.reasons.map((r) => (
                    <li key={r} className="text-sm text-ink/70 flex items-center gap-1.5"><Check className="w-4 h-4 text-teal shrink-0" /> {r}</li>
                  ))}
                </ul>
              )}
              <Link to={`/courses/${top.slug}`} className="btn-primary text-sm mt-4 inline-flex items-center gap-1.5">
                Explore this course <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* runner-ups */}
      <div className="mt-8">
        <h3 className="font-heading font-bold text-xl text-ink mb-3">Other strong fits for you</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {result.matches.slice(1).map((m) => {
            const tone = fitTone(m.score);
            return (
              <Link key={m.slug} to={`/courses/${m.slug}`} className="rounded-2xl border border-line bg-surface/60 p-4 hover:border-teal/50 hover:-translate-y-0.5 transition-all">
                <div className="text-3xl">{m.icon}</div>
                <div className="font-semibold text-ink mt-2">{m.title}</div>
                <div className={`inline-block text-xs rounded-full border px-2 py-0.5 mt-2 ${tone.cls}`}>{m.score}%, {tone.label}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* path */}
      {result.path && (
        <div className="mt-8 rounded-3xl p-6 text-white" style={{ background: result.path.gradient }}>
          <div className="text-sm font-medium opacity-90">Recommended learning path</div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-4xl">{result.path.icon}</span>
            <div>
              <div className="font-heading font-extrabold text-2xl">{result.path.title}</div>
              <div className="opacity-90 text-sm">{result.path.blurb}</div>
            </div>
          </div>
          <p className="text-sm opacity-90 mt-3">{result.pathReason}</p>
          <Link to="/paths" className="inline-flex items-center gap-1.5 bg-white/95 text-ink font-semibold text-sm rounded-full px-4 py-2 mt-4 hover:bg-white">
            See the full path <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* strengths + watch-outs */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-teal/25 bg-teal/[0.05] p-5">
          <h4 className="font-heading font-bold text-ink flex items-center gap-2"><Lightbulb className="w-5 h-5 text-teal" /> Your strengths</h4>
          <ul className="mt-3 space-y-2">
            {result.archetype.strengths.map((s) => <li key={s} className="text-sm text-ink/75 flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> {s}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-5">
          <h4 className="font-heading font-bold text-ink flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-gold-dark" /> Things to watch</h4>
          <ul className="mt-3 space-y-2">
            {result.archetype.watchOuts.map((s) => <li key={s} className="text-sm text-ink/75 flex gap-2"><ChevronRight className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" /> {s}</li>)}
          </ul>
        </div>
      </div>

      {/* actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button onClick={() => { setShowForm((v) => !v); setSent(false); }} className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <Send className="w-5 h-5" /> Submit to Yasir
        </button>
        <button onClick={() => window.print()} className="btn-ghost inline-flex items-center gap-2">
          <Download className="w-5 h-5" /> Download PDF
        </button>
        <button onClick={onRestart} className="btn-ghost inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Retake
        </button>
      </div>

      {/* submit-to-Yasir form, only when chosen */}
      {showForm && !sent && (
        <motion.form onSubmit={handleSend} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 max-w-lg mx-auto rounded-3xl border border-teal/25 bg-teal/[0.04] p-6 text-left">
          <h4 className="font-heading font-bold text-ink text-lg">Send your result to Yasir</h4>
          <p className="text-ink/60 text-sm mt-1">He'll take a look at your match and can guide you on the right next step. No spam, ever.</p>
          <div className="mt-4 space-y-3">
            <input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Your name"
              className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
            <input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="Email"
              className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
            <input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Phone or WhatsApp (optional)"
              className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full mt-4 py-3 inline-flex items-center justify-center gap-2">
            {sending ? "Sending…" : <>Send to Yasir <Send className="w-4 h-4" /></>}
          </button>
        </motion.form>
      )}

      {sent && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 max-w-lg mx-auto rounded-3xl border border-teal/30 bg-teal/10 p-6 text-center">
          <div className="text-3xl">✅</div>
          <h4 className="font-heading font-bold text-ink text-lg mt-2">Sent, thank you!</h4>
          <p className="text-ink/65 text-sm mt-1">Your result is on its way to Yasir. Feel free to download your PDF too.</p>
        </motion.div>
      )}

      <p className="text-center text-ink/40 text-xs mt-4">Tip, for the PDF choose Save as PDF as the destination in the print dialog.</p>
    </motion.div>
  );
}

/* ================================================================== */
/* Print report (the downloadable PDF, all data arranged)             */
/* ================================================================== */

function PrintReport({ result }: { result: QuizResult }) {
  const top = result.matches[0];
  const sc = result.scorecard;
  const barRow = (label: string, val: number) => (
    <tr key={label}>
      <td style={{ padding: "3px 8px 3px 0", width: "110px" }}>{label}</td>
      <td style={{ padding: "3px 0" }}>
        <div style={{ background: "#E2E8F0", borderRadius: "4px", height: "10px", width: "100%" }}>
          <div style={{ background: "#288672", height: "10px", borderRadius: "4px", width: `${val}%` }} />
        </div>
      </td>
      <td style={{ padding: "3px 0 3px 8px", width: "30px", textAlign: "right" }}>{val}</td>
    </tr>
  );
  return (
    <div id="print-report" className="hidden print:block" style={{ color: "#0F2E27", padding: "22px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ borderBottom: "3px solid #288672", paddingBottom: "10px", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", color: "#A67B30", fontWeight: 700, letterSpacing: "0.5px" }}>SKILL-FIT EVALUATION REPORT</div>
        <div style={{ fontSize: "24px", fontWeight: 800 }}>LearnwithYasir</div>
      </div>

      <h1 style={{ fontSize: "21px", margin: "0 0 4px" }}>{result.archetype.emoji} You are, {result.archetype.title}</h1>
      <p style={{ fontSize: "13px", margin: "0 0 3px" }}>{result.archetype.blurb}</p>
      <p style={{ fontSize: "13px", color: "#288672", fontWeight: 600 }}>{profileHeadline(result)}</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "14px" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "14px", color: "#165A4C", margin: "0 0 4px" }}>What you enjoy</h2>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}><tbody>{DIMS.map((d) => barRow(DIM_META[d].label, sc.interests[d]))}</tbody></table>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "14px", color: "#165A4C", margin: "0 0 4px" }}>What you're good at</h2>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}><tbody>{DIMS.map((d) => barRow(DIM_META[d].label, sc.aptitudes[d]))}</tbody></table>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "14px", color: "#165A4C", margin: "0 0 4px" }}>What you value most</h2>
          <ol style={{ fontSize: "12px", margin: "2px 0", paddingLeft: "18px" }}>{sc.values.slice(0, 3).map((v) => <li key={v.key}>{v.label}</li>)}</ol>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "14px", color: "#165A4C", margin: "0 0 4px" }}>Readiness to start</h2>
          <p style={{ fontSize: "12px", margin: "2px 0" }}><b>{sc.readiness} out of 100, {sc.readinessBand.label}.</b> {sc.readinessBand.blurb}</p>
        </div>
      </div>

      <h2 style={{ fontSize: "15px", marginTop: "14px", color: "#165A4C" }}>Your number one match, {top.icon} {top.title} ({top.score}% fit)</h2>
      <ul style={{ fontSize: "12px", margin: "4px 0" }}>{top.reasons.map((r) => <li key={r}>{r}</li>)}</ul>

      <h2 style={{ fontSize: "14px", marginTop: "10px", color: "#165A4C" }}>Other strong fits</h2>
      <ul style={{ fontSize: "12px", margin: "4px 0" }}>{result.matches.slice(1).map((m) => <li key={m.slug}>{m.title}, {m.score}% ({m.level})</li>)}</ul>

      {result.path && (
        <p style={{ fontSize: "12px", marginTop: "8px" }}><b>Recommended path,</b> {result.path.icon} {result.path.title}, {result.path.blurb}</p>
      )}

      <div style={{ display: "flex", gap: "18px", marginTop: "12px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "13px", color: "#288672", margin: "0 0 4px" }}>Your strengths</h3>
          <ul style={{ fontSize: "12px", margin: 0, paddingLeft: "16px" }}>{result.archetype.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "13px", color: "#A67B30", margin: "0 0 4px" }}>Things to watch</h3>
          <ul style={{ fontSize: "12px", margin: 0, paddingLeft: "16px" }}>{result.archetype.watchOuts.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #E2E8F0", marginTop: "16px", paddingTop: "8px", fontSize: "11px", color: "#64748B" }}>
        Generated by LearnwithYasir, start your match at /courses/{top.slug}
      </div>
    </div>
  );
}
