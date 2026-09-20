import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/layout/Footer";
import Societies from "@/components/societies/Societies";

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe("UI Components Rendering", () => {
    it("renders Footer with institution branding and navigation groups", () => {
        render(
          <MemoryRouter>
            <Footer />
          </MemoryRouter>
        );
        // Check for core brand text
        expect(screen.getAllByText(/IEEE Student Branch/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Sri Ramakrishna Engineering College/i).length).toBeGreaterThanOrEqual(1);
        // Check section headings in footer
        expect(screen.getByText("Explore")).toBeInTheDocument();
        expect(screen.getByText("Societies & Wings")).toBeInTheDocument();
        expect(screen.getByText("Leadership")).toBeInTheDocument();
    });

    it("renders Societies component cleanly with domain dropdown", async () => {
        testQueryClient.setQueryData(["societies"], []);
        render(
          <QueryClientProvider client={testQueryClient}>
            <MemoryRouter initialEntries={["/societies"]}>
              <Societies />
            </MemoryRouter>
          </QueryClientProvider>
        );
        expect(await screen.findByPlaceholderText(/Search societies/i)).toBeInTheDocument();
        expect(screen.getByText(/Filter Domain/i)).toBeInTheDocument();
    });
});
