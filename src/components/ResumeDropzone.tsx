import { useCallback, useState } from "react";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockParseResume } from "@/lib/mock-data";
import { useCandidateStore } from "@/store/candidateStore";
import { toast } from "sonner";

interface ResumeDropzoneProps {
  onProfileCreated?: (candidateId: string) => void;
}

export function ResumeDropzone({ onProfileCreated }: ResumeDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "parsing" | "success"
  >("idle");
  const addCandidate = useCandidateStore((state) => state.addCandidate);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      toast.error("Veuillez télécharger un fichier PDF");
      return;
    }

    setFile(file);
    setStatus("uploading");

    try {
      setStatus("parsing");
      // In production, this would call the HRFlow API
      const profile = await mockParseResume(file);

      setStatus("success");
      const candidateId = addCandidate(profile);
      toast.success("CV analysé avec succès !");

      setTimeout(() => {
        onProfileCreated?.(candidateId);
      }, 1000);
    } catch (error) {
      toast.error("Erreur lors de l'analyse du CV");
      setStatus("idle");
      setFile(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "dropzone relative flex flex-col items-center justify-center p-12 cursor-pointer min-h-[300px]",
        isDragActive && "dropzone-active",
        status !== "idle" && "pointer-events-none"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() =>
        status === "idle" && document.getElementById("resume-input")?.click()
      }
    >
      <input
        id="resume-input"
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      {status === "idle" && (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Déposez un CV ici
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            ou cliquez pour sélectionner un fichier PDF
          </p>
        </>
      )}

      {(status === "uploading" || status === "parsing") && (
        <>
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">{file?.name}</span>
          </div>
          <p className="text-sm text-primary font-medium animate-pulse-soft">
            {status === "uploading"
              ? "Téléchargement..."
              : "Analyse du CV en cours..."}
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            CV analysé avec succès !
          </h3>
          <p className="text-sm text-muted-foreground">
            Redirection vers le profil...
          </p>
        </>
      )}
    </div>
  );
}
