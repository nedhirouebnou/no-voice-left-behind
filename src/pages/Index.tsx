import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidateStore } from "@/store/candidateStore";
import { ResumeDropzone } from "@/components/ResumeDropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Mic, ChevronRight, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Index = () => {
  const navigate = useNavigate();
  const candidates = useCandidateStore((state) => state.candidates);
  const setCurrentCandidate = useCandidateStore(
    (state) => state.setCurrentCandidate
  );
  const deleteCandidate = useCandidateStore((state) => state.deleteCandidate);
  const [showDropzone, setShowDropzone] = useState(candidates.length === 0);

  const handleProfileCreated = (candidateId: string) => {
    setCurrentCandidate(candidateId);
    navigate(`/candidate/${candidateId}`);
  };

  const handleCandidateClick = (candidateId: string) => {
    setCurrentCandidate(candidateId);
    navigate(`/candidate/${candidateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  RecruiterAI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Enrichissement automatique des profils
                </p>
              </div>
            </div>

            {candidates.length > 0 && !showDropzone && (
              <Button onClick={() => setShowDropzone(true)}>
                <Plus className="w-4 h-4" />
                Nouveau candidat
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome / Dropzone Section */}
        {(showDropzone || candidates.length === 0) && (
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
            {candidates.length > 0 && (
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setShowDropzone(false)}
              >
                ← Retour aux candidats
              </Button>
            )}

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                {candidates.length === 0
                  ? "Bienvenue sur RecruiterAI"
                  : "Ajouter un nouveau candidat"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Déposez un CV pour créer automatiquement un profil candidat
                enrichi par l'analyse de vos entretiens audio.
              </p>
            </div>

            <ResumeDropzone onProfileCreated={handleProfileCreated} />

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-card border border-border">
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Parsing CV
                </p>
                <p className="text-xs text-muted-foreground">
                  Extraction automatique
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <Mic className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium text-foreground">
                  Audio Analysis
                </p>
                <p className="text-xs text-muted-foreground">
                  Transcription intelligente
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <Users className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium text-foreground">
                  Profil enrichi
                </p>
                <p className="text-xs text-muted-foreground">
                  Évolution traçable
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates List */}
        {candidates.length > 0 && !showDropzone && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Candidats
                </h2>
                <p className="text-sm text-muted-foreground">
                  {candidates.length} profil{candidates.length > 1 ? "s" : ""}{" "}
                  en cours
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="card-elevated p-5 cursor-pointer group"
                  onClick={() => handleCandidateClick(candidate.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-primary">
                        {candidate.profile.info?.first_name?.[0] || "?"}
                        {candidate.profile.info?.last_name?.[0] || ""}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {candidate.profile.info?.full_name ||
                          "Candidat sans nom"}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {candidate.profile.experiences?.[0]?.title ||
                          "Poste non renseigné"}
                        {candidate.profile.experiences?.[0]?.company &&
                          ` chez ${candidate.profile.experiences[0].company}`}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Créé le{" "}
                          {format(new Date(candidate.createdAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </span>
                        <Badge variant="step" className="text-xs">
                          {candidate.audioSteps.length} audio
                          {candidate.audioSteps.length !== 1 ? "s" : ""}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          v{candidate.versions.length}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCandidate(candidate.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
