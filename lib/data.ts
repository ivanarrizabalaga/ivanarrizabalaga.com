import type { Locale, ResumeData } from "./types";
import { resolveBilingual } from "./types";

import resumeData from "@/data/resume.json";

const data = resumeData as unknown as ResumeData;

export function getProfile(locale: Locale) {
  const profile = data.aboutMe.profile;
  return {
    ...profile,
    title: resolveBilingual(profile.title, locale),
    description: resolveBilingual(profile.description, locale),
  };
}

export function getJobs(locale: Locale) {
  return data.experience.jobs.map((job) => ({
    ...job,
    roles: job.roles.map((role) => ({
      ...role,
      challenges: role.challenges.map((c) => ({
        ...c,
        description: resolveBilingual(c.description, locale),
      })),
    })),
  }));
}

export function getProjects(locale: Locale) {
  return data.experience.projects.map((project) => ({
    ...project,
    details: {
      ...project.details,
      description: project.details.description
        ? resolveBilingual(project.details.description, locale)
        : undefined,
    },
  }));
}

export function getPublicArtifacts(locale: Locale) {
  return data.experience.publicArtifacts.filter(
    (a) => !a.details.URL?.includes("stackoverflow.com")
  ).map((a) => ({
    ...a,
    details: {
      ...a.details,
      name: resolveBilingual(a.details.name, locale),
      description: a.details.description
        ? resolveBilingual(a.details.description, locale)
        : undefined,
    },
  }));
}

export function getPosts(locale: Locale) {
  return data.experience.publicArtifacts
    .filter(
      (a) =>
        a.type === "post" && !a.details.URL?.includes("stackoverflow.com")
    )
    .map((a) => ({
      ...a,
      details: {
        ...a.details,
        name: resolveBilingual(a.details.name, locale),
        description: a.details.description
          ? resolveBilingual(a.details.description, locale)
          : undefined,
      },
    }))
    .sort((a, b) => {
      const dateA = a.publishingDate
        ? new Date(a.publishingDate).getTime()
        : 0;
      const dateB = b.publishingDate
        ? new Date(b.publishingDate).getTime()
        : 0;
      return dateB - dateA;
    });
}

export function getTalks(locale: Locale) {
  return data.experience.publicArtifacts
    .filter((a) => a.type === "talk")
    .map((a) => ({
      ...a,
      details: {
        ...a.details,
        name: resolveBilingual(a.details.name, locale),
        description: a.details.description
          ? resolveBilingual(a.details.description, locale)
          : undefined,
      },
    }))
    .sort((a, b) => {
      const dateA = a.publishingDate
        ? new Date(a.publishingDate).getTime()
        : 0;
      const dateB = b.publishingDate
        ? new Date(b.publishingDate).getTime()
        : 0;
      return dateB - dateA;
    });
}

export function getStudies(locale: Locale) {
  return data.knowledge.studies;
}

export function getRecommendations(locale: Locale) {
  return data.aboutMe.recommendations.map((r) => ({
    ...r,
    title: resolveBilingual(r.title, locale),
    summary: r.summary ? resolveBilingual(r.summary, locale) : undefined,
  }));
}

export function getHardSkills(locale: Locale) {
  return data.knowledge.hardSkills;
}

export function getInterestingFacts(locale: Locale) {
  return data.aboutMe.interestingFacts.map((f) => ({
    ...f,
    topic: resolveBilingual(f.topic, locale),
    fact: resolveBilingual(f.fact, locale),
  }));
}

export function getRelevantLinks(locale: Locale) {
  return data.aboutMe.relevantLinks;
}

export function getLanguages(locale: Locale) {
  return data.knowledge.languages.map((l) => ({
    ...l,
    description: resolveBilingual(l.description, locale),
  }));
}
