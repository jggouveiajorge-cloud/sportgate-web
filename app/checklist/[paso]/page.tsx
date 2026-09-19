"use client";

import { useRouter } from "next/navigation";
import { useEffect, use } from "react";
import { CHALLENGES } from "@/lib/challenges";
import { getChallengeById } from "@/lib/match";
import { useWizard } from "@/components/WizardProvider";
import { Stepper } from "@/components/Stepper";
import { Field, OptionGrid, OptionCard, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

const TOTAL_PASOS = 6;
const STEPPER_KEYS = [
  "checklist.stepper1",
  "checklist.stepper2",
  "checklist.stepper3",
  "checklist.stepper4",
  "checklist.stepper5",
  "checklist.stepper6",
];

type ParamsShape = { paso: string };

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && typeof (value as any).then === "function";
}

export default function ChecklistPage({ params }: { params: ParamsShape | Promise<ParamsShape> }) {
  // Next.js 15+ entrega "params" como Promise (hay que desenvolverlo con
  // React.use()); Next.js 14 lo entrega como objeto plano. Soportamos ambos
  // para no depender de qué versión exacta de Next haya instalado npm.
  const resolvedParams = isPromise(params) ? use(params) : params;
  const paso = Math.min(Math.max(parseInt(resolvedParams.paso, 10) || 1, 1), TOTAL_PASOS);
  const router = useRouter();
  const { state, hydrated, updateIntake, setChallengeId } = useWizard();
  const { intake, challengeId, queryOriginal, filtros } = state;
  const challenge = getChallengeById(challengeId);
  const { t } = useLocale();
  // Modo explorar: se llegó aquí solo con un destino del buscador avanzado,
  // sin texto libre ni reto detectado (ver "Tres modos de uso" en el resumen).
  const modoExplorar = !challengeId && !queryOriginal && !!filtros?.region;
  const retosFiltrados = filtros?.region ? CHALLENGES.filter((c) => c.region === filtros.region) : CHALLENGES;

  useEffect(() => {
    if (hydrated && !challengeId && !queryOriginal && !filtros?.region) {
      router.replace("/");
    }
  }, [hydrated, challengeId, queryOriginal, filtros, router]);

  function next() {
    if (paso < TOTAL_PASOS) router.push(`/checklist/${paso + 1}`);
    else router.push("/resultados");
  }
  function back() {
    if (paso > 1) router.push(`/checklist/${paso - 1}`);
  }

  if (!hydrated) return null;

  return (
    <div className="my-8 animate-rise rounded-3xl border border-line bg-bg-1 p-6 shadow-md sm:p-10">
      <Stepper paso={paso} />
      <span className="mb-1 block text-[13px] text-ink-muted">
        {t("checklist.pasoLabel", { n: paso, total: TOTAL_PASOS })}
      </span>
      <h2 className="font-display mb-6 text-2xl font-semibold text-ink">{t(STEPPER_KEYS[paso - 1])}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {paso === 1 && (
          <>
            {filtros?.conflicto && challenge && (
              <div className="mb-6 flex gap-2 rounded-2xl bg-amber-soft px-4 py-3 text-sm leading-relaxed text-amber">
                {t("checklist.conflicto", {
                  name: challenge.name,
                  region: challenge.region,
                  filtroRegion: filtros.region ?? "",
                })}
              </div>
            )}
            {!challenge ? (
              <>
                <div className="mb-6 flex gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">
                  {modoExplorar
                    ? t("checklist.modoExplorar", { region: filtros?.region ?? "" })
                    : t("checklist.noReconocido", { query: queryOriginal ?? "" })}
                </div>
                <Field label={t("checklist.elegeTuReto")}>
                  <OptionGrid>
                    {retosFiltrados.map((c) => (
                      <OptionCard
                        key={c.id}
                        name="challenge"
                        value={c.id}
                        checked={challengeId === c.id}
                        onChange={() => setChallengeId(c.id)}
                      >
                        {c.name}
                      </OptionCard>
                    ))}
                  </OptionGrid>
                </Field>
              </>
            ) : (
              <div className="mb-6 flex gap-2 rounded-2xl bg-teal-soft px-4 py-3 text-sm leading-relaxed text-ink">
                {t("checklist.retoDetectado", {
                  name: challenge.name,
                  region: challenge.region,
                  km: challenge.distance_km,
                  elevation: challenge.elevation_gain_m,
                  gradient: challenge.avg_gradient,
                  description: challenge.description,
                })}
              </div>
            )}

            <Field label={t("checklist.fechaObjetivo")}>
              <TextInput
                type="date"
                value={intake.fecha_objetivo ?? ""}
                onChange={(e) => updateIntake({ fecha_objetivo: e.target.value })}
              />
            </Field>

            <Field label={t("checklist.duracionLabel")}>
              <OptionGrid>
                {[
                  ["dia", t("checklist.duracionDia")],
                  ["finde", t("checklist.duracionFinde")],
                  ["semana", t("checklist.duracionSemana")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="duracion"
                    value={val}
                    checked={intake.duracion === val}
                    onChange={() => updateIntake({ duracion: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.presupuestoLabel")}>
              <OptionGrid>
                {[
                  ["economico", t("checklist.presupuestoEconomico")],
                  ["medio", t("checklist.presupuestoMedio")],
                  ["premium", t("checklist.presupuestoPremium")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="presupuesto"
                    value={val}
                    checked={intake.presupuesto === val}
                    onChange={() => updateIntake({ presupuesto: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.focoLabel")}>
              <OptionGrid>
                {[
                  ["reto", t("checklist.focoReto")],
                  ["reto-paisaje", t("checklist.focoRetoPaisaje")],
                  ["reto-social", t("checklist.focoRetoSocial")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="foco_experiencia"
                    value={val}
                    checked={intake.foco_experiencia === val}
                    onChange={() => updateIntake({ foco_experiencia: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>
          </>
        )}

        {paso === 2 && (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              {["Strava", "Garmin", "TrainingPeaks"].map((s) => (
                <span
                  key={s}
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-line-strong bg-bg-2 px-4 py-2.5 text-sm font-semibold text-ink-muted"
                >
                  {t("checklist.conectarDemo", { service: s })}
                </span>
              ))}
            </div>
            <p className="mb-5 text-[13px] text-ink-muted">{t("checklist.conectarInfo")}</p>

            <Field label={t("checklist.nivelLabel")} hint={t("checklist.nivelHint")}>
              <OptionGrid>
                {[
                  ["principiante", t("checklist.nivelPrincipiante")],
                  ["intermedio", t("checklist.nivelIntermedio")],
                  ["intermedio-alto", t("checklist.nivelIntermedioAlto")],
                  ["avanzado", t("checklist.nivelAvanzado")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="nivel"
                    value={val}
                    checked={intake.nivel_autoevaluado === val}
                    onChange={() => updateIntake({ nivel_autoevaluado: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.volumenSemanal")}>
              <TextInput
                type="number"
                min={0}
                value={intake.volumen_semanal_h ?? ""}
                onChange={(e) => updateIntake({ volumen_semanal_h: e.target.value })}
              />
            </Field>
            <Field label={t("checklist.anosExperiencia")}>
              <TextInput
                type="number"
                min={0}
                value={intake.anos_experiencia ?? ""}
                onChange={(e) => updateIntake({ anos_experiencia: e.target.value })}
              />
            </Field>
            <Field label={t("checklist.desnivelHabitual")}>
              <TextInput
                type="number"
                min={0}
                value={intake.desnivel_habitual_mensual ?? ""}
                onChange={(e) => updateIntake({ desnivel_habitual_mensual: e.target.value })}
              />
            </Field>
            <Field label={t("checklist.semanasDisponibles")}>
              <TextInput
                type="number"
                min={0}
                value={intake.semanas_disponibles ?? ""}
                onChange={(e) => updateIntake({ semanas_disponibles: e.target.value })}
              />
            </Field>
          </>
        )}

        {paso === 3 && (
          <>
            <div className="mb-6 flex gap-2.5 rounded-2xl bg-teal-soft px-4 py-3.5 text-[13.5px] leading-relaxed text-teal">
              {t("checklist.parqInfo")}
            </div>

            <Field label={t("checklist.factorRiesgoLabel")}>
              <OptionGrid>
                {[
                  ["si", t("checklist.si")],
                  ["no", t("checklist.no")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="factor_riesgo_cv"
                    value={val}
                    checked={(intake.factor_riesgo_cv ?? "no") === val}
                    onChange={() => updateIntake({ factor_riesgo_cv: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.medicacionLabel")}>
              <OptionGrid>
                {[
                  ["si", t("checklist.si")],
                  ["no", t("checklist.no")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="medicacion_esfuerzo"
                    value={val}
                    checked={(intake.medicacion_esfuerzo ?? "no") === val}
                    onChange={() => updateIntake({ medicacion_esfuerzo: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.bandaEdadLabel")}>
              <OptionGrid>
                {["18-30", "31-45", "46-60", "60+"].map((val) => (
                  <OptionCard
                    key={val}
                    name="banda_edad"
                    value={val}
                    checked={intake.banda_edad === val}
                    onChange={() => updateIntake({ banda_edad: val as any })}
                  >
                    {val}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.seguroLabel")}>
              <OptionGrid>
                {[
                  ["si", t("checklist.si")],
                  ["no", t("checklist.no")],
                  ["no-se", t("checklist.noLoSe")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="seguro"
                    value={val}
                    checked={intake.seguro === val}
                    onChange={() => updateIntake({ seguro: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <OptionCard
              type="checkbox"
              name="consiento_salud"
              value="si"
              checked={intake.consiento_salud === "si"}
              onChange={() => updateIntake({ consiento_salud: intake.consiento_salud === "si" ? undefined : "si" })}
              wide
            >
              {t("checklist.consientoSalud")}
            </OptionCard>
          </>
        )}

        {paso === 4 && (
          <>
            <Field label={t("checklist.biciLabel")}>
              <OptionGrid>
                {[
                  ["propia", t("checklist.biciPropia")],
                  ["alquiler", t("checklist.biciAlquiler")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="bici"
                    value={val}
                    checked={(intake.bici ?? "alquiler") === val}
                    onChange={() => updateIntake({ bici: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            {intake.bici === "propia" && (
              <>
                <Field label={t("checklist.biciTipoLabel")}>
                  <OptionGrid>
                    {[
                      ["carretera", t("checklist.biciCarretera")],
                      ["gravel", t("checklist.biciGravel")],
                      ["mtb", t("checklist.biciMtb")],
                      ["electrica", t("checklist.biciElectrica")],
                    ].map(([val, txt]) => (
                      <OptionCard
                        key={val}
                        name="bici_tipo"
                        value={val}
                        checked={intake.bici_tipo === val}
                        onChange={() => updateIntake({ bici_tipo: val as any })}
                      >
                        {txt}
                      </OptionCard>
                    ))}
                  </OptionGrid>
                </Field>
                <Field label={t("checklist.biciTallaLabel")}>
                  <TextInput
                    placeholder={t("checklist.biciTallaPlaceholder")}
                    value={intake.bici_talla ?? ""}
                    onChange={(e) => updateIntake({ bici_talla: e.target.value })}
                  />
                </Field>
              </>
            )}

            <Field label={t("checklist.equipoAdicionalLabel")}>
              <OptionGrid>
                <OptionCard
                  type="checkbox"
                  name="alquiler_casco"
                  value="si"
                  checked={intake.alquiler_casco === "si"}
                  onChange={() => updateIntake({ alquiler_casco: intake.alquiler_casco === "si" ? undefined : "si" })}
                >
                  {t("checklist.casco")}
                </OptionCard>
                <OptionCard
                  type="checkbox"
                  name="alquiler_gps"
                  value="si"
                  checked={intake.alquiler_gps === "si"}
                  onChange={() => updateIntake({ alquiler_gps: intake.alquiler_gps === "si" ? undefined : "si" })}
                >
                  {t("checklist.gps")}
                </OptionCard>
                <OptionCard
                  type="checkbox"
                  name="alquiler_ropa"
                  value="si"
                  checked={intake.alquiler_ropa === "si"}
                  onChange={() => updateIntake({ alquiler_ropa: intake.alquiler_ropa === "si" ? undefined : "si" })}
                >
                  {t("checklist.ropaTecnica")}
                </OptionCard>
              </OptionGrid>
            </Field>
          </>
        )}

        {paso === 5 && (
          <>
            <Field label={t("checklist.alojamientoLabel")}>
              <OptionGrid>
                {[
                  ["hotel", t("checklist.hotel")],
                  ["rural", t("checklist.rural")],
                  ["albergue", t("checklist.albergue")],
                  ["no-necesito", t("checklist.noNecesito")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="alojamiento_tipo"
                    value={val}
                    checked={intake.alojamiento_tipo === val}
                    onChange={() => updateIntake({ alojamiento_tipo: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.transporteLabel")}>
              <OptionGrid>
                {[
                  ["si", t("checklist.si")],
                  ["no", t("checklist.no")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="transporte_aeropuerto"
                    value={val}
                    checked={intake.transporte_aeropuerto === val}
                    onChange={() => updateIntake({ transporte_aeropuerto: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>

            <Field label={t("checklist.acompanantesLabel")}>
              <TextInput
                type="number"
                min={0}
                value={intake.acompanantes ?? ""}
                onChange={(e) => updateIntake({ acompanantes: e.target.value })}
              />
            </Field>
          </>
        )}

        {paso === 6 && (
          <>
            <Field label={t("checklist.restriccionesLabel")}>
              <TextInput
                placeholder={t("checklist.restriccionesPlaceholder")}
                value={intake.restricciones_alimentarias ?? ""}
                onChange={(e) => updateIntake({ restricciones_alimentarias: e.target.value })}
              />
            </Field>

            <OptionCard
              type="checkbox"
              name="interes_suplementos"
              value="si"
              checked={intake.interes_suplementos === "si"}
              onChange={() =>
                updateIntake({ interes_suplementos: intake.interes_suplementos === "si" ? undefined : "si" })
              }
              wide
            >
              {t("checklist.suplementos")}
            </OptionCard>

            <Field label={t("checklist.ritmoLabel")}>
              <OptionGrid>
                {[
                  ["social", t("checklist.ritmoSocial")],
                  ["mixto", t("checklist.ritmoMixto")],
                  ["rendimiento", t("checklist.ritmoRendimiento")],
                ].map(([val, txt]) => (
                  <OptionCard
                    key={val}
                    name="ritmo"
                    value={val}
                    checked={(intake.ritmo ?? "mixto") === val}
                    onChange={() => updateIntake({ ritmo: val as any })}
                  >
                    {txt}
                  </OptionCard>
                ))}
              </OptionGrid>
            </Field>
          </>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          {paso > 1 ? (
            <button
              type="button"
              onClick={back}
              className="rounded-xl border border-line bg-bg-2 px-6 py-3 text-sm font-bold text-ink transition hover:border-line-strong"
            >
              {t("checklist.atras")}
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-600"
          >
            {paso === TOTAL_PASOS ? t("checklist.verResultados") : t("checklist.siguiente")}
          </button>
        </div>
      </form>
    </div>
  );
}
