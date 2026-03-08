import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Avatar } from "@/components/avatar/avatar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <div className="relative min-h-screen bg-background text-foreground">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
            <aside className="hidden lg:block w-[420px] xl:w-[480px] shrink-0 pl-4 pt-8">
              <div className="sticky top-24">
                <Avatar className="w-full max-w-[480px] opacity-60" />
              </div>
            </aside>
            <main className="pb-24">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
