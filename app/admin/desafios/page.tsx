"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Sparkline } from "@/components/Sparkline";
import { Field, TextInput } from "@/components/FormControls";
import {
  getAdminChallenges,
  saveAdminChallenges,
  upsertAdminChallenge,
  deleteAdminChallenge,
  generateElevationProfile,
  type AdminChallenge,
  type ChallengeStatus,
  type Testimonio,
} from "@/lib/adminStore";
import { REGIONS } from "@/lib/regions";
import type { Level } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleContext";

const NIVELES: { value: Level | "cualquiera"; labelKey: string }[] = [
  { value: "principiante", labelKey: "admin.nivelPrincipiante" },
  { value: "intermedio", labelKey: "admin.nivelIntermedio" },
  { value: "intermedio-alto", labelKey: "admin.nivelIntermedioAlto" },
  { value: "avanzado", labelKey: "admin.nivelAvanzado" },
  { value: "cualquiera", labelKey: "admin.nivelCualquiera" },
];

const ESTADOS: { value: ChallengeStatus; labelKey: string }[] = [
  { value: "proximo", labelKey: "admin.statusProximo" },
  { value: "realizado", labelKey: "admin.statusRealizado" },
  { value: "archivado", labelKey: "admin.statusArchivado" },
];

function blankChallenge(): AdminChallenge {
  return {
    id: `reto-${Date.now()}`,
    name: "",
    region: REGIONS[0].name,
    country: "",
    aliases: [],
    distance_km: 0,
    elevation_gain_m: 0,
    avg_gradient: 0,
    max_gradient: 0,
    difficulty_score: 5,
    min_level: "cualquiera",
    description: "",
    elevation_profile: [],
    status: "proximo",
    featured: false,
    testimonios: [],
  };
}

export default function AdminDesafiosPage() {
  const { t } = useLocale();
  const [challenges, setChallenges] = useState<AdminChallenge[] | null>(null);
  const [form, setForm] = useState<AdminChallenge | null>(null);

  useEffect(() => {
    setChallenges(getAdminChallenges());
  }, []);

  function refresh() {
    setChallenges(getAdminChallenges());
  }

  function startEdit(c: AdminChallenge) {
    setForm({ ...c, testimonios: [...c.testimonios] });
  }

  function startNew() {
    setForm(blankChallenge());
  }

  function handleSave() {
    if (!form) return;
    const aliases = form.aliases.length > 0 ? form.aliases : [form.name.toLowerCase()];
    const elevation_profile =
      form.elevation_profile.length > 0 ? form.elevation_profile : generateElevationProfile(form.avg_gradient, form.max_gradient);
    upsertAdminChallenge({ ...form, aliases, elevation_profile });
    setForm(null);
    refresh();
  }

  function handleDelete(id: string) {
    deleteAdminChallenge(id);
    refresh();
  }

  function toggleFeatured(c: AdminChallenge) {
    if (!challenges) return;
    const next = challenges.map((x) => (x.id === c.id ? { ...x, featured: !x.featured } : x));
    saveAdminChallenges(next);
    setChallenges(next);
  }

  if (!challenges) return <AdminShell><div /></AdminShell>;

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.navDesafios")}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t("admin.desafiosSubtitulo")}</p>
        </div>
        {!form && (
          <button onClick={startNew} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600">
            + {t("admin.desafioNuevo")}
          </button>
        )}
      </div>

      {form ? (
        <DesafioForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => setForm(null)}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {challenges.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-bg-1 p-4">
              {c.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photo} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
              ) : (
                <Sparkline values={c.elevation_profile} className="h-16 w-24 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-base font-semibold text-ink">{c.name}</h3>
                  <span className="rounded-full bg-bg-2 px-2.5 py-0.5 text-[11px] font-bold text-ink-muted">
                    {t(ESTADOS.find((e) => e.value === c.status)?.labelKey ?? "")}
                  </span>
                  {c.rating !== undefined && <span className="text-[11px] font-semibold text-amber">★ {c.rating}</span>}
                </div>
                <div className="text-xs text-ink-muted">
                  {c.region} · {c.distance_km} km · {c.elevation_gain_m} m · {c.testimonios.length} {t("admin.testimoniosCount")}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                  <input
                    type="checkbox"
                    checked={c.featured}
                    onChange={() => toggleFeatured(c)}
                    className="h-4 w-4 rounded border-line-strong accent-accent"
                  />
                  {t("admin.destacarHome")}
                </label>
                <button onClick={() => startEdit(c)} className="rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-line-strong">
                  {t("admin.editar")}
                </button>
                <button onClick={() => handleDelete(c.id)} className="rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-xs font-bold text-ink-faint transition hover:text-ink">
                  {t("admin.eliminar")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function DesafioForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  form: AdminChallenge;
  setForm: (f: AdminChallenge) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useLocale();
  const [testimonioAutor, setTestimonioAutor] = useState("");
  const [testimonioTexto, setTestimonioTexto] = useState("");
  const [testimonioRating, setTestimonioRating] = useState("5");

  function addTestimonio() {
    if (!testimonioAutor.trim() || !testimonioTexto.trim()) return;
    const nuevo: Testimonio = {
      id: `test-${Date.now()}`,
      autor: testimonioAutor.trim(),
      texto: testimonioTexto.trim(),
      rating: Number(testimonioRating) || 5,
    };
    setForm({ ...form, testimonios: [...form.testimonios, nuevo] });
    setTestimonioAutor("");
    setTestimonioTexto("");
    setTestimonioRating("5");
  }

  function removeTestimonio(id: string) {
    setForm({ ...form, testimonios: form.testimonios.filter((x) => x.id !== id) });
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-bg-1 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.desafioNombreLabel")}>
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label={t("admin.desafioPaisLabel")}>
          <TextInput value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </Field>
      </div>

      <Field label={t("admin.desafioRegionLabel")}>
        <select
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
          className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink transition focus:border-accent focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.name} value={r.name}>
              {r.flag} {r.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label={t("admin.desafioDistanciaLabel")}>
          <TextInput type="number" value={form.distance_km} onChange={(e) => setForm({ ...form, distance_km: Number(e.target.value) })} />
        </Field>
        <Field label={t("admin.desafioDesnivelLabel")}>
          <TextInput type="number" value={form.elevation_gain_m} onChange={(e) => setForm({ ...form, elevation_gain_m: Number(e.target.value) })} />
        </Field>
        <Field label={t("admin.desafioPendienteMediaLabel")}>
          <TextInput type="number" value={form.avg_gradient} onChange={(e) => setForm({ ...form, avg_gradient: Number(e.target.value) })} />
        </Field>
        <Field label={t("admin.desafioPendienteMaxLabel")}>
          <TextInput type="number" value={form.max_gradient} onChange={(e) => setForm({ ...form, max_gradient: Number(e.target.value) })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.desafioNivelLabel")}>
          <select
            value={form.min_level}
            onChange={(e) => setForm({ ...form, min_level: e.target.value as Level | "cualquiera" })}
            className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink transition focus:border-accent focus:outline-none"
          >
            {NIVELES.map((n) => (
              <option key={n.value} value={n.value}>
                {t(n.labelKey)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.desafioEstadoLabel")}>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ChallengeStatus })}
            className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink transition focus:border-accent focus:outline-none"
          >
            {ESTADOS.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.labelKey)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t("admin.desafioDescripcionLabel")}>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint transition focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label={t("admin.desafioRatingLabel")} hint={t("admin.desafioRatingHint")}>
        <TextInput
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={form.rating ?? ""}
          onChange={(e) => setForm({ ...form, rating: e.target.value ? Number(e.target.value) : undefined })}
        />
      </Field>

      <PhotoUpload
        value={form.photo}
        onChange={(photo) => setForm({ ...form, photo })}
        label={t("admin.desafioFotoLabel")}
        buttonLabel={t("admin.fotoBoton")}
        removeLabel={t("admin.fotoQuitar")}
        hint={t("admin.desafioFotoHint")}
      />

      <label className="mb-6 flex items-center gap-2 text-sm font-semibold text-ink-muted">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={() => setForm({ ...form, featured: !form.featured })}
          className="h-4 w-4 rounded border-line-strong accent-accent"
        />
        {t("admin.destacarHome")}
      </label>

      <div className="border-t border-line pt-5">
        <h3 className="mb-3 text-sm font-bold text-ink">{t("admin.testimoniosTitulo")}</h3>
        {form.testimonios.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {form.testimonios.map((tst) => (
              <div key={tst.id} className="flex items-start gap-3 rounded-xl border border-line bg-bg-2 p-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-ink">
                    {tst.autor} <span className="text-amber">★ {tst.rating}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-ink-muted">{tst.texto}</p>
                </div>
                <button onClick={() => removeTestimonio(tst.id)} className="text-ink-faint hover:text-ink" aria-label={t("admin.eliminar")}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr_80px_auto]">
          <TextInput placeholder={t("admin.testimonioAutorPlaceholder")} value={testimonioAutor} onChange={(e) => setTestimonioAutor(e.target.value)} />
          <TextInput placeholder={t("admin.testimonioTextoPlaceholder")} value={testimonioTexto} onChange={(e) => setTestimonioTexto(e.target.value)} />
          <TextInput type="number" min={1} max={5} value={testimonioRating} onChange={(e) => setTestimonioRating(e.target.value)} />
          <button type="button" onClick={addTestimonio} className="rounded-xl border border-line bg-bg-2 px-3 py-2 text-xs font-bold text-ink transition hover:border-line-strong">
            + {t("admin.testimonioAgregar")}
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onSave} className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600">
          {t("admin.guardar")}
        </button>
        <button onClick={onCancel} className="rounded-xl border border-line bg-bg-2 px-6 py-3 text-sm font-bold text-ink transition hover:border-line-strong">
          {t("admin.cancelar")}
        </button>
      </div>
    </div>
  );
}
