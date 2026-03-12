import type { Locale } from "./types";
import { getJobs, getProjects } from "./data";
import { classifyRole, type RoleType } from "./role-classifier";

export type TimelineItemType = "job" | "project";

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string | null;
  roleType: RoleType;
  description: string;
  competences: string[];
  image?: string;
  url?: string;
}

function parseDate(d: string): number {
  return new Date(d).getTime();
}

function overlaps(a: TimelineItem, b: TimelineItem): boolean {
  const aStart = parseDate(a.startDate);
  const aEnd = a.endDate ? parseDate(a.endDate) : Date.now();
  const bStart = parseDate(b.startDate);
  const bEnd = b.endDate ? parseDate(b.endDate) : Date.now();
  return aStart <= bEnd && bStart <= aEnd;
}

export function getTimelineItems(locale: Locale): TimelineItem[] {
  const items: TimelineItem[] = [];

  for (const job of getJobs(locale)) {
    for (const role of job.roles) {
      const roleType = classifyRole(role.name);
      const challenge = role.challenges[0]?.description ?? "";
      items.push({
        id: `job-${job.organization.name}-${role.name}-${role.startDate}`,
        type: "job",
        title: job.organization.name,
        subtitle: role.name,
        startDate: role.startDate,
        endDate: role.finishDate ?? null,
        roleType,
        description: challenge,
        competences: role.competences.map((c) => c.name),
        image: job.organization.image?.link,
        url: job.organization.URL,
      });
    }
  }

  for (const project of getProjects(locale)) {
    for (const role of project.roles) {
      const roleType = classifyRole(role.name);
      const challenge = project.details.description ?? "";
      items.push({
        id: `project-${project.details.name}-${role.name}`,
        type: "project",
        title: project.details.name,
        subtitle: role.name,
        startDate: role.startDate,
        endDate: role.finishDate ?? null,
        roleType,
        description: challenge,
        competences: role.competences.map((c) => c.name),
        image: project.details.image?.link,
        url: project.details.URL,
      });
    }
  }

  items.sort((a, b) => {
    const aPresent = a.endDate === null;
    const bPresent = b.endDate === null;
    if (aPresent && !bPresent) return -1;
    if (!aPresent && bPresent) return 1;
    return parseDate(b.startDate) - parseDate(a.startDate);
  });

  return items;
}

export function getTimelineRows(items: TimelineItem[]): TimelineItem[][] {
  const rows: TimelineItem[][] = [];
  const used = new Set<string>();

  for (const item of items) {
    if (used.has(item.id)) continue;

    const row: TimelineItem[] = [item];
    used.add(item.id);

    for (const other of items) {
      if (used.has(other.id)) continue;
      if (row.some((r) => overlaps(r, other))) {
        row.push(other);
        used.add(other.id);
      }
    }

    row.sort((a, b) => parseDate(b.startDate) - parseDate(a.startDate));
    rows.push(row);
  }

  rows.sort(
    (a, b) => parseDate(b[0].startDate) - parseDate(a[0].startDate)
  );

  return rows;
}
