"use client";

import { useState } from "react";
import { MonthSelector } from "@/components/MonthSelector";
import { useAuth } from "@/features/auth/useAuth";
import { DepartmentFilter } from "@/features/report/DepartmentFilter";
import { ExportButtons } from "@/features/report/ExportButtons";
import { MonthlyReportTable } from "@/features/report/MonthlyReportTable";
import { useMonthlyReport } from "@/features/report/useReports";

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export default function ReportsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [departmentId, setDepartmentId] = useState("all");

  const selectedMonth = formatMonth(year, month);
  const filterDepartmentId = departmentId === "all" ? undefined : departmentId;

  const { data, isLoading } = useMonthlyReport(selectedMonth, filterDepartmentId);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  if (isAuthLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-6">
        <p className="text-destructive">この機能は管理者のみ利用できます。</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">月次集計レポート</h1>

      <div className="flex flex-wrap items-center gap-4">
        <MonthSelector year={year} month={month} onChange={handleMonthChange} />
        <DepartmentFilter value={departmentId} onChange={setDepartmentId} />
        <ExportButtons month={selectedMonth} departmentId={filterDepartmentId} />
      </div>

      {isLoading ? <div>読み込み中...</div> : <MonthlyReportTable records={data?.records ?? []} />}
    </div>
  );
}
