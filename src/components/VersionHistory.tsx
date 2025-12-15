import { ProfileVersion } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, FileText, Mic, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VersionHistoryProps {
  versions: ProfileVersion[];
  onSelectVersion?: (version: ProfileVersion) => void;
  selectedVersionId?: string;
}

export function VersionHistory({
  versions,
  onSelectVersion,
  selectedVersionId,
}: VersionHistoryProps) {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Historique des versions
        </h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />

        <div className="space-y-4">
          {versions.map((version, index) => {
            const isFirst = index === 0;
            const isSelected = version.id === selectedVersionId;
            const extraFieldsCount = Object.keys(version.extraFields).length;

            return (
              <div
                key={version.id}
                className={`relative pl-8 transition-all ${
                  onSelectVersion
                    ? "cursor-pointer hover:bg-secondary/30 -mx-3 px-11 py-2 rounded-lg"
                    : ""
                } ${isSelected ? "bg-primary/5" : ""}`}
                onClick={() => onSelectVersion?.(version)}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                    isFirst
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isFirst ? (
                        <Badge variant="default" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          CV Initial
                        </Badge>
                      ) : (
                        <Badge variant="step" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          {version.stepLabel}
                        </Badge>
                      )}
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Sélectionné
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(version.timestamp),
                        "d MMMM yyyy 'à' HH:mm",
                        { locale: fr }
                      )}
                    </p>

                    {extraFieldsCount > 0 && (
                      <p className="text-xs text-success mt-1">
                        +{extraFieldsCount} champ
                        {extraFieldsCount > 1 ? "s" : ""} extrait
                        {extraFieldsCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {onSelectVersion && (
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isSelected ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
