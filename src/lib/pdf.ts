/**
 * Skill-Fit report PDF — a single real PDF file used for BOTH the learner's
 * "Download PDF" button and the attachment emailed to Yasir, so they're always
 * identical. Includes the full result AND every question with the person's
 * answer. jsPDF is dynamically imported so it only loads when a report is made.
 */
import {
  DIMS, DIM_META, reportAnswers, profileHeadline,
  type QuizResult, type Answers,
} from "@/data/quiz";

// Brand colours (RGB).
const TEAL: [number, number, number] = [40, 134, 114];
const GOLD: [number, number, number] = [166, 123, 48];
const INK: [number, number, number] = [15, 46, 39];
const GRAY: [number, number, number] = [100, 116, 139];
const LINE: [number, number, number] = [226, 232, 240];

export async function buildResultPdf(
  result: QuizResult,
  answers: Answers,
  opts?: { name?: string; date?: string },
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 16;            // margin
  const W = pageW - M * 2; // usable width
  let y = M;

  const ensure = (h: number) => { if (y + h > pageH - M) { doc.addPage(); y = M; } };
  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);

  const heading = (text: string) => {
    ensure(12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); setColor(TEAL);
    doc.text(text, M, y); y += 6;
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.line(M, y, M + W, y); y += 4;
  };
  const para = (text: string, size = 10, color = INK, gap = 5) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); setColor(color);
    const lines = doc.splitTextToSize(text, W) as string[];
    for (const ln of lines) { ensure(gap); doc.text(ln, M, y); y += gap; }
  };
  const bullet = (text: string, size = 10) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); setColor(INK);
    const lines = doc.splitTextToSize(text, W - 5) as string[];
    lines.forEach((ln, i) => { ensure(5); doc.text(i === 0 ? "•" : " ", M, y); doc.text(ln, M + 4, y); y += 5; });
  };
  const bar = (label: string, val: number) => {
    ensure(6);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); setColor(INK);
    doc.text(label, M, y);
    const bx = M + 42, bw = W - 42 - 12;
    doc.setFillColor(225, 238, 234); doc.roundedRect(bx, y - 3, bw, 3, 1, 1, "F");
    doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]); doc.roundedRect(bx, y - 3, Math.max(0.5, (bw * val) / 100), 3, 1, 1, "F");
    setColor(GRAY); doc.text(String(val), M + W - 8, y);
    y += 6;
  };

  /* ---------- Header ---------- */
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); setColor(GOLD);
  doc.text("SKILL-FIT EVALUATION REPORT", M, y); y += 6;
  doc.setFontSize(20); setColor(INK); doc.text("LearnwithYasir", M, y); y += 5;
  doc.setDrawColor(TEAL[0], TEAL[1], TEAL[2]); doc.setLineWidth(0.8); doc.line(M, y, M + W, y); doc.setLineWidth(0.2);
  y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); setColor(GRAY);
  const meta = [opts?.name ? `Prepared for: ${opts.name}` : null, opts?.date ? `Date: ${opts.date}` : null].filter(Boolean).join("     ");
  if (meta) { doc.text(meta, M, y); y += 6; }

  /* ---------- Archetype ---------- */
  doc.setFont("helvetica", "bold"); doc.setFontSize(15); setColor(INK);
  para(`You are: ${result.archetype.title}`, 15, INK, 7);
  para(result.archetype.blurb, 10, INK, 5);
  para(profileHeadline(result), 10, TEAL, 5);
  y += 2;

  /* ---------- Scorecard ---------- */
  heading("Your scorecard");
  para("What you enjoy", 10, GRAY, 5);
  DIMS.forEach((d) => bar(DIM_META[d].label, result.scorecard.interests[d]));
  y += 1;
  para("What you're naturally good at", 10, GRAY, 5);
  DIMS.forEach((d) => bar(DIM_META[d].label, result.scorecard.aptitudes[d]));
  y += 1;
  para(`What drives you: ${result.scorecard.values.slice(0, 3).map((v) => v.label).join(", ")}`, 10, INK, 5);
  para(`Readiness to start: ${result.scorecard.readiness}/100 (${result.scorecard.readinessBand.label}). ${result.scorecard.readinessBand.blurb}`, 10, INK, 5);
  y += 2;

  /* ---------- Matches ---------- */
  const top = result.matches[0];
  heading("Your number one skill match");
  if (top) {
    para(`${top.title} — ${top.score}% fit (${top.level})`, 12, INK, 6);
    top.reasons.forEach((r) => bullet(r));
  }
  y += 1;
  para("Other strong fits:", 10, GRAY, 5);
  result.matches.slice(1).forEach((m) => bullet(`${m.title} — ${m.score}% (${m.level})`));
  y += 2;

  if (result.path) {
    heading("Recommended learning path");
    para(`${result.path.title} — ${result.path.blurb}`, 10, INK, 5);
    if (result.pathReason) para(result.pathReason, 10, GRAY, 5);
    y += 1;
  }

  /* ---------- Action plan ---------- */
  if (result.actionPlan.length) {
    heading("Your personalised next steps");
    result.actionPlan.forEach((s, i) => bullet(`${i + 1}.  ${s}`));
    y += 1;
  }

  /* ---------- Strengths / watch-outs ---------- */
  heading("Strengths & things to watch");
  para("Your strengths", 10, TEAL, 5);
  result.archetype.strengths.forEach((s) => bullet(s));
  y += 1;
  para("Things to watch", 10, GOLD, 5);
  result.archetype.watchOuts.forEach((s) => bullet(s));
  y += 2;

  /* ---------- Full questions & answers ---------- */
  doc.addPage(); y = M;
  heading("Your full answers");
  para("Every question from the evaluation and exactly how it was answered.", 9, GRAY, 5);
  y += 1;
  reportAnswers(answers).forEach((row, i) => {
    ensure(10);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); setColor(INK);
    const qLines = doc.splitTextToSize(`${i + 1}. ${row.question}`, W) as string[];
    qLines.forEach((ln) => { ensure(5); doc.text(ln, M, y); y += 5; });
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); setColor(TEAL);
    const aLines = doc.splitTextToSize(row.answer, W - 4) as string[];
    aLines.forEach((ln) => { ensure(5); doc.text(ln, M + 4, y); y += 5; });
    y += 2;
  });

  /* ---------- Footer on every page ---------- */
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.line(M, pageH - 10, M + W, pageH - 10);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); setColor(GRAY);
    doc.text("Generated by LearnwithYasir — learnwith.yasirbashir.com", M, pageH - 6);
    doc.text(`${p} / ${pages}`, M + W - 10, pageH - 6);
  }

  return doc;
}

/** Trigger a browser download of the report. */
export async function downloadResultPdf(result: QuizResult, answers: Answers, opts?: { name?: string; date?: string }) {
  const doc = await buildResultPdf(result, answers, opts);
  doc.save("learnwithyasir-skill-fit-report.pdf");
}

/** Same PDF as base64 (no data-URI prefix) for emailing as an attachment. */
export async function resultPdfBase64(result: QuizResult, answers: Answers, opts?: { name?: string; date?: string }): Promise<string> {
  const doc = await buildResultPdf(result, answers, opts);
  const buf = doc.output("arraybuffer") as ArrayBuffer;
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
