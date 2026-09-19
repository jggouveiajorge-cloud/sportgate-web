import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WizardProvider } from "@/components/WizardProvider";
import { themeInitScript } from "@/lib/theme";
import { fontScaleInitScript } from "@/lib/fontSize";
import { LocaleProvider, localeInitScript } from "@/lib/i18n/LocaleContext";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "SPORTGATE — el buscador de la experiencia deportiva de tu vida",
  description:
    "Marketplace de experiencias de cicloturismo premium: operadores, coaches, tiendas y profesionales de salud verificados en Europa, EE. UU. y Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable}`} data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Fija el tema, el idioma y el tamaño de letra guardados antes del
            primer pintado, para no dar un flash del valor equivocado
            (ver lib/theme.ts, lib/i18n/LocaleContext.ts y lib/fontSize.ts). */}
        <script dangerouslySetInnerHTML={{ __html: `(${themeInitScript.toString()})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(${localeInitScript.toString()})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(${fontScaleInitScript.toString()})();` }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider>
          <WizardProvider>
            <Nav />
            <main className="mx-auto max-w-5xl px-4">{children}</main>
            <Footer />
          </WizardProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
