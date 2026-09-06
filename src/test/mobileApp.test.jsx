import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("renders Digital ID tab and all Student Dashboard Bento modules without errors", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=id"]}>
        <MobileAppPage defaultTab="id" />
      </MemoryRouter>
    );

    // Top actions bar
    expect(screen.getByText("Official IEEE ID")).toBeDefined();
    expect(screen.getByText("Renew")).toBeDefined();
    expect(screen.getAllByText("View PDF").length).toBeGreaterThan(0);
    expect(screen.getByText("Flip")).toBeDefined();

    // Module 1: Credentials & Quick Copy
    expect(screen.getByText("Credentials & Quick Copy")).toBeDefined();

    // Module 2: Profile details
    expect(screen.getAllByText(/Chairperson/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Joselyn/i).length).toBeGreaterThan(0);

    // Module 3: Academic Affiliation & Standing
    expect(screen.getByText("Academic Affiliation & Standing")).toBeDefined();

    // Module 4: Specializations
    expect(screen.getByText("Technical Specializations & Domains")).toBeDefined();

    // Module 5: Enrolled Chapters
    expect(screen.getByText("Enrolled Technical Chapters")).toBeDefined();

    // Module 6: Event participations
    expect(screen.getByText(/Verified Event Participations/i)).toBeDefined();

    // Module 7: Dossier Table
    expect(screen.getByText("Structured Membership Dossier")).toBeDefined();

    // Module 8: Member Resources
    expect(screen.getByText("IEEE Xplore")).toBeDefined();
    expect(screen.getByText("Collabratec")).toBeDefined();

    // Module 9: Member switcher
    expect(screen.getByText("Switch Verified Member Card")).toBeDefined();
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

  it("renders Student Login screen when forceLogin is true and transitions to Dashboard upon login", async () => {
    const { fireEvent } = await import("@testing-library/react");
    render(
      <MemoryRouter initialEntries={["/student-login"]}>
        <MobileAppPage forceLogin={true} />
      </MemoryRouter>
    );

    // Verify Login page is rendered first
    expect(screen.getByText("Member Sign In")).toBeDefined();
    expect(screen.getByText(/1-Tap Demo Student Login/i)).toBeDefined();

    // Click 1-tap demo login button
    const demoButton = screen.getByText(/22EE104/i);
    fireEvent.click(demoButton);

    // Verify it transitions directly into the Student Dashboard
    expect(screen.getByText("Official IEEE ID")).toBeDefined();
    expect(screen.getByText("Credentials & Quick Copy")).toBeDefined();
    expect(screen.getAllByText(/Joselyn/i).length).toBeGreaterThan(0);
  });
});
