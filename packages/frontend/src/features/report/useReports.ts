"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/Toast";
import { downloadCsv, downloadPdf, fetchMonthlyReport } from "./report-api";

const MONTHLY_REPORT_KEY = ["reports", "monthly"] as const;

export function useMonthlyReport(month: string, departmentId?: string) {
  return useQuery({
    queryKey: [...MONTHLY_REPORT_KEY, month, departmentId],
    queryFn: () => fetchMonthlyReport(month, departmentId),
    enabled: !!month,
  });
}

export function useDownloadCsv() {
  return useMutation({
    mutationFn: ({ month, departmentId }: { month: string; departmentId?: string }) =>
      downloadCsv(month, departmentId),
    onSuccess: () => {
      toast.success("CSVをダウンロードしました");
    },
    onError: () => {
      toast.error("CSVのダウンロードに失敗しました");
    },
  });
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: ({ month, departmentId }: { month: string; departmentId?: string }) =>
      downloadPdf(month, departmentId),
    onSuccess: () => {
      toast.success("PDFをダウンロードしました");
    },
    onError: () => {
      toast.error("PDFのダウンロードに失敗しました");
    },
  });
}
