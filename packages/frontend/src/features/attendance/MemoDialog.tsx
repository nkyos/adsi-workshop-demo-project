"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface MemoDialogProps {
  open: boolean;
  title: string;
  onConfirm: (memo?: string) => void;
  onCancel: () => void;
}

export function MemoDialog({ open, title, onConfirm, onCancel }: MemoDialogProps) {
  const [memo, setMemo] = useState("");

  const handleConfirm = () => {
    onConfirm(memo.trim() || undefined);
    setMemo("");
  };

  const handleSkip = () => {
    onConfirm(undefined);
    setMemo("");
  };

  const handleCancel = () => {
    setMemo("");
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>メモを入力してください（任意・最大20文字）</DialogDescription>
        </DialogHeader>
        <Input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={20}
          placeholder="例: 電車遅延"
          autoFocus
        />
        <p className="text-xs text-muted-foreground text-right">{memo.length}/20</p>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button variant="outline" onClick={handleSkip}>
            スキップ
          </Button>
          <Button onClick={handleConfirm}>確定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
