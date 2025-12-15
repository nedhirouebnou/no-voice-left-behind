import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Candidate,
  HRFlowProfile,
  AudioStep,
  ProfileVersion,
} from "@/types/profile";

interface CandidateStore {
  candidates: Candidate[];
  currentCandidateId: string | null;

  // Actions
  addCandidate: (profile: HRFlowProfile) => string;
  setCurrentCandidate: (id: string | null) => void;
  getCurrentCandidate: () => Candidate | null;

  addAudioStep: (
    candidateId: string,
    step: Omit<AudioStep, "id" | "createdAt" | "status">
  ) => string;
  updateAudioStep: (
    candidateId: string,
    stepId: string,
    updates: Partial<AudioStep>
  ) => void;

  updateExtraFields: (
    candidateId: string,
    stepId: string,
    fields: Record<string, string | boolean | number | null>
  ) => void;

  deleteCandidate: (id: string) => void;
}

export const useCandidateStore = create<CandidateStore>()(
  persist(
    (set, get) => ({
      candidates: [],
      currentCandidateId: null,

      addCandidate: (profile) => {
        const id = `candidate_${Date.now()}`;
        const now = new Date().toISOString();

        const initialVersion: ProfileVersion = {
          id: `version_${Date.now()}`,
          timestamp: now,
          profile,
          extraFields: {},
        };

        const candidate: Candidate = {
          id,
          profile,
          audioSteps: [],
          versions: [initialVersion],
          extraFields: {},
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          candidates: [...state.candidates, candidate],
          currentCandidateId: id,
        }));

        return id;
      },

      setCurrentCandidate: (id) => {
        set({ currentCandidateId: id });
      },

      getCurrentCandidate: () => {
        const { candidates, currentCandidateId } = get();
        return candidates.find((c) => c.id === currentCandidateId) || null;
      },

      addAudioStep: (candidateId, step) => {
        const stepId = `step_${Date.now()}`;
        const newStep: AudioStep = {
          ...step,
          id: stepId,
          createdAt: new Date().toISOString(),
          status: "pending",
        };

        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (c.id === candidateId) {
              return {
                ...c,
                audioSteps: [...c.audioSteps, newStep],
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        }));

        return stepId;
      },

      updateAudioStep: (candidateId, stepId, updates) => {
        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (c.id === candidateId) {
              return {
                ...c,
                audioSteps: c.audioSteps.map((s) =>
                  s.id === stepId ? { ...s, ...updates } : s
                ),
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        }));
      },

      updateExtraFields: (candidateId, stepId, fields) => {
        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (c.id === candidateId) {
              const step = c.audioSteps.find((s) => s.id === stepId);
              const newExtraFields = { ...c.extraFields, ...fields };

              const newVersion: ProfileVersion = {
                id: `version_${Date.now()}`,
                timestamp: new Date().toISOString(),
                stepId,
                stepLabel: step?.label,
                profile: c.profile,
                extraFields: newExtraFields,
              };

              return {
                ...c,
                extraFields: newExtraFields,
                versions: [...c.versions, newVersion],
                audioSteps: c.audioSteps.map((s) =>
                  s.id === stepId
                    ? {
                        ...s,
                        extractedFields: fields,
                        status: "completed" as const,
                      }
                    : s
                ),
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        }));
      },

      deleteCandidate: (id) => {
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
          currentCandidateId:
            state.currentCandidateId === id ? null : state.currentCandidateId,
        }));
      },
    }),
    {
      name: "candidate-storage",
    }
  )
);
