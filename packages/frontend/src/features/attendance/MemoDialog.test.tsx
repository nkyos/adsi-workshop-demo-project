import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoDialog } from "./MemoDialog";

afterEach(cleanup);

describe("MemoDialog", () => {
  const defaultProps = {
    open: true,
    title: "出勤打刻",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("ダイアログが表示される", () => {
    render(<MemoDialog {...defaultProps} />);

    expect(screen.getByText("出勤打刻")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例: 電車遅延")).toBeInTheDocument();
    expect(screen.getByText("0/20")).toBeInTheDocument();
  });

  it("メモを入力して確定するとonConfirmにメモが渡される", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<MemoDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.type(screen.getByPlaceholderText("例: 電車遅延"), "電車遅延");
    await user.click(screen.getByText("確定"));

    expect(onConfirm).toHaveBeenCalledWith("電車遅延");
  });

  it("文字数カウントが更新される", async () => {
    const user = userEvent.setup();
    render(<MemoDialog {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("例: 電車遅延"), "テスト");

    expect(screen.getByText("3/20")).toBeInTheDocument();
  });

  it("スキップボタンでonConfirmにundefinedが渡される", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<MemoDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByText("スキップ"));

    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("キャンセルボタンでonCancelが呼ばれる", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<MemoDialog {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText("キャンセル"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("空白のみのメモは確定時にundefinedになる", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<MemoDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.type(screen.getByPlaceholderText("例: 電車遅延"), "   ");
    await user.click(screen.getByText("確定"));

    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("maxLength=20で入力制限される", () => {
    render(<MemoDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("例: 電車遅延");
    expect(input).toHaveAttribute("maxLength", "20");
  });
});
