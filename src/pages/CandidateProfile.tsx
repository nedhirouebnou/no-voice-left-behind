import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCandidateStore } from "@/store/candidateStore";
import { ProfileOverview } from "@/components/ProfileOverview";
import { ExtraFieldsSection } from "@/components/ExtraFieldsSection";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { AudioStepsList } from "@/components/AudioStepsList";
import { VersionHistory } from "@/components/VersionHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, User, Mic, History } from "lucide-react";
import { ProfileVersion } from "@/types/profile";

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidate = useCandidateStore((state) =>
    state.candidates.find((c) => c.id === id)
  );
  const [selectedVersion, setSelectedVersion] = useState<ProfileVersion | null>(
    null
  );

  useEffect(() => {
    if (!candidate) {
      navigate("/");
    }
  }, [candidate, navigate]);

  if (!candidate) {
    return null;
  }

  const displayVersion =
    selectedVersion || candidate.versions[candidate.versions.length - 1];
  const displayExtraFields = selectedVersion
    ? selectedVersion.extraFields
    : candidate.extraFields;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  RecruiterAI
                </h1>
                <p className="text-xs text-muted-foreground">
                  {candidate.profile.info?.full_name || "Candidat"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="w-4 h-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="audio" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Audios
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="w-4 h-4" />
                  Versions
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="profile"
                className="space-y-6 animate-fade-in"
              >
                {/* Extra Fields */}
                {Object.keys(displayExtraFields).length > 0 && (
                  <ExtraFieldsSection fields={displayExtraFields} />
                )}

                {/* Profile Overview */}
                <ProfileOverview profile={displayVersion.profile} />
              </TabsContent>

              <TabsContent value="audio" className="space-y-6 animate-fade-in">
                <AudioUploadForm candidateId={candidate.id} />
                <AudioStepsList steps={candidate.audioSteps} />
              </TabsContent>

              <TabsContent value="history" className="animate-fade-in">
                <VersionHistory
                  versions={candidate.versions}
                  onSelectVersion={(v) =>
                    setSelectedVersion(v.id === displayVersion.id ? null : v)
                  }
                  selectedVersionId={selectedVersion?.id}
                />

                {selectedVersion && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Aperçu de la version
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVersion(null)}
                      >
                        Voir version actuelle
                      </Button>
                    </div>

                    {Object.keys(selectedVersion.extraFields).length > 0 && (
                      <ExtraFieldsSection
                        fields={selectedVersion.extraFields}
                      />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-foreground mb-4">Résumé</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Audios ajoutés
                  </span>
                  <span className="font-semibold text-foreground">
                    {candidate.audioSteps.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Champs extraits
                  </span>
                  <span className="font-semibold text-foreground">
                    {Object.keys(candidate.extraFields).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Versions
                  </span>
                  <span className="font-semibold text-foreground">
                    {candidate.versions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Derniers audios
              </h3>

              {candidate.audioSteps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun audio ajouté pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {candidate.audioSteps
                    .slice(-3)
                    .reverse()
                    .map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Mic className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.questions.length} question
                            {step.questions.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Add Audio */}
            <div className="lg:hidden">
              <AudioUploadForm candidateId={candidate.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
