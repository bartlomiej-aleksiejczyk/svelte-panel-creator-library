import { render, fireEvent, screen } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Topbar from "../Topbar.svelte";
import sampleData from "./sampleData.json";

const renderTopbarWithSampleData = (data) => {
  render(Topbar, { data: JSON.stringify(data) });
};

describe("Topbar Component E2E", () => {
  it("renders topbar items correctly for default data", async () => {
    renderTopbarWithSampleData(sampleData);

    expect(screen.getByAltText("null")).toBeInTheDocument();
    expect(screen.getByText("Custom Settings")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Custom Settings"));
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
  });

  it("renders correctly when no data is provided", async () => {
    renderTopbarWithSampleData({});

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("handles large data sets correctly", async () => {
    const largeData = {
      fixedContent: {
        disableSettings: false,
        logoutUrl: "https://mysite.invalid/logout",
        userPreferencesUrl: "https://mysite.invalid/pref",
        userSettingsUrl: "https://mysite.invalid/sett",
      },
      content: Array.from({ length: 50 }, (_, i) => ({
        link: `https://mysite.invalid/link${i}`,
        iconLink: `https://img.icons8.com/?size=100&id=6i0wNATb63Qv&format=png&color=000000`,
        defaultName: `Link ${i}`,
        id: `link${i}`,
        type: "link",
      })),
    };

    renderTopbarWithSampleData(largeData);

    for (let i = 0; i < 50; i++) {
      expect(screen.getByText(`Link ${i}`)).toBeInTheDocument();
    }
  });

  it("toggles custom menu correctly", async () => {
    renderTopbarWithSampleData(sampleData);

    const customItemsContainer = screen.getByText("Custom Settings");
    await fireEvent.click(customItemsContainer);

    expect(screen.getByText("Security")).toBeVisible();
  });

  it("updates topbar items on window resize", async () => {
    renderTopbarWithSampleData(sampleData);
    window.innerWidth = 100;
    window.dispatchEvent(new Event("resize"));
    await new Promise((r) => setTimeout(r, 50));
    expect(window.innerWidth).toBe(100);
    expect(screen.getByTestId("customItemsButtonMobile")).toBeInTheDocument();
  });
});