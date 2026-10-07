import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/navbar";
import RolePage from "@/components/sections/role-page";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { ROLE_IDS } from "@/components/shared/role-icons";
import { i18n } from "@/lib/i18n";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ROLE_IDS.map((role) => ({ role }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  const r = i18n.ua.audience.roles.find((x) => x.id === role);
  if (!r) return {};
  /* «Член церкви у церкві» — рядок, який давав шаблон: назва ролі вже
     містить слово «церква». Уточнення додаємо тільки тим ролям, яким воно
     справді потрібне («Пастор», «Адміністрація», «Бухгалтер»). */
  const subject = /церкв/i.test(r.name) ? r.name : `${r.name} у церкві`;
  return pageMeta({
    title: `${subject} — що бачить і що може | Моя Церква`,
    /* Опис у пошуку — розгорнутий `description`, а не `tagline`: той
       коротший за 60 символів і виглядає в сніпеті обрізаним. */
    description: r.description,
    path: `/for-whom/${role}`,
  });
}

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!(ROLE_IDS as readonly string[]).includes(role)) notFound();
  const name = i18n.ua.audience.roles.find((x) => x.id === role)?.name ?? role;
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            breadcrumbSchema([
              { name: i18n.ua.nav.audience, path: "/for-whom" },
              { name, path: `/for-whom/${role}` },
            ])
          )}
        />
        <RolePage roleId={role} />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
