import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X, Minus } from "lucide-react";

interface ExtraFieldsSectionProps {
  fields: Record<string, string | boolean | number | null>;
}

function formatFieldName(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderFieldValue(value: string | boolean | number | null) {
  if (value === null || value === undefined) {
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <Minus className="w-4 h-4" />
        Non renseigné
      </span>
    );
  }

  if (typeof value === "boolean") {
    return value ? (
      <span className="flex items-center gap-1 text-success">
        <Check className="w-4 h-4" />
        Oui
      </span>
    ) : (
      <span className="flex items-center gap-1 text-destructive">
        <X className="w-4 h-4" />
        Non
      </span>
    );
  }

  return <span className="text-foreground font-medium">{String(value)}</span>;
}

export function ExtraFieldsSection({ fields }: ExtraFieldsSectionProps) {
  const entries = Object.entries(fields);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Informations extraites
          </h3>
          <p className="text-xs text-muted-foreground">
            Données récupérées des entretiens audio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50"
          >
            <span className="text-sm text-muted-foreground">
              {formatFieldName(key)}
            </span>
            {renderFieldValue(value)}
          </div>
        ))}
      </div>
    </div>
  );
}
