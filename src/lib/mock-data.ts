import {
  HRFlowProfile,
  Candidate,
  ProfileVersion,
  AudioStep,
} from "@/types/profile";

export const mockParsedProfile: HRFlowProfile = {
  key: "profile_123",
  reference: "CAND-2024-001",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  text_language: "fr",
  info: {
    full_name: "Marie Dupont",
    first_name: "Marie",
    last_name: "Dupont",
    email: "marie.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: {
      text: "Paris, France",
      lat: 48.8566,
      lng: 2.3522,
    },
    urls: [
      { type: "linkedin", url: "https://linkedin.com/in/mariedupont" },
      { type: "github", url: "https://github.com/mariedupont" },
    ],
    summary:
      "Développeuse Full Stack avec 5 ans d'expérience dans le développement web. Passionnée par les technologies modernes et les méthodologies agiles.",
  },
  experiences: [
    {
      key: "exp_1",
      company: "TechCorp SAS",
      title: "Développeuse Full Stack Senior",
      description:
        "Développement d'applications web complexes avec React et Node.js. Lead technique d'une équipe de 4 développeurs.",
      location: { text: "Paris, France" },
      date_start: "2022-01",
      date_end: null,
      skills: [
        { name: "React", type: "hard" },
        { name: "Node.js", type: "hard" },
        { name: "TypeScript", type: "hard" },
      ],
    },
    {
      key: "exp_2",
      company: "StartupXYZ",
      title: "Développeuse Frontend",
      description: "Création d'interfaces utilisateur modernes et responsives.",
      location: { text: "Lyon, France" },
      date_start: "2019-06",
      date_end: "2021-12",
      skills: [
        { name: "Vue.js", type: "hard" },
        { name: "CSS/SASS", type: "hard" },
      ],
    },
  ],
  educations: [
    {
      key: "edu_1",
      school: "École Polytechnique",
      title: "Master en Informatique",
      date_start: "2016-09",
      date_end: "2019-06",
      location: { text: "Palaiseau, France" },
    },
  ],
  skills: [
    { name: "React", type: "hard", value: "expert" },
    { name: "TypeScript", type: "hard", value: "expert" },
    { name: "Node.js", type: "hard", value: "advanced" },
    { name: "Python", type: "hard", value: "intermediate" },
    { name: "PostgreSQL", type: "hard", value: "advanced" },
    { name: "AWS", type: "hard", value: "intermediate" },
    { name: "Leadership", type: "soft", value: "advanced" },
    { name: "Communication", type: "soft", value: "expert" },
  ],
  languages: [
    { name: "Français", value: "native" },
    { name: "Anglais", value: "fluent" },
    { name: "Espagnol", value: "intermediate" },
  ],
  certifications: [
    { name: "AWS Solutions Architect" },
    { name: "Google Cloud Professional" },
  ],
};

// Mock function to simulate HRFlow parsing
export async function mockParseResume(file: File): Promise<HRFlowProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    ...mockParsedProfile,
    key: `profile_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Mock function to simulate Rajaa's audio analysis endpoint
export async function mockAnalyzeAudio(
  profile: HRFlowProfile,
  questions: string[],
  audioFile: File
): Promise<Record<string, string | boolean | number | null>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Return mock extracted fields based on questions
  const extractedFields: Record<string, string | boolean | number | null> = {};

  questions.forEach((question) => {
    const key = question
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    // Generate mock responses
    if (
      question.toLowerCase().includes("disponibilité") ||
      question.toLowerCase().includes("date")
    ) {
      extractedFields[key] = "2024-06-15";
    } else if (question.toLowerCase().includes("nationalité")) {
      extractedFields[key] = true;
    } else if (question.toLowerCase().includes("salaire")) {
      extractedFields[key] = "€55k-65k";
    } else if (
      question.toLowerCase().includes("voyager") ||
      question.toLowerCase().includes("prêt")
    ) {
      extractedFields[key] = true;
    } else if (question.toLowerCase().includes("télétravail")) {
      extractedFields[key] = "2-3 jours/semaine";
    } else if (question.toLowerCase().includes("préavis")) {
      extractedFields[key] = "2 mois";
    } else if (question.toLowerCase().includes("permis")) {
      extractedFields[key] = true;
    } else {
      extractedFields[key] = null;
    }
  });

  return extractedFields;
}
