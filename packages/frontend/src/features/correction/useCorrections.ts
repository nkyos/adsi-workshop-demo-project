"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/Toast";
import { useAuth } from "@/features/auth/useAuth";
import {
  approveCorrection,
  type CorrectionCreateRequest,
  type CorrectionStatus,
  createCorrection,
  fetchCorrections,
  fetchPendingCorrections,
  rejectCorrection,
} from "./correction-api";

const CORRECTIONS_KEY = ["corrections"] as const;
const PENDING_KEY = ["corrections", "pending"] as const;

export function useCorrections(status?: CorrectionStatus) {
  const { user } = useAuth();
  const requesterId = user?.id;

  return useQuery({
    queryKey: [...CORRECTIONS_KEY, requesterId, status],
    queryFn: () => fetchCorrections(requesterId!, status),
    enabled: !!requesterId,
  });
}

export function useCreateCorrection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CorrectionCreateRequest) => createCorrection(user!.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CORRECTIONS_KEY });
      toast.success("修正申請を送信しました");
    },
    onError: () => {
      toast.error("修正申請の送信に失敗しました");
    },
  });
}

export function usePendingCorrections() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...PENDING_KEY, user?.id],
    queryFn: () => fetchPendingCorrections(user!.id),
    enabled: !!user?.isManager,
  });
}

export function useApproveCorrection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, version }: { id: string; version: number }) =>
      approveCorrection(id, user!.id, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_KEY });
      queryClient.invalidateQueries({ queryKey: CORRECTIONS_KEY });
      toast.success("修正申請を承認しました");
    },
    onError: () => {
      toast.error("承認に失敗しました");
    },
  });
}

export function useRejectCorrection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason, version }: { id: string; reason: string; version: number }) =>
      rejectCorrection(id, user!.id, reason, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_KEY });
      queryClient.invalidateQueries({ queryKey: CORRECTIONS_KEY });
      toast.success("修正申請を却下しました");
    },
    onError: () => {
      toast.error("却下に失敗しました");
    },
  });
}
