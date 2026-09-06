import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import LaunchRemote from "@/pages/launch/LaunchRemote";

vi.mock("@/lib/supabase", () => {
  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null })
    }),
    upsert: vi.fn().mockResolvedValue({ data: [], error: null })
  });
  const mockChannel = vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    send: vi.fn().mockResolvedValue({ status: "ok" })
  });
  return {
    supabase: {
      from: mockFrom,
      channel: mockChannel,
      removeChannel: vi.fn()
    }
  };
});

describe("LaunchRemote Component", () => {
  it("renders LaunchRemote cleanly without any errors", () => {
    const { container } = render(
      <MemoryRouter>
        <LaunchRemote />
      </MemoryRouter>
    );

    // Verify SREC, IEEE SREC, and SNR logos
    expect(screen.getByAltText("SREC")).toBeDefined();
    expect(screen.getByAltText("IEEE SREC")).toBeDefined();
    expect(screen.getByAltText("SNR Trust")).toBeDefined();

    // Verify central Touch to Inaugurate button
    expect(screen.getByText(/TOUCH TO/i)).toBeDefined();

    // Verify small Reset button in header
    expect(screen.getByLabelText(/Reset to Standby/i)).toBeDefined();
    expect(container.innerHTML.length).toBeGreaterThan(500);
  });

  it("handles inauguration trigger button click", () => {
    render(
      <MemoryRouter>
        <LaunchRemote />
      </MemoryRouter>
    );

    const button = screen.getByText(/TOUCH TO/i).closest("button");
    expect(button).toBeDefined();
    fireEvent.click(button);
  });

  it("handles reset button click", () => {
    render(
      <MemoryRouter>
        <LaunchRemote />
      </MemoryRouter>
    );

    const resetBtn = screen.getByLabelText(/Reset to Standby/i);
    expect(resetBtn).toBeDefined();
    fireEvent.click(resetBtn);
  });
});
