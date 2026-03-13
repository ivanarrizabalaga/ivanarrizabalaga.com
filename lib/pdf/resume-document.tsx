import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { TimelineItem } from "@/lib/experience-timeline";
import type { Study } from "@/lib/types";
import { FONT_SANS, FONT_MONO } from "./fonts";
import { stripMarkdown } from "./strip-markdown";

export type ResumePDFData = {
  profile: {
    name: string;
    surnames: string;
    title: string;
    description: string;
    email?: string;
    location?: { municipality: string; region: string; country: string };
  };
  timelineItems: TimelineItem[];
  studies: Study[];
  languages: { fullName: string; description: string }[];
  links: { type: string; URL: string; description?: string }[];
  sectionLabels: {
    experience: string;
    projects: string;
    education: string;
    languages: string;
    courses: string;
    contact: string;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: FONT_SANS,
    fontSize: 10,
    color: "#1a1a1a",
  },
  title: {
    fontFamily: FONT_MONO,
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONT_MONO,
    fontSize: 11,
    color: "#444",
    marginBottom: 12,
  },
  intro: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 16,
    color: "#333",
  },
  sectionHeading: {
    fontFamily: FONT_MONO,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 9,
    color: "#444",
  },
  experienceBlock: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  experienceTitle: {
    fontFamily: FONT_MONO,
    fontSize: 11,
    fontWeight: 700,
  },
  experienceDates: {
    fontFamily: FONT_MONO,
    fontSize: 9,
    color: "#666",
  },
  experienceRole: {
    fontSize: 9,
    color: "#555",
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#333",
    marginBottom: 4,
  },
  competences: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  competenceTag: {
    fontFamily: FONT_MONO,
    fontSize: 8,
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  educationItem: {
    marginBottom: 6,
  },
  educationName: {
    fontSize: 10,
    fontWeight: 700,
  },
  educationInstitution: {
    fontSize: 9,
    color: "#555",
  },
  languagesList: {
    marginTop: 4,
  },
  languageItem: {
    fontSize: 9,
    marginBottom: 2,
    color: "#333",
  },
});

function formatDateRange(start: string, end: string | null): string {
  const startStr = new Date(start).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const endStr = end
    ? new Date(end).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Present";
  return `${startStr} – ${endStr}`;
}

export function ResumeDocument({ data }: { data: ResumePDFData }) {
  const {
    profile,
    timelineItems,
    studies,
    languages,
    links,
    sectionLabels,
  } = data;

  const introPlain = stripMarkdown(profile.description);
  const officialDegrees = studies.filter(
    (s) => s.studyType === "officialDegree",
  );
  const officialDegreesSorted = [...officialDegrees].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const certifications = studies
    .filter((s) => s.studyType === "certification")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
    .slice(0, 10);

  const jobItems = timelineItems.filter((item) => item.type === "job");
  const projectItems = timelineItems.filter(
    (item) =>
      item.type === "project" &&
      !["pagerank", "binary-tree-challenge", "state-diagram-challenge"].includes(
        item.title,
      ),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {profile.name} {profile.surnames}
        </Text>
        <Text style={styles.subtitle}>{profile.title}</Text>
        <Text style={styles.intro}>
          {introPlain.split("\n\n").slice(0, 3).join("\n\n")}
        </Text>

        <Text style={styles.sectionHeading}>{sectionLabels.contact}</Text>
        <View style={styles.contactRow}>
          {profile.email && (
            <Text style={styles.contactItem}>{profile.email}</Text>
          )}
          {profile.location && (
            <Text style={styles.contactItem}>
              {profile.location.municipality}, {profile.location.region},{" "}
              {profile.location.country}
            </Text>
          )}
        </View>
        <View style={styles.contactRow}>
          {links.map((link) => (
            <Link key={link.URL} src={link.URL} style={styles.contactItem}>
              {link.description ?? link.type}
            </Link>
          ))}
        </View>

        <Text style={styles.sectionHeading}>{sectionLabels.languages}</Text>
        <View style={styles.languagesList}>
          {languages.map((lang) => (
            <Text key={lang.fullName} style={styles.languageItem}>
              {lang.fullName} — {lang.description}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionHeading}>{sectionLabels.education}</Text>
        {officialDegreesSorted.map((s) => (
          <View key={s.name} style={styles.educationItem}>
            <Text style={styles.educationName}>{s.name}</Text>
            <Text style={styles.educationInstitution}>
              {s.institution.name}
              {s.finishDate
                ? ` · ${new Date(s.finishDate).getFullYear()}`
                : ""}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>{sectionLabels.experience}</Text>
        {jobItems.map((item) => (
          <View key={item.id} style={styles.experienceBlock}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>
                {item.subtitle} @ {item.title}
              </Text>
              <Text style={styles.experienceDates}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.description && (
              <Text style={styles.experienceDescription}>
                {stripMarkdown(item.description)}
              </Text>
            )}
            {item.competences.length > 0 && (
              <View style={styles.competences}>
                {item.competences.slice(0, 8).map((c) => (
                  <Text key={c} style={styles.competenceTag}>
                    {c}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.sectionHeading}>{sectionLabels.projects}</Text>
        {projectItems.map((item) => (
          <View key={item.id} style={styles.experienceBlock}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>
                {item.subtitle} @ {item.title}
              </Text>
              <Text style={styles.experienceDates}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.description && (
              <Text style={styles.experienceDescription}>
                {stripMarkdown(item.description)}
              </Text>
            )}
            {item.competences.length > 0 && (
              <View style={styles.competences}>
                {item.competences.slice(0, 8).map((c) => (
                  <Text key={c} style={styles.competenceTag}>
                    {c}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        {certifications.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>{sectionLabels.courses}</Text>
            {certifications.map((s) => (
              <View key={s.name} style={styles.educationItem}>
                <Text style={styles.educationName}>{s.name}</Text>
                <Text style={styles.educationInstitution}>
                  {s.institution.name}
                  {" · "}
                  {new Date(s.finishDate ?? s.startDate).getFullYear()}
                </Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
