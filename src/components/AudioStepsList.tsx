import { AudioStep } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useRef } from "react";

interface AudioStepsListProps {
  steps: AudioStep[];
}

export function AudioStepsList({ steps }: AudioStepsListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (step: AudioStep) => {
    if (playingId === step.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (step.audioUrl) {
        audioRef.current = new Audio(step.audioUrl);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingId(null);
        setPlayingId(step.id);
      }
    }
  };

  if (steps.length === 0) {
    return (
      <div className="card-elevated p-6 text-center">
        <Mic className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">Aucun audio ajouté</p>
        <p className="text-sm text-muted-foreground/70">
          Utilisez le formulaire ci-dessus pour ajouter des enregistrements
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <div key={step.id} className="card-elevated p-4">
          <div className="flex items-start gap-4">
            {/* Play button */}
            {step.audioUrl && (
              <button
                onClick={() => togglePlay(step)}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
              >
                {playingId === step.id ? (
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                ) : (
                  <Play className="w-4 h-4 text-primary ml-0.5" />
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">{step.label}</h4>
                <StatusBadge status={step.status} />
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {format(new Date(step.createdAt), "d MMM yyyy 'à' HH:mm", {
                  locale: fr,
                })}
              </p>

              {/* Questions */}
              <div className="flex flex-wrap gap-1.5">
                {step.questions.slice(0, 3).map((q, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {q}
                  </span>
                ))}
                {step.questions.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    +{step.questions.length - 3}
                  </span>
                )}
              </div>

              {/* Extracted fields preview */}
              {step.extractedFields &&
                Object.keys(step.extractedFields).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {Object.keys(step.extractedFields).length} champs extraits
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: AudioStep["status"] }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          En attente
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="info" className="text-xs">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Traitement...
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="success" className="text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Complété
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          Erreur
        </Badge>
      );
  }
}
