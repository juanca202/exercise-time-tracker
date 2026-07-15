export const meta = {
  name: "work-implement-autoparallel",
  description:
    "Descubre el trabajo pendiente (US/TK o WI), lo ordena por dependencias y prioridad, e implementa en paralelo (worktrees, máx. 3 a la vez) integrando por merge secuencial",
  whenToUse:
    "Cuando se quiera implementar de corrido y sin pausas todo lo Ready de una US, un TK, un WI concreto, o -sin indicar nada- todo el trabajo Ready pendiente del repositorio, paralelizando las unidades sin dependencias entre sí (modo de ejecución paralela del skill work-implement).",
  phases: [
    { title: "Descubrir" },
    { title: "Implementar" },
    { title: "Integrar" },
  ],
};

const DISCOVERY_SCHEMA = {
  type: "object",
  properties: {
    scopeType: { type: "string", enum: ["US", "TK", "WI", "ALL"] },
    baseBranchForNewArtifacts: { type: "string" },
    excluded: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, reason: { type: "string" } },
        required: ["id", "reason"],
      },
    },
    units: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["TK", "WI"] },
          title: { type: "string" },
          artifactId: { type: "string" },
          artifactBranch: { type: "string" },
          artifactPath: { type: "string" },
          unitFilePath: { type: "string" },
          testCasesReadmePath: { type: "string" },
          dependsOn: { type: "array", items: { type: "string" } },
          explicitPriority: { type: "string" },
        },
        required: [
          "id",
          "type",
          "title",
          "artifactId",
          "artifactBranch",
          "artifactPath",
          "unitFilePath",
          "testCasesReadmePath",
          "dependsOn",
          "explicitPriority",
        ],
      },
    },
  },
  required: ["scopeType", "baseBranchForNewArtifacts", "units", "excluded"],
};

const IMPLEMENT_SCHEMA = {
  type: "object",
  properties: {
    unitId: { type: "string" },
    type: { type: "string", enum: ["TK", "WI"] },
    ready: { type: "boolean" },
    worktreeBranch: { type: "string" },
    worktreePath: { type: "string" },
    testsPass: { type: "boolean" },
    attempts: { type: "number" },
    commits: { type: "number" },
    summary: { type: "string" },
    blockers: { type: "string" },
  },
  required: [
    "unitId",
    "type",
    "ready",
    "worktreeBranch",
    "worktreePath",
    "testsPass",
    "attempts",
    "commits",
    "summary",
  ],
};

const INTEGRATE_SCHEMA = {
  type: "object",
  properties: {
    unitId: { type: "string" },
    merged: { type: "boolean" },
    conflictsResolved: { type: "boolean" },
    testsPassAfterMerge: { type: "boolean" },
    mergeCommit: { type: "string" },
    progressUpdated: { type: "boolean" },
    worktreeRemoved: { type: "boolean" },
    summary: { type: "string" },
  },
  required: [
    "unitId",
    "merged",
    "conflictsResolved",
    "testsPassAfterMerge",
    "progressUpdated",
    "worktreeRemoved",
    "summary",
  ],
};

const MAX_ATTEMPTS = 6;
const MAX_PARALLEL_PER_CHUNK = 3;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sortWave(wave, dependents) {
  const weight = { alta: 2, media: 1, baja: 0 };
  return wave.slice().sort((a, b) => {
    const wa = weight[a.explicitPriority] ?? 1;
    const wb = weight[b.explicitPriority] ?? 1;
    if (wa !== wb) return wb - wa;
    const da = dependents[a.id] || 0;
    const db = dependents[b.id] || 0;
    if (da !== db) return db - da;
    return a.id.localeCompare(b.id);
  });
}

function buildDiscoveryPrompt(scopeArg) {
  return `Eres el punto de partida de un pipeline autónomo de implementación (modo de ejecución paralela del skill work-implement). Trabaja en el checkout actual del repositorio, en modo solo lectura: no implementes nada, no crees ramas ni worktrees, no modifiques ningún archivo.

Entrada del usuario sobre el alcance: "${scopeArg || "(sin indicar nada — descubre TODO el trabajo Ready pendiente del repositorio)"}"

1. Resuelve el alcance (scopeType):
   - Si la entrada referencia una historia de usuario (US-XXX): scopeType "US" — alcance = todas sus TK-XXX en Estado Ready que no estén Done en su progress.md.
   - Si la entrada referencia una tarea puntual (TK-XXX): scopeType "TK" — valida que exista dentro de una US y que esté Ready; alcance = esa única TK (igual la reportas dentro de "units", el orquestador maneja tanto 1 como varias unidades igual).
   - Si la entrada referencia un work item (WI-XXX): scopeType "WI" — alcance = ese único WI si está Ready y no Done.
   - Si la entrada está vacía o no referencia nada concreto: scopeType "ALL" — descubre TODO el trabajo pendiente del repositorio: para cada US bajo docs/specs/user-stories/ con Estado Ready, todas sus TK-XXX Ready no Done; y para cada WI bajo docs/specs/work-items/ (si existe esa carpeta) con Estado Ready y no Done.
   - Si la referencia no existe o no está en Ready, repórtala en "excluded" con el motivo y deja "units" vacío si no queda nada más que descubrir.

2. Para cada unidad candidata (TK o WI), reúne:
   - id, type ("TK" o "WI"), title (título corto).
   - artifactId: la US-XXX dueña (para TK) o el propio WI-XXX (para WI).
   - artifactPath: carpeta real en disco (docs/specs/user-stories/US-XXX-[nombre-corto]/ o docs/specs/work-items/WI-XXX-[kebab-case]/).
   - unitFilePath: ruta del archivo de la unidad (el TK-XXX-[nombre].md para TK, o el README.md del WI para WI, ya que el WI es un documento único sin sub-tareas).
   - artifactBranch: nombre exacto de la rama de trabajo del artefacto:
     - TK: "feature/US-XXX-[nombre-corto]" (el segmento tras feature/ coincide con la carpeta de la US).
     - WI: por defecto "feature/WI-XXX-[kebab-case]"; si el campo "Tipo" del WI indica bug usa prefijo "fix/", si indica refactor o deuda-tecnica usa "refactor/", si indica dependencias u operativa usa "chore/" (siempre con el segmento WI-XXX-[kebab-case] después del prefijo).
   - testCasesReadmePath: ruta a test-cases/README.md dentro de la carpeta del artefacto si existe (aunque sea vacía la lista, repórtala igual si el archivo existe); cadena vacía si no hay carpeta test-cases/.
   - dependsOn: ids (dentro de este mismo lote de "units") de otras unidades que deben integrarse primero. Léelo del campo "Dependencias" del archivo y de menciones obvias en el texto ("depende de", "requiere que se implemente primero", referencias directas a otro TK-XXX/WI-XXX). Reglas estrictas:
     - Si la dependencia ya está Done (según su progress.md), NO la incluyas en dependsOn (ya está satisfecha).
     - Si la dependencia apunta a una unidad que NO forma parte de este mismo lote de "units" (por estar fuera del alcance pedido, en Draft, o ya Done) y tampoco está Done, NO la pongas en dependsOn: en su lugar, mueve la unidad dependiente completa a "excluded" con el motivo (dependencia fuera de alcance), y no la incluyas en "units". Esto es crítico: todo id que aparezca en un dependsOn DEBE existir también como id dentro de "units".
   - explicitPriority: "alta" | "media" | "baja" si el artefacto declara explícitamente una prioridad; cadena vacía si no la declara.

3. Determina baseBranchForNewArtifacts: la rama base desde la que se crean ramas de artefacto nuevas quue todavía no existan como rama local. Sigue GitFlow (ADR-010): usa "develop" si existe como rama local o remota; si no, usa la rama principal del repositorio (main). No asumas que es la rama actualmente activa en el checkout de esta sesión.

Responde solo con el resultado estructurado: scopeType, baseBranchForNewArtifacts, units (lista completa, puede estar vacía), excluded (lista, puede estar vacía).`;
}

function buildEnsureBranchPrompt(unit, baseBranch) {
  return `Verifica si la rama "${unit.artifactBranch}" ya existe en este repositorio (git rev-parse --verify --quiet "${unit.artifactBranch}"). Si NO existe, créala sin hacer checkout de ella y sin tocar el HEAD actual del checkout principal: git branch "${unit.artifactBranch}" "${baseBranch}". Si ya existe (la creaste vos u otra tarea en paralelo), no hagas nada más y no falles. No hagas push. Responde en una frase breve si la creaste o si ya existía.`;
}

function buildImplementPrompt(unit) {
  const isWI = unit.type === "WI";
  const unidadLabel = isWI
    ? `el work item ${unit.id} completo ("${unit.title}"), documento único sin sub-tareas`
    : `la tarea técnica ${unit.id} ("${unit.title}") de la historia ${unit.artifactId}`;

  return `Eres completamente responsable, de principio a fin, de implementar ${unidadLabel}, de forma 100% autónoma: sin pedir confirmaciones, sin hacer preguntas al usuario, sin detenerte por incertidumbres razonables, sin hacer handoff a otro skill.

Participas en el "modo de ejecución paralela con subagentes y worktrees" del skill work-implement. El orquestador ya resolvió el análisis de dependencias, el orden por olas y se aseguró de que la rama "${unit.artifactBranch}" exista. Tu única responsabilidad es esta unidad.

Paso 0 - Crea tu propio worktree aislado (todavía no existe, créalo tú):
1. git worktree add <ruta-temporal-única-fuera-del-árbol-principal> -b "wt/${unit.id}" "${unit.artifactBranch}"
2. A partir de aquí ejecuta TODO (lectura, edición, tests, commits) dentro de ese worktree; no toques el árbol de trabajo principal.

Sigue AGENTS.md, .agents/MEMORY.md y los ADRs en docs/adr/ (los ADR tienen prioridad si hay conflicto). Ante ambigüedades o información faltante, toma la decisión técnica más razonable siguiendo la arquitectura y convenciones existentes del proyecto.

Contexto de la unidad:
- Archivo de la unidad: ${unit.unitFilePath}
- Carpeta del artefacto: ${unit.artifactPath}
- progress.md: ${unit.artifactPath}/progress.md${isWI ? "" : " (compartido con las demás TK de esta US; edita únicamente la sección correspondiente a " + unit.id + ")"}
- ${unit.testCasesReadmePath ? `Test cases: lee ${unit.testCasesReadmePath} antes de escribir código para identificar los TC-XXX automatizables y cubrirlos dentro del ciclo TDD.` : "No hay carpeta test-cases/ para esta unidad: continúa sin test cases formales, basando los tests en los criterios de aceptación (AC-XXX) y reglas de negocio (BR-XX) disponibles; anótalo en tu resumen."}

Flujo obligatorio (equivalente al Paso 3 de la referencia del skill, adaptado a ejecución paralela):

1. Al iniciar: cambia el estado de "${unit.id}" en su progress.md a "In Progress" (créalo desde ~/.claude/skills/work-implement/assets/progress-template.md si el archivo no existe todavía) y puebla tu lista de to-dos: primera entrada el título de "${unit.id}", seguida de una entrada por cada tarea de su Plan de implementación (solo la descripción corta de cada IT-XX).
2. Por cada comportamiento del plan, aplica el ciclo TDD Red → Green → Refactor: escribe primero el test (basado en los criterios de aceptación AC-XXX y, si existen, reglas de negocio BR-XX / test cases TC-XXX automatizables) y verifica que falle antes de escribir código de producción; luego el mínimo código de producción para pasarlo; luego refactoriza (producción y test) sin romper tests, aplicando Clean Architecture (capas hacia adentro, casos de uso con la lógica de negocio, abstracciones en dominio).
3. Si la unidad genera o modifica UI: delega en el subagente "ui-specialist" solo si el proyecto lo define (no es el caso en esta sesión de agentes, así que impleméntala directamente); si la referencia de diseño es Figma, usa el MCP de Figma para obtener el contexto antes de implementar.
4. Marca "[ ]" => "[x]" cada subtarea completada en ${unit.unitFilePath}, y su entrada equivalente en tu lista de to-dos.
5. Al terminar todos los comportamientos del plan: ejecuta lint/typecheck/build del paquete afectado y toda la suite de tests. Si algo falla, corrige antes de continuar.
${isWI ? "6. Verifica los criterios de aceptación del WI contra los tests: si alguno no tiene cobertura, completa el ciclo TDD para ese criterio antes de seguir.\n" : ""}${isWI ? "7" : "6"}. Repite los pasos 2-${isWI ? "6" : "5"} hasta que todo el plan de la unidad esté implementado y en verde (máximo ${MAX_ATTEMPTS} intentos completos). Si tras ${MAX_ATTEMPTS} intentos no lo logras, detente, deja el trabajo parcial commiteado igualmente, reporta ready=false y detalla en "blockers" exactamente qué falta (no sigas intentando indefinidamente).
${isWI ? "8" : "7"}. Deja el estado de "${unit.id}" en progress.md como "In Progress" (NO lo cambies a "Done" tú mismo: el orquestador lo hace después de integrar tu worktree a la rama del artefacto). Sí completa "Cobertura de test cases" (si aplica) y "Decisiones adicionales" (si tomaste alguna decisión de sesión no documentada en la spec).
${isWI ? "9" : "8"}. Asegúrate de que no queden cambios sin commitear dentro de tu worktree (Conventional Commits según ADR-010).

No consideres la unidad lista (ready=true) hasta que: el plan completo esté implementado, todas las pruebas pasen, lint/typecheck/build estén en verde${isWI ? ", y todos los criterios de aceptación tengan cobertura de test" : ""}.

Responde exclusivamente con el resultado estructurado: unitId ("${unit.id}"), type ("${unit.type}"), ready, worktreeBranch ("wt/${unit.id}"), worktreePath (ruta absoluta de tu worktree), testsPass, attempts (intentos completos del ciclo que ejecutaste), commits (cantidad de commits que hiciste), summary (resumen breve de lo implementado), blockers (solo si ready=false).`;
}

function buildIntegratePrompt(unit, impl) {
  return `Debes integrar el trabajo ya finalizado de "${unit.id}" hacia la rama de artefacto "${unit.artifactBranch}", sin pedir confirmaciones ni hacer preguntas.

Trabaja en el checkout principal del repositorio (no en el worktree). El trabajo vive en la rama "${impl.worktreeBranch}" (worktree en "${impl.worktreePath}").

Pasos obligatorios:
1. Verifica que el worktree de "${impl.worktreeBranch}" no tenga cambios sin commitear (git -C "${impl.worktreePath}" status). Si los hay, commitéalos con Conventional Commits antes de continuar.
2. En el checkout principal, cambia a la rama "${unit.artifactBranch}" (ya existe).
3. Mergea "${impl.worktreeBranch}" hacia "${unit.artifactBranch}" (--no-ff). Si hay conflictos, resuélvelos conservando el trabajo de ambos lados cuando sea razonable (p. ej. en progress.md, si ambos lados añaden entradas distintas, conserva todas) y siguiendo la arquitectura/convenciones del proyecto para el resto; si el conflicto no es trivial y el resultado queda ambiguo, resuélvelo con el criterio técnico más conservador y déjalo explicado en el summary.
4. Ejecuta lint/typecheck/build y la suite de tests en "${unit.artifactBranch}" tras el merge. Si algo falla, corrígelo antes de dar por buena la integración: nunca dejes la rama del artefacto en rojo.
5. Cambia el estado de "${unit.id}" en ${unit.artifactPath}/progress.md de "In Progress" a "Done" y commitea ese cambio en "${unit.artifactBranch}".
6. Elimina el worktree temporal (git worktree remove "${impl.worktreePath}" --force si hace falta) y borra la rama local "${impl.worktreeBranch}" ya mergeada.

No hagas push a ningún remoto. No mergees "${unit.artifactBranch}" hacia ninguna otra rama: eso corresponde a /work-integrate, fuera del alcance de este paso.

Responde exclusivamente con el resultado estructurado: unitId ("${unit.id}"), merged, conflictsResolved, testsPassAfterMerge, mergeCommit (sha corto si merged=true), progressUpdated, worktreeRemoved, summary.`;
}

phase("Descubrir");
const discovery = await agent(buildDiscoveryPrompt(args), {
  schema: DISCOVERY_SCHEMA,
  label: "discover",
  agentType: "general-purpose",
});

if (!discovery.units || discovery.units.length === 0) {
  return {
    scope: discovery.scopeType,
    unidadesDescubiertas: 0,
    excluidas: discovery.excluded || [],
    mensaje:
      "No se encontró trabajo Ready pendiente de implementar dentro del alcance indicado.",
  };
}

const unitsById = new Map(discovery.units.map((u) => [u.id, u]));
const dependents = {};
discovery.units.forEach((u) =>
  u.dependsOn.forEach((d) => {
    dependents[d] = (dependents[d] || 0) + 1;
  }),
);

let pending = discovery.units.slice();
const done = new Set();
const ensuredArtifacts = new Set();
const implementResults = [];
const integrateResults = [];
let waveNumber = 0;

while (pending.length > 0) {
  waveNumber += 1;
  let wave = pending.filter((u) => u.dependsOn.every((d) => done.has(d)));
  if (wave.length === 0) {
    log(
      `Dependencias no resolubles entre las unidades restantes (${pending.map((u) => u.id).join(", ")}); se procesan de todas formas para no bloquear la ejecución.`,
    );
    wave = pending.slice();
  }
  pending = pending.filter((u) => !wave.includes(u));
  wave = sortWave(wave, dependents);

  log(`Ola ${waveNumber}: ${wave.map((u) => u.id).join(", ")}`);

  for (const batch of chunk(wave, MAX_PARALLEL_PER_CHUNK)) {
    phase("Implementar");

    const toEnsure = batch.filter(
      (u) => !ensuredArtifacts.has(u.artifactBranch),
    );
    if (toEnsure.length > 0) {
      await parallel(
        toEnsure.map(
          (u) => () =>
            agent(
              buildEnsureBranchPrompt(u, discovery.baseBranchForNewArtifacts),
              {
                label: `ensure-branch:${u.artifactBranch}`,
                phase: "Implementar",
                agentType: "general-purpose",
              },
            ),
        ),
      );
      toEnsure.forEach((u) => ensuredArtifacts.add(u.artifactBranch));
    }

    const batchResults = (
      await parallel(
        batch.map(
          (unit) => () =>
            agent(buildImplementPrompt(unit), {
              schema: IMPLEMENT_SCHEMA,
              label: `implement:${unit.id}`,
              phase: "Implementar",
              agentType: "general-purpose",
            }),
        ),
      )
    ).filter(Boolean);

    implementResults.push(...batchResults);

    phase("Integrar");
    for (const impl of batchResults) {
      const unit = unitsById.get(impl.unitId);
      if (!impl.ready) {
        integrateResults.push({
          unitId: impl.unitId,
          merged: false,
          conflictsResolved: false,
          testsPassAfterMerge: false,
          progressUpdated: false,
          worktreeRemoved: false,
          summary: `No se integró: no alcanzó los criterios de salida. Blockers: ${impl.blockers || "sin detalle"}`,
        });
        continue;
      }
      const integrateResult = await agent(buildIntegratePrompt(unit, impl), {
        schema: INTEGRATE_SCHEMA,
        label: `integrate:${impl.unitId}`,
        phase: "Integrar",
        agentType: "general-purpose",
      });
      integrateResults.push(integrateResult);
      if (integrateResult && integrateResult.merged) {
        done.add(impl.unitId);
      }
    }
  }
}

const mergedCount = integrateResults.filter((r) => r && r.merged).length;

return {
  scope: discovery.scopeType,
  baseBranchForNewArtifacts: discovery.baseBranchForNewArtifacts,
  unidadesDescubiertas: discovery.units.length,
  excluidas: discovery.excluded || [],
  implementaciones: implementResults.map((r) => ({
    unitId: r.unitId,
    type: r.type,
    ready: r.ready,
    testsPass: r.testsPass,
    attempts: r.attempts,
    commits: r.commits,
    summary: r.summary,
    blockers: r.blockers,
  })),
  integraciones: integrateResults,
  resumen: `${mergedCount}/${discovery.units.length} unidades integradas a su rama de artefacto. ${discovery.units.length - mergedCount} sin integrar.`,
};
