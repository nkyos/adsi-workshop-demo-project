"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { type Column, DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecordResponse, DailyAttendanceResponse } from "./attendance-api";
import { EditMemoDialog } from "./EditMemoDialog";
import { formatDate, formatMinutes, formatTime } from "./format";
import { useUpdateMemo } from "./useAttendance";

function firstClockIn(day: DailyAttendanceResponse): string {
  const record = day.records[0];
  return record ? formatTime(record.clockIn) : "--:--";
}

function lastClockOut(day: DailyAttendanceResponse): string {
  const last = day.records[day.records.length - 1];
  return last?.clockOut ? formatTime(last.clockOut) : "--:--";
}

function hasCorrected(day: DailyAttendanceResponse): boolean {
  return day.records.some((r) => r.corrected);
}

function getMemo(day: DailyAttendanceResponse): string {
  const parts: string[] = [];
  const first = day.records[0];
  if (first?.clockInMemo) parts.push(first.clockInMemo);
  const last = day.records[day.records.length - 1];
  if (last?.clockOutMemo) parts.push(last.clockOutMemo);
  return parts.join(" / ");
}

interface AttendanceTableProps {
  days: DailyAttendanceResponse[];
}

export function AttendanceTable({ days }: AttendanceTableProps) {
  const [editingRecord, setEditingRecord] = useState<AttendanceRecordResponse | null>(null);
  const updateMemoMutation = useUpdateMemo();

  const columns: Column<DailyAttendanceResponse>[] = [
    {
      key: "date",
      header: "日付",
      render: (day) => formatDate(day.date),
    },
    {
      key: "clockIn",
      header: "出勤",
      render: (day) => firstClockIn(day),
    },
    {
      key: "clockOut",
      header: "退勤",
      render: (day) => lastClockOut(day),
    },
    {
      key: "workMinutes",
      header: "勤務時間",
      render: (day) => (day.workMinutes > 0 ? formatMinutes(day.workMinutes) : "-"),
    },
    {
      key: "breakMinutes",
      header: "休憩",
      render: (day) => (day.breakMinutes > 0 ? formatMinutes(day.breakMinutes) : "-"),
    },
    {
      key: "overtimeMinutes",
      header: "残業",
      render: (day) => (day.overtimeMinutes > 0 ? formatMinutes(day.overtimeMinutes) : "-"),
    },
    {
      key: "memo",
      header: "メモ",
      render: (day) => {
        const memo = getMemo(day);
        const record = day.records[0];
        return (
          <div className="flex items-center gap-1">
            <span className="truncate max-w-[120px]">{memo || "-"}</span>
            {record && (
              <button
                type="button"
                onClick={() => setEditingRecord(record)}
                className="text-muted-foreground hover:text-foreground"
                title="メモ編集"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: "corrected",
      header: "",
      render: (day) => (hasCorrected(day) ? <Badge variant="outline">修正</Badge> : null),
    },
  ];

  const handleSaveMemo = (clockInMemo: string | null, clockOutMemo: string | null) => {
    if (editingRecord) {
      updateMemoMutation.mutate({
        recordId: editingRecord.id,
        clockInMemo,
        clockOutMemo,
      });
    }
    setEditingRecord(null);
  };

  return (
    <>
      <DataTable<DailyAttendanceResponse & Record<string, unknown>>
        columns={columns as Column<DailyAttendanceResponse & Record<string, unknown>>[]}
        data={days as (DailyAttendanceResponse & Record<string, unknown>)[]}
        rowKey={(item) => item.date}
        emptyMessage="勤怠データがありません"
      />
      <EditMemoDialog
        open={editingRecord !== null}
        record={editingRecord}
        onSave={handleSaveMemo}
        onCancel={() => setEditingRecord(null)}
      />
    </>
  );
}
