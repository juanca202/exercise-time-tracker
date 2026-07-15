export const meta = {
  name: "openspec-autoimplement",
  description:
    "Implementa de forma autónoma todas las specs de openspec/changes, en paralelo (worktrees), con ciclo code-review + trace-validate hasta aprobación, e integra por merge",
  whenToUse:
    "Cuando existan una o más specs en openspec/changes/ listas para implementarse sin supervisión, y se quiera paralelizar la implementación en worktrees independientes con revisión y trazabilidad obligatorias antes de integrar.",
  phases: [
    { title: "Descubrir" },
    { title: "Implementar" },
    { title: "Integrar" },
  ],
};

const DISCOVERY_SCHEMA = {
  type: "object",
  properties: {
    baseBranch: { type: "string" },
    specs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          summary: { type: "string" },
          dependsOn: { type: "array", items: { type: "string" } },
        },
        required: ["id", "summary", "dependsOn"],
      },
    },
  },
  required: ["baseBranch", "specs"],
};

const IMPLEMENT_SCHEMA = {
  type: "object",
  properties: {
    specId: { type: "string" },
    ready: { type: "boolean" },
    branch: { type: "string" },
    worktreePath: { type: "string" },
    iterations: { type: "number" },
    testsPass: { type: "boolean" },
    codeReviewVerdict: {
      type: "string",
      enum: [
        "aprobado",
        "aprobado_con_observaciones",
        "rechazado",
        "no_ejecutado",
      ],
    },
    traceValidateVerdict: {
      type: "string",
      enum: [
        "aprobado",
        "aprobado_con_observaciones",
        "rechazado",
        "no_ejecutado",
      ],
    },
    commits: { type: "number" },
    summary: { type: "string" },
    blockers: { type: "string" },
  },
  required: [
    "specId",
    "ready",
    "branch",
    "worktreePath",
    "iterations",
    "testsPass",
    "codeReviewVerdict",
    "traceValidateVerdict",
    "commits",
    "summary",
  ],
};

const INTEGRATE_SCHEMA = {
  type: "object",
  properties: {
    specId: { type: "string" },
    merged: { type: "boolean" },
    conflictsResolved: { type: "boolean" },
    testsPassAfterMerge: { type: "boolean" },
    mergeCommit: { type: "string" },
    worktreeRemoved: { type: "boolean" },
    summary: { type: "string" },
  },
  required: [
    "specId",
    "merged",
    "conflictsResolved",
    "testsPassAfterMerge",
    "worktreeRemoved",
    "summary",
  ],
};

const MAX_CYCLE_ITERATIONS = 8;

function buildImplementPrompt(spec, baseBranch) {
  return `Eres completamente responsable, de principio a fin, de implementar la spec OpenSpec "${spec.id}" (${spec.summary}) del repositorio, de forma 100% autónoma: sin pedir confirmaciones, sin hacer preguntas al usuario, sin detener la ejecución por incertidumbres razonables.

Ya estás trabajando dentro de un worktree/branch git aislado, creado desde la rama base "${baseBranch}". No crees otro worktree.

Sigue AGENTS.md, .agents/MEMORY.md y los ADRs en docs/adr/ (los ADRs tienen prioridad si hay conflicto). Si encuentras ambigüedades o información faltante en la spec, toma la decisión técnica más razonable siguiendo la arquitectura, convenciones y patrones existentes del proyecto. Nunca te detengas a pedir aclaraciones.

Lee todos los artefactos de la spec en openspec/changes/${spec.id}/ (proposal, design, tasks, specs, etc. según existan).

Ejecuta el siguiente ciclo obligatorio, repitiéndolo tantas veces como sea necesario (máximo ${MAX_CYCLE_ITERATIONS} iteraciones completas del ciclo):

1. Implementación: implementa completamente la spec (o las correcciones pendientes).
2. Pruebas: ejecuta todas las pruebas, validaciones y verificaciones necesarias del stack del proyecto (lint, typecheck, unit tests, build, e2e si aplica).
3. Invoca el skill "code-review" (usa la herramienta Skill con skill: "code-review") y analiza el resultado.
   - Aprobado → continúa al paso 5.
   - Aprobado con observaciones → corrige todas las observaciones posibles y vuelve a ejecutar "code-review".
   - Rechazado o con pendientes → corrige todos los problemas y vuelve a ejecutar "code-review".
4. Repite el paso 3 hasta obtener Aprobado o Aprobado con observaciones.
5. En cuanto code-review quede Aprobado o Aprobado con observaciones, invoca inmediatamente el skill "trace-validate" (herramienta Skill con skill: "trace-validate") y analiza el resultado.
   Si detecta cualquiera de: requisitos sin implementar, funcionalidad no contemplada, comportamiento inconsistente con la spec, criterios de aceptación incumplidos, trazabilidad incompleta, o mejoras obligatorias:
   - corrige la implementación y el código necesario
   - vuelve a ejecutar todas las pruebas (paso 2)
   - vuelve a ejecutar "code-review" (paso 3)
   - vuelve a ejecutar "trace-validate" (paso 5)

No consideres la spec finalizada hasta que se cumplan TODOS estos criterios de salida:
- todas las pruebas pasan
- code-review devuelve Aprobado o Aprobado con observaciones
- trace-validate devuelve Aprobado o Aprobado con observaciones
- no quedan acciones obligatorias pendientes
- no existen requisitos sin implementar

Si tras ${MAX_CYCLE_ITERATIONS} iteraciones completas del ciclo no logras cumplir los criterios de salida, detente, deja el trabajo parcial commiteado igualmente, y reporta ready=false con el detalle exacto de qué falta en "blockers" (no sigas iterando indefinidamente).

Antes de terminar: asegúrate de que no queden cambios sin commitear (usa Conventional Commits según ADR-010, ejecuta git status para confirmarlo). Determina tu propio nombre de rama actual (git rev-parse --abbrev-ref HEAD) y la ruta absoluta de tu worktree (pwd), y repórtalos.

Responde exclusivamente con el resultado estructurado solicitado por el schema: specId ("${spec.id}"), ready, branch, worktreePath, iterations (cuántas iteraciones completas del ciclo ejecutaste), testsPass, codeReviewVerdict, traceValidateVerdict, commits (cantidad de commits que hiciste), summary (resumen breve de lo implementado) y blockers (solo si ready=false).`;
}

function buildIntegratePrompt(result, baseBranch) {
  return `Debes integrar el trabajo ya finalizado y aprobado de la spec OpenSpec "${result.specId}" hacia la rama "${baseBranch}", sin pedir confirmaciones ni hacer preguntas.

La implementación vive en la rama "${result.branch}" (worktree en "${result.worktreePath}"). Ya pasó su ciclo de code-review y trace-validate con veredicto ${result.codeReviewVerdict} / ${result.traceValidateVerdict}.

Trabaja en el checkout principal del repositorio (no en el worktree). Pasos obligatorios:

1. Verifica que el worktree de "${result.branch}" no tenga cambios sin commitear (git -C "${result.worktreePath}" status). Si los hay, commitéalos con un mensaje Conventional Commits razonable antes de continuar.
2. Asegúrate de estar sobre la rama "${baseBranch}" en el checkout principal.
3. Resuelve posibles conflictos con "${baseBranch}" si existieran al mergear "${result.branch}", siguiendo la arquitectura y convenciones del proyecto (AGENTS.md, docs/adr/) para decidir cómo resolverlos.
4. Vuelve a ejecutar las pruebas del proyecto después de resolver conflictos (si hubo conflictos) o simplemente confirma que las pruebas siguen pasando tras el merge.
5. Realiza el merge de "${result.branch}" hacia "${baseBranch}" (usa --no-ff para dejar rastro del merge).
6. Elimina el worktree temporal en "${result.worktreePath}" (git worktree remove) y borra la rama local "${result.branch}" ya mergeada.

No hagas push a ningún remoto.

Responde exclusivamente con el resultado estructurado: specId ("${result.specId}"), merged, conflictsResolved, testsPassAfterMerge, mergeCommit (sha corto del commit de merge si merged=true), worktreeRemoved, summary.`;
}

phase("Descubrir");
const discovery = await agent(
  `Eres el punto de partida de un pipeline autónomo de implementación de specs OpenSpec. Trabaja en el checkout actual del repositorio (no crees ningún worktree).

1. Determina la rama actual con: git rev-parse --abbrev-ref HEAD.
2. Lista las specs pendientes en openspec/changes/ (ignora cualquier subcarpeta "archive"). Si el CLI "openspec" está disponible, usa "openspec list --json" para obtener los ids; si no, lista los subdirectorios de openspec/changes/.
3. Para cada spec, lee sus artefactos (proposal.md, design.md, tasks.md u otros que existan dentro de openspec/changes/<id>/) y detecta si declara una dependencia explícita hacia otra spec de este mismo lote (por ejemplo: "depende de", "requiere que se implemente primero", o una referencia directa al id de otra spec de openspec/changes/). Si no hay indicios claros, asume que no tiene dependencias (dependsOn: []).
4. No implementes nada, solo reporta.

Responde con la rama base actual (baseBranch) y la lista de specs encontradas: id, un resumen de una línea (summary), y dependsOn (ids de otras specs de este mismo lote que deben integrarse primero, o [] si no aplica). Si openspec/changes/ no existe o está vacío, responde specs: [].`,
  { schema: DISCOVERY_SCHEMA, label: "discover", agentType: "general-purpose" },
);

if (!discovery.specs || discovery.specs.length === 0) {
  return {
    baseBranch: discovery.baseBranch,
    specsEncontradas: 0,
    mensaje:
      "No se encontraron specs en openspec/changes/. No hay nada que implementar.",
  };
}

const baseBranch = discovery.baseBranch;
let pending = discovery.specs;
const done = new Set();
const implementResults = [];
const integrateResults = [];
let waveNumber = 0;

while (pending.length > 0) {
  waveNumber += 1;
  let wave = pending.filter((s) => s.dependsOn.every((d) => done.has(d)));
  if (wave.length === 0) {
    log(
      `Dependencias no resolubles entre specs restantes (${pending.map((s) => s.id).join(", ")}); se procesan de todas formas para no bloquear la ejecución.`,
    );
    wave = pending.slice();
  }
  pending = pending.filter((s) => !wave.includes(s));

  log(
    `Oleada ${waveNumber}: implementando ${wave.map((s) => s.id).join(", ")}`,
  );

  phase("Implementar");
  const waveResults = (
    await parallel(
      wave.map(
        (spec) => () =>
          agent(buildImplementPrompt(spec, baseBranch), {
            schema: IMPLEMENT_SCHEMA,
            label: `implement:${spec.id}`,
            phase: "Implementar",
            agentType: "general-purpose",
            isolation: "worktree",
          }),
      ),
    )
  ).filter(Boolean);

  implementResults.push(...waveResults);

  phase("Integrar");
  for (const result of waveResults) {
    if (!result.ready) {
      integrateResults.push({
        specId: result.specId,
        merged: false,
        conflictsResolved: false,
        testsPassAfterMerge: false,
        worktreeRemoved: false,
        summary: `No se integró: no alcanzó los criterios de salida. Blockers: ${result.blockers || "sin detalle"}`,
      });
      continue;
    }
    const integrateResult = await agent(
      buildIntegratePrompt(result, baseBranch),
      {
        schema: INTEGRATE_SCHEMA,
        label: `integrate:${result.specId}`,
        phase: "Integrar",
        agentType: "general-purpose",
      },
    );
    integrateResults.push(integrateResult);
    if (integrateResult && integrateResult.merged) {
      done.add(result.specId);
    }
  }
}

const mergedCount = integrateResults.filter((r) => r && r.merged).length;
const pendingCount = integrateResults.length - mergedCount;

return {
  baseBranch,
  specsEncontradas: discovery.specs.length,
  implementados: implementResults.map((r) => ({
    specId: r.specId,
    ready: r.ready,
    codeReviewVerdict: r.codeReviewVerdict,
    traceValidateVerdict: r.traceValidateVerdict,
    testsPass: r.testsPass,
    commits: r.commits,
    iterations: r.iterations,
    summary: r.summary,
    blockers: r.blockers,
  })),
  integraciones: integrateResults,
  resumen: `${mergedCount}/${discovery.specs.length} specs integradas a "${baseBranch}". ${pendingCount} sin integrar.`,
};
