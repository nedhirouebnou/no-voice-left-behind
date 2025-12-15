import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Plus, X, Loader2, Upload } from "lucide-react";
import { INTERVIEW_LABELS, DEFAULT_QUESTIONS } from "@/types/profile";
import { useCandidateStore } from "@/store/candidateStore";
import { analyzeAudio } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AudioUploadFormProps {
  candidateId: string;
}

export function AudioUploadForm({ candidateId }: AudioUploadFormProps) {
  const [label, setLabel] = useState("");
  const [questions, setQuestions] = useState<string[]>([
    ...DEFAULT_QUESTIONS.slice(0, 4),
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const candidate = useCandidateStore((state) =>
    state.candidates.find((c) => c.id === candidateId)
  );
  const addAudioStep = useCandidateStore((state) => state.addAudioStep);
  const updateAudioStep = useCandidateStore((state) => state.updateAudioStep);
  const updateExtraFields = useCandidateStore(
    (state) => state.updateExtraFields
  );

  const addQuestion = () => {
    if (newQuestion.trim() && !questions.includes(newQuestion.trim())) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (q: string) => {
    setQuestions(questions.filter((question) => question !== q));
  };

  const addDefaultQuestion = (q: string) => {
    if (!questions.includes(q)) {
      setQuestions([...questions, q]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!label || !audioFile || questions.length === 0 || !candidate) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsProcessing(true);

    const labelText =
      INTERVIEW_LABELS.find((l) => l.value === label)?.label || label;

    const stepId = addAudioStep(candidateId, {
      label: labelText,
      questions,
      audioFile,
      audioUrl: URL.createObjectURL(audioFile),
    });

    updateAudioStep(candidateId, stepId, { status: "processing" });

    try {
      // Call Real endpoint
      const extractedFields = await analyzeAudio(
        candidate.profile,
        questions,
        audioFile
      );

      updateExtraFields(candidateId, stepId, extractedFields);
      toast.success("Audio analysé avec succès !");

      // Reset form
      setLabel("");
      setQuestions([...DEFAULT_QUESTIONS.slice(0, 4)]);
      setAudioFile(null);
    } catch (error) {
      updateAudioStep(candidateId, stepId, { status: "error" });
      toast.error("Erreur lors de l'analyse de l'audio");
    } finally {
      setIsProcessing(false);
    }
  };

  const unusedDefaultQuestions = DEFAULT_QUESTIONS.filter(
    (q) => !questions.includes(q)
  );

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Mic className="w-4 h-4 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Ajouter un audio
        </h3>
      </div>

      {/* Label Selection */}
      <div className="space-y-2">
        <Label>Type d'entretien</Label>
        <Select value={label} onValueChange={setLabel}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le type d'entretien" />
          </SelectTrigger>
          <SelectContent>
            {INTERVIEW_LABELS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <Label>Questions / Informations attendues</Label>

        <div className="flex flex-wrap gap-2 mb-2">
          {questions.map((q, i) => (
            <Badge key={i} variant="step" className="pr-1 gap-1">
              {q}
              <button
                type="button"
                onClick={() => removeQuestion(q)}
                className="ml-1 p-0.5 hover:bg-primary/20 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {unusedDefaultQuestions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs text-muted-foreground mr-1">
              Suggestions:
            </span>
            {unusedDefaultQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addDefaultQuestion(q)}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                + {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Ajouter une question personnalisée..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addQuestion())
            }
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addQuestion}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Audio Upload */}
      <div className="space-y-2">
        <Label>Fichier audio</Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            audioFile
              ? "border-success bg-success/5"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
          onClick={() => document.getElementById("audio-input")?.click()}
        >
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {audioFile ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <Mic className="w-5 h-5" />
              <span className="font-medium">{audioFile.name}</span>
            </div>
          ) : (
            <div className="text-muted-foreground">
              <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Cliquez pour sélectionner un fichier audio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        variant="gradient"
        disabled={
          isProcessing || !label || !audioFile || questions.length === 0
        }
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Analyser l'audio
          </>
        )}
      </Button>
    </form>
  );
}
