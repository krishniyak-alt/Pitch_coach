import { ParsedSlide } from "./types";

/**
 * Parses an uploaded PDF file in the browser, extracts text per slide,
 * generates rendered thumbnail canvas previews, and computes pacing allocations.
 */
export async function parsePdfDeck(
  file: File,
  targetTotalSec: number = 180
): Promise<{ slides: ParsedSlide[]; base64: string }> {
  const arrayBuffer = await file.arrayBuffer();

  // Convert arrayBuffer to base64 for multimodal analysis if needed
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof window !== "undefined" ? window.btoa(binary) : "";

  // Dynamic import pdfjs-dist on client
  const pdfjs = await import("pdfjs-dist");

  // Configure worker
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "4.10.38"}/build/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const slides: ParsedSlide[] = [];

  // Default time distribution weighting (intro/hook ~15%, middle slides ~60%, close/demo ~25%)
  const defaultAlloc = Math.round(targetTotalSec / Math.max(1, numPages));

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // 1. Extract text content
    const textContent = await page.getTextContent();
    const rawLines: string[] = [];
    let currentLine = "";

    // Group items into text lines
    for (const item of textContent.items as Array<{ str?: string; hasEOL?: boolean }>) {
      if (item.str) {
        currentLine += (currentLine ? " " : "") + item.str.trim();
        if (item.hasEOL) {
          if (currentLine) rawLines.push(currentLine);
          currentLine = "";
        }
      }
    }
    if (currentLine) rawLines.push(currentLine);

    const cleanLines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0);
    const fullText = cleanLines.join("\n");

    const title = cleanLines[0] || `Slide ${pageNum}`;
    const subtitle = cleanLines.length > 1 ? cleanLines[1] : `Key details for Slide ${pageNum}`;
    const keyPoints = cleanLines.length > 2
      ? cleanLines.slice(2, 6)
      : [cleanLines[1] || "Overview and core message."];

    // 2. Render preview thumbnail to offscreen canvas
    let thumbnailUrl: string | undefined = undefined;
    try {
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await (page as any).render({
          canvasContext: ctx,
          viewport: viewport,
          canvas: canvas,
        }).promise;
        thumbnailUrl = canvas.toDataURL("image/jpeg", 0.85);
      }
    } catch (renderErr) {
      console.warn("Could not render slide canvas thumbnail:", renderErr);
    }

    slides.push({
      id: pageNum,
      pageNumber: pageNum,
      title: title.length > 90 ? title.substring(0, 90) + "..." : title,
      subtitle: subtitle.length > 120 ? subtitle.substring(0, 120) + "..." : subtitle,
      text: fullText || `Slide ${pageNum} visual content`,
      keyPoints: keyPoints.map((p) => (p.length > 110 ? p.substring(0, 110) + "..." : p)),
      allocatedTime: defaultAlloc,
      actualTime: 0,
      visualTag: pageNum === 1 ? "Problem & Hook" : pageNum === numPages ? "Vision & Ask" : "Solution & Architecture",
      thumbnailUrl,
    });
  }

  return { slides, base64 };
}
