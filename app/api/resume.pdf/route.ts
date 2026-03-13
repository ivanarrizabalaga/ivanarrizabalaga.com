import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  getProfile,
  getStudies,
  getLanguages,
  getRelevantLinks,
} from "@/lib/data";
import { getTimelineItems } from "@/lib/experience-timeline";
import "@/lib/pdf/fonts";
import { ResumeDocument } from "@/lib/pdf/resume-document";
import type { Locale } from "@/lib/types";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

const messages: Record<Locale, { pdf: { sections: Record<string, string> } }> = {
  en: en as { pdf: { sections: Record<string, string> } },
  es: es as { pdf: { sections: Record<string, string> } },
};

const VALID_LOCALES: Locale[] = ["en", "es"];

function getLocaleFromRequest(request: NextRequest): Locale {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";
  return VALID_LOCALES.includes(locale as Locale) ? (locale as Locale) : "en";
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);

  try {
    const profile = getProfile(locale);
    const timelineItems = getTimelineItems(locale);
    const studies = getStudies(locale);
    const languages = getLanguages(locale);
    const links = getRelevantLinks(locale);
    const sectionLabels = messages[locale].pdf.sections as {
      experience: string;
      projects: string;
      education: string;
      languages: string;
      courses: string;
      contact: string;
    };

    const data = {
      profile: {
        name: profile.name,
        surnames: profile.surnames,
        title: profile.title,
        description: profile.description,
        email: profile.email,
        location: profile.location,
      },
      timelineItems,
      studies,
      languages,
      links,
      sectionLabels,
    };

    const doc = React.createElement(ResumeDocument, { data });
    const buffer = await renderToBuffer(
      doc as Parameters<typeof renderToBuffer>[0]
    );

    const filename = `Ivan_Arrizabalaga_Resume_${locale}.pdf`;
    const body = new Uint8Array(buffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.length),
      },
    });
  } catch (error) {
    console.error("Resume PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
