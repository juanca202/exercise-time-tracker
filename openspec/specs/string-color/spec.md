## Purpose

Derivar de forma reutilizable un color estable a partir de un string (por ejemplo, el nombre de una Tarea o de un Proyecto), para pintar fondos y acentos decorativos en la UI —como el cuadro de icono de "Tareas Recientes" o la barra lateral de una tarjeta de Proyecto— sin necesidad de persistir un color por entidad. Cubre la utilidad pura de generación determinista de color y su aptitud para uso directo como estilo de fondo o acento.

## Requirements

### Requirement: Color determinista desde un string

El sistema SHALL exponer una utilidad pura que, dado un string no vacío, devuelva un color CSS válido (p. ej. hex o `hsl(...)`) de forma determinista: el mismo string de entrada MUST producir siempre el mismo color de salida.

#### Scenario: Mismo string produce el mismo color

- **WHEN** se invoca la utilidad dos veces con el mismo string
- **THEN** ambas invocaciones devuelven el mismo color

#### Scenario: Strings distintos pueden producir colores distintos

- **WHEN** se invocan la utilidad con dos strings distintos
- **THEN** el sistema puede devolver colores distintos (sin garantizar unicidad global, pero favoreciendo variedad)

### Requirement: Color usable como fondo o acento de UI

El color generado SHALL ser apto como fondo de un cuadro de icono pequeño o como acento (p. ej. barra lateral de una tarjeta), sin requerir persistencia del color.

#### Scenario: El color se puede aplicar como estilo de fondo

- **WHEN** la UI aplica el color resultante como `background-color` de un contenedor o acento
- **THEN** el valor es un color CSS válido y no lanza error en tiempo de ejecución
