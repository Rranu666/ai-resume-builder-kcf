import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import PDFExportModal from "@/components/editor/PDFExportModal";

export default function ATSExportButton({ resume }) {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowExportModal(true)}
        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black gap-2 font-bold"
      >
        <FileDown className="w-4 h-4" />
        Export PDF
      </Button>
      <PDFExportModal open={showExportModal} onOpenChange={setShowExportModal} resume={resume} />
    </>
  );
}