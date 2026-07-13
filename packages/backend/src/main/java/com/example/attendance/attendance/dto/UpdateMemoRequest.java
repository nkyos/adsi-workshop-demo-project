package com.example.attendance.attendance.dto;

import jakarta.validation.constraints.Size;

public record UpdateMemoRequest(
    @Size(max = 20) String clockInMemo,
    @Size(max = 20) String clockOutMemo
) {}
