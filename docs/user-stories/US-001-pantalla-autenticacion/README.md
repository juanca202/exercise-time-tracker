# US-001: Pantalla de autenticación

- Estado: Ready
- Fecha de creación: 2026-05-29
- Última actualización: 2026-05-29

## Descripción

**COMO** usuario de la demostración de banca web  
**QUIERO** disponer de una pantalla de inicio de sesión con usuario y contraseña  
**PARA** identificarme y acceder a las pantallas que el producto restringe a usuarios autenticados

## Referencias

- **Diseño (Figma):** [Pantallas taller SDD — nodo de referencia](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3167&m=dev) (archivo `7pt2W7JSic4ZoAVcgvQ5qD`, nodo `1-3167` en modo Dev).

## Criterios de aceptación

### Reglas de negocio

- **BR-01** — El sistema **DEBE** ofrecer un formulario de inicio de sesión con campos de usuario y contraseña, ambos obligatorios para enviar el formulario.
- **BR-02** — Tras un inicio de sesión exitoso, el sistema **DEBE** redirigir al usuario al resumen (inicio autenticado) y **DEBE** tratarlo como usuario autenticado para el resto del flujo permitido.
- **BR-03** — Si el usuario ya está autenticado e intenta abrir la pantalla de login, el sistema **DEBE** redirigirlo al resumen en lugar de mostrar el formulario de nuevo.
- **BR-04** — El producto **DEBE** implementar un **mecanismo** para marcar **rutas protegidas** a las que solo pueden acceder usuarios autenticados. **DEBE** existir al menos una ruta protegida que demuestre ese mecanismo: quien no haya iniciado sesión **NO DEBE** poder usar ese contenido y el sistema **DEBE** redirigirlo a la pantalla de inicio de sesión. Qué rutas concretas quedarán protegidas **NO** está fijado aquí y se decidirá cuando producto lo defina.
- **BR-05** — Toda acción explícita de cierre de sesión expuesta en la aplicación (encabezado, configuración u otro flujo) **DEBE** dejar al usuario fuera del área autenticada y **DEBE** redirigirlo **siempre** a la misma pantalla de inicio de sesión, sin variar el destino según el punto desde el que cerró.
- **BR-06** — En el alcance de esta historia, la verificación de sesión y el tratamiento de la identidad **DEBEN** implementarse con **mocks** (sin backend ni proveedor de identidad real acordado hasta nueva definición). Las obligaciones anteriores relativas a rutas protegidas y redirecciones **DEBEN** cumplirse en ese mismo alcance y **NO DEBEN** interpretarse como garantías de seguridad de producción.

### Escenarios

```gherkin
Escenario: SC-01 - Acceso a ruta protegida sin sesión
DADO un visitante sin sesión válida
CUANDO solicita una ruta que el producto haya definido como protegida mediante el mecanismo acordado
ENTONCES el sistema lo redirige a la pantalla de login

Escenario: SC-02 - Inicio de sesión exitoso
DADO un visitante sin sesión válida
CUANDO envía el formulario de login con usuario y contraseña no vacíos
ENTONCES el sistema reconoce al usuario como autenticado y lo redirige al resumen

Escenario: SC-03 - Login estando ya autenticado
DADO un usuario autenticado
CUANDO solicita la pantalla de login
ENTONCES el sistema lo redirige al resumen

Escenario: SC-04 - Cierre de sesión desde cualquier flujo
DADO un usuario autenticado
CUANDO ejecuta una acción de cierre de sesión desde cualquier parte de la aplicación que la ofrezca
ENTONCES el sistema deja de considerarlo autenticado y lo redirige a la pantalla de login
```

## Complejidad sugerida

- **Story points:** 3 (Fibonacci: 1, 2, 3, 5, 8, 13)
- **Justificación:** Pantalla de autenticación, mecanismo de rutas protegidas, cierre de sesión y redirecciones en la experiencia.

## Unidades de trabajo

- react-base-project

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                                                                                                                                                                      |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Cumple    | Se entiende por valor de negocio y flujo de usuario.                                                                                                                                                                                                                                                                                       |
| **N** | Negociable    | Cumple    | Forma de implementar el comportamiento es negociable en las tareas técnicas.                                                                                                                                                                                                                                                               |
| **V** | Valiosa       | Cumple    | Sin pantalla y flujo de login no hay acceso al resto del flujo protegido.                                                                                                                                                                                                                                                                  |
| **E** | Estimable     | Cumple    | Criterios y alcance funcional permiten estimar.                                                                                                                                                                                                                                                                                            |
| **S** | Pequeña       | Cumple    | Acotada a autenticación y acceso al flujo protegido descrito.                                                                                                                                                                                                                                                                              |
| **T** | Testeable     | Cumple    | Los escenarios **SC-01**, **SC-03** y **SC-04** fijan el foco obligatorio de verificación (rutas protegidas con mocks, login ya autenticado y cierre de sesión con destino único al login). **SC-02** y el resto de escenarios pueden comprobarse según criterio del equipo. Amenazas de seguridad de producción quedan fuera del alcance. |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Alcance funcional definido sin dependencias externas de producto no indicadas aquí.                                                                                                                                                                                                     |
| Inputs/outputs claros              | Cumple | Entrada: credenciales en formulario; salida: usuario autenticado o no y redirecciones acordadas.                                                                                                                                                                                        |
| Unidades de trabajo definidas      | Cumple | Listadas arriba.                                                                                                                                                                                                                                                                        |
| Sin decisiones técnicas pendientes | Cumple | Para esta historia **no** queda pendiente una decisión técnica abierta: el alcance acordado es **implementación con mocks** (sesión simulada, sin API ni IdP real hasta nueva definición). Las rutas protegidas y las redirecciones al login se realizan en ese mismo alcance de mocks. |
| Referencias de UI                  | Cumple | Enlace a Figma en **Referencias** (pantalla / nodo indicado).                                                                                                                                                                                                                           |
| Sin aclaraciones pendientes        | Cumple | Lo diferido queda documentado en **Observaciones** y en **BR-04** / **BR-06** sin bloquear la ejecución.                                                                                                                                                                                |

## Observaciones

- El catálogo concreto de rutas protegidas queda por definir con producto (**BR-04**); la historia exige solo el mecanismo y al menos una ruta de demostración.
- La integración con backend o proveedor de identidad real se difiere a historias posteriores (**BR-06**).
