const A4_WIDTH_PX = 794;

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export const generatePDFFromElement = async (
  element: HTMLElement,
  filename: string,
) => {
  if (typeof window === "undefined") return;

  try {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await waitForNextPaint();

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const marginMm = 10;
    const pageWidthMm = pdf.internal.pageSize.getWidth() - marginMm * 2;
    const pageHeightMm = pdf.internal.pageSize.getHeight() - marginMm * 2;
    const pageHeightPx = Math.floor((canvas.width * pageHeightMm) / pageWidthMm);

    let offsetY = 0;
    let pageIndex = 0;

    while (offsetY < canvas.height) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - offsetY);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const context = pageCanvas.getContext("2d");
      if (!context) {
        throw new Error("Could not prepare PDF page canvas.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      context.drawImage(
        canvas,
        0,
        offsetY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight,
      );

      const sliceHeightMm = (sliceHeight * pageWidthMm) / canvas.width;

      if (pageIndex > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        marginMm,
        marginMm,
        pageWidthMm,
        sliceHeightMm,
      );

      offsetY += sliceHeight;
      pageIndex += 1;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("[PDF Generator] PDF generation failed.", error);
    throw error;
  }
};
