"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendanceRecordResponse } from "./attendance-api";

interface EditMemoDialogProps {
  open: boolean;
  record: AttendanceRecordResponse | null;
  onSave: (clockInMemo: string | null, clockOutMemo: string | null) => void;
  onCancel: () => void;
}

export function EditMemoDialog({ open, record, onSave, onCancel }: EditMemoDialogProps) {
  const [clockInMemo, setClockInMemo] = useState(record?.clockInMemo ?? "");
  const [clockOutMemo, setClockOutMemo] = useState(record?.clockOutMemo ?? "");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && record) {
      setClockInMemo(record.clockInMemo ?? "");
      setClockOutMemo(record.clockOutMemo ?? "");
    }
    if (!isOpen) {
      onCancel();
    }
  };

  const handleSave = () => {
    onSave(clockInMemo || null, clockOutMemo || null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>メモ編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clockInMemo">出勤メモ</Label>
            <Input
              id="clockInMemo"
              value={clockInMemo}
              onChange={(e) => setClockInMemo(e.target.value)}
              maxLength={20}
              placeholder="最大20文字"
            />
            <p className="text-xs text-muted-foreground text-right">{clockInMemo.length}/20</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clockOutMemo">退勤メモ</Label>
            <Input
              id="clockOutMemo"
              value={clockOutMemo}
              onChange={(e) => setClockOutMemo(e.target.value)}
              maxLength={20}
              placeholder="最大20文字"
              disabled={!record?.clockOut}
            />
            <p className="text-xs text-muted-foreground text-right">{clockOutMemo.length}/20</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
