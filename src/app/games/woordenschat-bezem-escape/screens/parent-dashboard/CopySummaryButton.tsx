import { Copy } from "lucide-react";
import { PrimaryActionButton } from "../../components/ui";

interface CopySummaryButtonProps {
  onCopySummary: () => void;
}

export const CopySummaryButton = ({ onCopySummary }: CopySummaryButtonProps) => (
  <PrimaryActionButton
    aria-label="Kopieer samenvatting"
    className="min-h-12 w-full text-sm"
    data-testid="dashboard-copy-summary-button"
    iconLeft={<Copy className="h-5 w-5" strokeWidth={3} />}
    onClick={onCopySummary}
    size="compact"
  >
    Kopieer samenvatting
  </PrimaryActionButton>
);

CopySummaryButton.displayName = "CopySummaryButton";
