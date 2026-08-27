import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "@/components/layout/Footer";
describe("UI Components Rendering", () => {
    it("renders Footer with institution branding and navigation groups", () => {
        render(<MemoryRouter>
        <Footer />
      </MemoryRouter>);
        // Check for core brand text
        expect(screen.getAllByText(/IEEE Student Branch/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Sri Ramakrishna Engineering College/i).length).toBeGreaterThanOrEqual(1);
        // Check section headings in footer
        expect(screen.getByText("Explore")).toBeInTheDocument();
        expect(screen.getByText("Societies & Wings")).toBeInTheDocument();
        expect(screen.getByText("Leadership")).toBeInTheDocument();
    });
});
