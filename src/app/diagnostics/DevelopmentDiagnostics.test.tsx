import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { DevelopmentDiagnostics, DIAGNOSTICS_SESSION_KEY } from "./DevelopmentDiagnostics";

afterEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("DevelopmentDiagnostics", () => {
  it("is standaard volledig verborgen", () => {
    render(<DevelopmentDiagnostics />);

    expect(screen.queryByRole("button", { name: "Diagnostiek" })).not.toBeInTheDocument();
  });

  it("kan bewust voor de browsersessie worden ingeschakeld en weer uitgezet", async () => {
    window.history.replaceState({}, "", "/games/vocabulary?diagnostics=on");
    const user = userEvent.setup();
    render(<DevelopmentDiagnostics />);

    expect(screen.getByRole("button", { name: "Diagnostiek" })).toBeVisible();
    expect(window.sessionStorage.getItem(DIAGNOSTICS_SESSION_KEY)).toBe("on");
    expect(window.location.search).toBe("");

    await user.click(screen.getByRole("button", { name: "Diagnostiek" }));
    await user.click(screen.getByRole("button", { name: "Diagnostiek uitschakelen" }));

    expect(screen.queryByRole("button", { name: "Diagnostiek" })).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(DIAGNOSTICS_SESSION_KEY)).toBeNull();
  });
});
