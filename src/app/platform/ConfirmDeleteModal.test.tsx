import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

describe("ConfirmDeleteModal (T-46)", () => {
  it("rendert niet wanneer isOpen false is", () => {
    render(
      <ConfirmDeleteModal
        gameTitle="Magisch Strand-Avontuur"
        isOpen={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toont de titel, spelnaam en actieknoppen wanneer isOpen true is", () => {
    render(
      <ConfirmDeleteModal
        gameTitle="Magisch Strand-Avontuur"
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        requiredBytes={37 * 1024 * 1024}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Spel verwijderen?")).toBeInTheDocument();
    expect(screen.getByText(/"Magisch Strand-Avontuur"/)).toBeInTheDocument();
    expect(screen.getByText(/37 MB/)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Verwijder gamebestanden/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Annuleren/i })).toBeInTheDocument();
  });

  it("roept onConfirm aan bij klikken op de verwijderknop", async () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmDeleteModal
        gameTitle="Magisch Strand-Avontuur"
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /Verwijder gamebestanden/i });
    await userEvent.click(deleteBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("roept onCancel aan bij klikken op Annuleren, Sluiten of Escape", async () => {
    const handleCancel = vi.fn();
    render(
      <ConfirmDeleteModal
        gameTitle="Magisch Strand-Avontuur"
        isOpen={true}
        onCancel={handleCancel}
        onConfirm={vi.fn()}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: /Annuleren/i });
    await userEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByRole("button", { name: /Sluiten/i });
    await userEvent.click(closeBtn);
    expect(handleCancel).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleCancel).toHaveBeenCalledTimes(3);
  });
});
