export type Locale = "en" | "es";

export type Bilingual<T extends string> = { en: T; es: T };

function isBilingual(value: unknown): value is Bilingual<string> {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "es" in value
  );
}

export function resolveBilingual<T extends string>(
  value: T | Bilingual<T>,
  locale: Locale
): T {
  if (isBilingual(value)) {
    const translated = value[locale];
    return (translated ?? value.en ?? value.es) as T;
  }
  return value;
}

export interface Competence {
  name: string;
  type: string;
}

export interface Challenge {
  description: Bilingual<string>;
}

export interface Role {
  name: string;
  startDate: string;
  finishDate?: string;
  challenges: Challenge[];
  competences: Competence[];
}

export interface Organization {
  name: string;
  image?: { link: string; alt: string };
  URL?: string;
}

export interface Job {
  organization: Organization;
  roles: Role[];
}

export interface ProjectDetails {
  name: string;
  description?: Bilingual<string>;
  URL?: string;
  image?: { link: string; alt: string };
}

export interface Project {
  details: ProjectDetails;
  type: string;
  roles: Role[];
}

export interface PublicArtifactDetails {
  name: Bilingual<string>;
  description?: Bilingual<string>;
  URL?: string;
}

export interface PublicArtifact {
  details: PublicArtifactDetails;
  type: string;
  publishingDate?: string;
  tags?: string[];
}

export interface Author {
  name: string;
  surnames: string;
  title: string;
}

export interface Recommendation {
  title: string | Bilingual<string>;
  type: string;
  URL?: string;
  summary?: Bilingual<string>;
  authors?: Author[];
  publicationDate?: string;
}

export interface Location {
  country: string;
  region: string;
  municipality: string;
}

export interface Profile {
  name: string;
  surnames: string;
  title: Bilingual<string>;
  description: Bilingual<string>;
  avatar?: { link: string; alt: string };
  location?: Location;
}

export interface InterestingFact {
  topic: Bilingual<string>;
  fact: Bilingual<string>;
}

export interface RelevantLink {
  type: string;
  URL: string;
}

export interface Language {
  name: string;
  fullName: string;
  level: string;
}

export interface HardSkill {
  skill: { name: string; type: string };
}

export interface StudyInstitution {
  name: string;
  URL?: string;
}

export interface Study {
  studyType: string;
  degreeAchieved: boolean;
  name: string;
  startDate: string;
  finishDate?: string;
  institution: StudyInstitution;
  linkedCompetences?: Competence[];
}

export interface ResumeData {
  aboutMe: {
    profile: Profile;
    interestingFacts: InterestingFact[];
    recommendations: Recommendation[];
    relevantLinks: RelevantLink[];
  };
  experience: {
    jobs: Job[];
    projects: Project[];
    publicArtifacts: PublicArtifact[];
  };
  knowledge: {
    languages: Language[];
    hardSkills: HardSkill[];
    studies: Study[];
  };
}
