import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

let todayStatusData: { status: string; records: unknown[] } | undefined;

vi.mock("@/features/auth/useAuth", () => ({
  useAuth: () => ({ user: { id: "test-user-id" }, isLoading: false, isAuthenticated: true }),
}));

vi.mock("./useAttendance", () => ({
  useTodayStatus: () => ({
    get data() {
      return todayStatusData;
    },
    isLoading: false,
  }),
  useClockIn: () => ({ mutate: vi.fn(), isPending: false }),
  useClockOut: () => ({ mutate: vi.fn(), isPending: false }),
}));

import { ClockButtons } from "./ClockButtons";

afterEach(() => {
  cleanup();
  todayStatusData = undefined;
});

function getClockInButton() {
  const buttons = screen.getAllByRole("button");
  const btn = buttons.find((b) => b.textContent?.includes("出勤"));
  if (!btn) throw new Error("出勤ボタンが見つかりません");
  return btn;
}

function getClockOutButton() {
  const buttons = screen.getAllByRole("button");
  const btn = buttons.find(
    (b) => b.textContent?.includes("退勤") && !b.textContent?.includes("退勤済み")
  );
  if (!btn) throw new Error("退勤ボタンが見つかりません");
  return btn;
}

describe("ClockButtons", () => {
  describe("出勤ボタンの活性制御", () => {
    it("未出勤(NOT_CLOCKED_IN)の場合、出勤ボタンが有効である", () => {
      todayStatusData = { status: "NOT_CLOCKED_IN", records: [] };

      render(<ClockButtons />);

      expect(getClockInButton()).not.toBeDisabled();
    });

    it("勤務中(CLOCKED_IN)の場合、出勤ボタンが無効である", () => {
      todayStatusData = {
        status: "CLOCKED_IN",
        records: [{ clockIn: "2025-01-15T00:00:00Z", clockOut: null }],
      };

      render(<ClockButtons />);

      expect(getClockInButton()).toBeDisabled();
    });

    it("退勤済み(CLOCKED_OUT)の場合、出勤ボタンが無効である", () => {
      todayStatusData = {
        status: "CLOCKED_OUT",
        records: [{ clockIn: "2025-01-15T00:00:00Z", clockOut: "2025-01-15T09:00:00Z" }],
      };

      render(<ClockButtons />);

      expect(getClockInButton()).toBeDisabled();
    });
  });

  describe("退勤ボタンの活性制御", () => {
    it("勤務中(CLOCKED_IN)の場合、退勤ボタンが有効である", () => {
      todayStatusData = {
        status: "CLOCKED_IN",
        records: [{ clockIn: "2025-01-15T00:00:00Z", clockOut: null }],
      };

      render(<ClockButtons />);

      expect(getClockOutButton()).not.toBeDisabled();
    });

    it("未出勤(NOT_CLOCKED_IN)の場合、退勤ボタンが無効である", () => {
      todayStatusData = { status: "NOT_CLOCKED_IN", records: [] };

      render(<ClockButtons />);

      expect(getClockOutButton()).toBeDisabled();
    });
  });
});
