"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadCsv, useDownloadPdf } from "./useReports";

interface ExportButtonsProps {
  month: string;
  departmentId?: string;
}

export function ExportButtons({ month, departmentId }: ExportButtonsProps) {
  const csvMutation = useDownloadCsv();
  const pdfMutation = useDownloadPdf();

  const handleCsv = () => {
    csvMutation.mutate({ month, departmentId });
  };

  const handlePdf = () => {
    pdfMutation.mutate({ month, departmentId });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCsv} disabled={csvMutation.isPending}>
        <Download className="mr-1 h-4 w-4" />
        {csvMutation.isPending ? "ダウンロード中..." : "CSV"}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePdf} disabled={pdfMutation.isPending}>
        <Download className="mr-1 h-4 w-4" />
        {pdfMutation.isPending ? "ダウンロード中..." : "PDF"}
      </Button>
    </div>
  );
}
