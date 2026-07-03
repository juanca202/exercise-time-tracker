# TK-002: Componentes UI base y tokens de diseño

Estado: Ready
Historia: [US-001](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Dejar disponibles los componentes de presentación genéricos que usará toda la aplicación (Button, Modal, Field de texto, Textarea, Select), construidos sobre `@base-ui/react` y estilizados con Tailwind según los tokens de `DESIGN.md` (tema Precision Focus), junto con la configuración de fuentes (Inter, JetBrains Mono) y los tokens de color/tipografía/espaciado/radio en `globals.css`.

## Dependencias

- Ninguna dentro del alcance del repositorio (tarea de infraestructura de UI compartida).

## Referencias

- **Arquitectura:** [ADR-002: Estrategia de estilos UI con Tailwind CSS](../../../adr/ADR-002-tailwind-ui-styling.md), [ADR-006: Librería de componentes UI con Base UI](../../../adr/ADR-006-base-ui-component-library.md)
- **Diseño:** [DESIGN.md — Precision Focus](https://github.com/HectorAndradeBayteq/taller-sdd/blob/master/etapa-2/assets/DESIGN.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── ~ app/globals.css                # tokens Precision Focus (@theme): colores, radios, fuentes; import de Tailwind ya presente
    ├── ~ app/layout.tsx                  # fuentes Inter (next/font/google) y JetBrains Mono en lugar de Geist
    └── components/
        ├── + button.tsx                 # variantes primary/secondary sobre <button>, estados disabled/loading
        ├── + modal.tsx                   # wrapper de Base UI Dialog: overlay, panel, título, botón cerrar
        ├── + field.tsx                   # input de texto con label y mensaje de error asociado (Base UI Field + Input)
        ├── + textarea-field.tsx          # textarea con label y mensaje de error asociado
        └── + select-field.tsx            # wrapper de Base UI Select con label y opciones agrupables
```

### Subtareas

- [x] Añadir tokens de color (`--color-primary`, `--color-secondary`, `--color-tertiary`, superficies, bordes), radios (`--radius-sm/md/pill`) y fuente mono en `@theme inline` de `globals.css`, alineados a los valores de `DESIGN.md`.
- [x] Cargar `Inter` y `JetBrains Mono` con `next/font/google` en `layout.tsx`, reemplazando `Geist`/`Geist_Mono`.
- [x] Implementar `Button` con variantes visuales (primaria: fondo Indigo; secundaria: borde) y estado `disabled`.
- [x] Implementar `Modal` sobre `@base-ui/react` Dialog: trigger externo controlado por props (`open`, `onOpenChange`), título, botón de cierre, contenido vía `children`.
- [x] Implementar `Field`, `TextareaField` y `SelectField` sobre las primitivas `Field`/`Input`/`Select` de Base UI, mostrando mensaje de error cuando se provea.
- [x] Documentar cada componente exportado con TSDoc en español (props y ejemplo de uso básico).
- [x] Escribir tests de componente (Testing Library) para `Button` (estados) y `Modal` (abre/cierra, foco visible en el contenido) verificando comportamiento observable, no detalles de implementación.

## Observaciones

Sin pendientes documentados.
