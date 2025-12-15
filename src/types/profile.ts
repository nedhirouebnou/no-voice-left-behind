export interface HRFlowProfile {
  key: string;
  reference?: string;
  consent_algorithmic?: {
    owner?: {
      parsing?: boolean;
      embedding?: boolean;
      searching?: boolean;
      scoring?: boolean;
    };
  };
  source?: {
    key?: string;
    name?: string;
  };
  text?: string;
  text_language?: string;
  created_at?: string;
  updated_at?: string;
  info?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_birth?: string;
    location?: {
      text?: string;
      lat?: number;
      lng?: number;
    };
    urls?: { type?: string; url?: string }[];
    picture?: string;
    summary?: string;
    gender?: string;
  };
  experiences?: {
    key?: string;
    company?: string;
    title?: string;
    description?: string;
    location?: { text?: string };
    date_start?: string;
    date_end?: string;
    skills?: { name?: string; type?: string }[];
    certifications?: { name?: string }[];
    tasks?: { name?: string }[];
  }[];
  educations?: {
    key?: string;
    school?: string;
    title?: string;
    description?: string;
    location?: { text?: string };
    date_start?: string;
    date_end?: string;
    certifications?: { name?: string }[];
    courses?: { name?: string }[];
    skills?: { name?: string; type?: string }[];
  }[];
  skills?: { name?: string; type?: string; value?: string }[];
  languages?: { name?: string; value?: string }[];
  certifications?: { name?: string }[];
  interests?: { name?: string }[];
  labels?: {
    job_key?: string;
    job_reference?: string;
    stage?: string;
    rating?: number;
    date_stage?: string;
  }[];
  tags?: { name?: string; value?: string }[];
  metadatas?: { name?: string; value?: string }[];
  attachments?: {
    type?: string;
    alt?: string;
    file_name?: string;
    file_size?: number;
    public_url?: string;
  }[];
}

export interface AudioStep {
  id: string;
  label: string;
  questions: string[];
  audioFile?: File;
  audioUrl?: string;
  extractedFields?: Record<string, string | boolean | number | null>;
  createdAt: string;
  status: "pending" | "processing" | "completed" | "error";
}

export interface ProfileVersion {
  id: string;
  timestamp: string;
  stepId?: string;
  stepLabel?: string;
  profile: HRFlowProfile;
  extraFields: Record<string, string | boolean | number | null>;
}

export interface Candidate {
  id: string;
  profile: HRFlowProfile;
  audioSteps: AudioStep[];
  versions: ProfileVersion[];
  extraFields: Record<string, string | boolean | number | null>;
  createdAt: string;
  updatedAt: string;
}

export const INTERVIEW_LABELS = [
  { value: "entretien_telephonique", label: "Entretien Téléphonique" },
  { value: "entretien_technique", label: "Entretien Technique" },
  { value: "entretien_rh", label: "Entretien RH" },
  { value: "test_technique", label: "Test Technique" },
  { value: "derniere_etape", label: "Dernière Étape" },
  { value: "autre", label: "Autre" },
] as const;

export const DEFAULT_QUESTIONS = [
  "Date de disponibilité",
  "Nationalité française",
  "Salaire souhaité",
  "Prêt à voyager",
  "Télétravail souhaité",
  "Préavis actuel",
  "Permis de conduire",
];
