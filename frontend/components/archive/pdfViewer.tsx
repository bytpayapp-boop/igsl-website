"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PdfPreview() {
  const [pdfLink, setPdfLink] = useState('');

  useEffect(() => {
    const pdfLinkData = localStorage.getItem('pdfLink');

    if (pdfLinkData) {
      setPdfLink(pdfLinkData.trim());
      console.log('Document link retrieved:', pdfLinkData);
      return;
    }

    console.log('No PDF found in local storage to be passed to the viewer');
  }, []);

  if (!pdfLink) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        Loading PDF preview...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="w-full h-[500px] md:h-[750px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
        <iframe
          src={pdfLink}
          title="PDF Preview"
          className="h-full w-full"
        />
      </div>

      <a
        href={pdfLink}
        download="document.pdf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => toast.success('Downloading document')}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Download File
      </a>
    </div>
  );
}