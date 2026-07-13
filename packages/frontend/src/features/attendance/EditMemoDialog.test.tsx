import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditMemoDialog } from "./EditMemoDialog";

afterEach(cleanup);

const baseRecord = {
  id: "record-1",
  workDate: "2025-01-15",
  clockIn: "2025-01-15T00:00:00Z",
  clockOut: "2025-01-15T08:00:00Z",
  corrected: false,
  clockInMemo: "電車遅延",
  clockOutMemo: "早退",
};

describe("EditMemoDialog", () => {
  const defaultProps = {
    open: true,
    record: baseRecord,
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  it("既存のメモが入力欄に表示される", () => {
    render(<EditMemoDialog {...defaultProps} />);

    expect(screen.getByLabelText("出勤メモ")).toHaveValue("電車遅延");
    expect(screen.getByLabelText("退勤メモ")).toHaveValue("早退");
  });

  it("メモを編集して保存するとonSaveが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditMemoDialog {...defaultProps} onSave={onSave} />);

    const clockInInput = screen.getByLabelText("出勤メモ");
    await user.clear(clockInInput);
    await user.type(clockInInput, "寝坊");
    await user.click(screen.getByText("保存"));

    expect(onSave).toHaveBeenCalledWith("寝坊", "早退");
  });

  it("空文字にするとnullでonSaveが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditMemoDialog {...defaultProps} onSave={onSave} />);

    const clockInInput = screen.getByLabelText("出勤メモ");
    await user.clear(clockInInput);
    await user.click(screen.getByText("保存"));

    expect(onSave).toHaveBeenCalledWith(null, "早退");
  });

  it("キャンセルでonCancelが呼ばれる", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<EditMemoDialog {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText("キャンセル"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("退勤前の場合、退勤メモ欄はdisabledになる", () => {
    const recordWithoutClockOut = { ...baseRecord, clockOut: null, clockOutMemo: null };
    render(<EditMemoDialog {...defaultProps} record={recordWithoutClockOut} />);

    expect(screen.getByLabelText("退勤メモ")).toBeDisabled();
  });

  it("maxLength=20で入力制限される", () => {
    render(<EditMemoDialog {...defaultProps} />);

    expect(screen.getByLabelText("出勤メモ")).toHaveAttribute("maxLength", "20");
    expect(screen.getByLabelText("退勤メモ")).toHaveAttribute("maxLength", "20");
  });
});
