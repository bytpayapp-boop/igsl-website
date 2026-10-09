"use client";
import { toast } from 'sonner'

export default function PdfPreview(link) {
  const pdfUrl = link;
   

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* PDF Preview */}
      <div className="w-full h-[500px] md:h-[750px] border rounded-xl overflow-hidden">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          title="PDF Preview"
          className="w-full h-full"
        />
      </div>

      {/* Download Button */}
      <a
      onClick={()=>toast.success('Downloading document')}
        href={pdfUrl}
        download="document.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Download PDF
      </a>
    </div>
  );
}