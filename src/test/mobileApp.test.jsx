import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import MobileAppPage from "@/pages/mobile/MobileAppPage";

// Mock Supabase calls in testing environment
vi.mock("@/lib/supabase", () => {
  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      then: vi.fn((resolve) => resolve({ data: [], error: null }))
    })
  });
  const mockStorage = {
    from: vi.fn().mockReturnValue({
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/photo.jpg" } })
    })
  };
  return {
    supabase: {
      from: mockFrom,
      storage: mockStorage
    }
  };
});

describe("MobileAppPage Rendering & Tabs", () => {
  it("renders MobileAppPage Feed/Home dashboard cleanly", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/?tab=home"]}>
        <MobileAppPage defaultTab="home" />
      </MemoryRouter>
    );

    // Verify top header brand
    expect(screen.getByText("SB 64581")).toBeDefined();
    // Verify hero welcome banner
    expect(screen.getByText("IEEE Student Branch SREC")).toBeDefined();
    // Verify quick action cards & flagship conference
    expect(screen.getByText("AECTSD 2027: International Conference")).toBeDefined();
    // Verify bottom nav items
    expect(screen.getByText("Feed")).toBeDefined();
    expect(screen.getAllByText("Societies").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Digital ID").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Events").length).toBeGreaterThan(0);
    expect(screen.getByText("Explore")).toBeDefined();

    expect(container.innerHTML.length).toBeGreaterThan(1000);
  });

  it("renders Events tab without errors", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=events"]}>
        <MobileAppPage defaultTab="events" />
      </MemoryRouter>
    );

    expect(screen.getByText("Events & Activities Hub")).toBeDefined();
    expect(screen.getByText(/AECTSD 2027/i)).toBeDefined();
  });

  it("renders Digital ID tab with login card when no user is authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=id"]}>
        <MobileAppPage defaultTab="id" />
      </MemoryRouter>
    );

    // When no user is logged in, the ID tab shows a login card
    expect(screen.getByText("Student Digital ID Card")).toBeDefined();
    expect(screen.getByText("View Official Digital ID")).toBeDefined();
    // No demo member switcher should appear
    expect(screen.queryByText("Switch Verified Member Card")).toBeNull();
  });

  it("renders Societies tab without errors", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=societies"]}>
        <MobileAppPage defaultTab="societies" />
      </MemoryRouter>
    );

    expect(screen.getByText("8 Technical Society Chapters")).toBeDefined();
  });

  it("renders Explore/Menu tab and 16+ pages directory without errors", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=menu"]}>
        <MobileAppPage defaultTab="menu" defaultCategory="menu" />
      </MemoryRouter>
    );

    expect(screen.getByText("All IEEE SREC Pages Directory")).toBeDefined();
    expect(screen.getByText("Leadership & Team")).toBeDefined();
  });

  it("safely falls back to Feed if an unknown tab is provided", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=unknown_random_tab"]}>
        <MobileAppPage defaultTab="unknown_random_tab" />
      </MemoryRouter>
    );

    expect(screen.getByText("IEEE Student Branch SREC")).toBeDefined();
    expect(screen.getByText("SB 64581")).toBeDefined();
  });

  it("renders Student Login screen when forceLogin is true and allows roll number entry", async () => {
    render(
      <MemoryRouter initialEntries={["/student-login"]}>
        <MobileAppPage forceLogin={true} />
      </MemoryRouter>
    );

    // Verify Login page is rendered first
    expect(screen.getByText("Member Sign In")).toBeDefined();

    // Verify no 1-Tap Demo Login section exists
    expect(screen.queryByText(/1-Tap Demo Student Login/i)).toBeNull();
    expect(screen.queryByText(/22EE104/i)).toBeNull();

    // Verify the roll number input is present
    const rollInput = screen.getByPlaceholderText(/98421045 or 22EE104/i);
    expect(rollInput).toBeDefined();

    // Type a roll number into the input
    fireEvent.change(rollInput, { target: { value: "24EE112" } });
    expect(rollInput.value).toBe("24EE112");
  });
});
