## ADDED Requirements

### Requirement: Navegación lateral

El sistema SHALL mostrar una barra lateral de navegación con acceso a las secciones "Tareas", "Proyectos" e "Historial de registros", visible en todas las pantallas de la aplicación.

#### Scenario: La barra lateral está presente en cualquier pantalla

- **WHEN** el usuario abre cualquier pantalla de la aplicación
- **THEN** el sistema muestra la barra lateral con los enlaces a "Tareas", "Proyectos" e "Historial de registros"

### Requirement: Indicador de sección activa

El sistema SHALL indicar visualmente, dentro de la barra lateral, cuál sección está activa en cada momento.

#### Scenario: La sección activa se resalta al navegar

- **WHEN** el usuario navega a una de las secciones ("Tareas", "Proyectos" o "Historial de registros")
- **THEN** el sistema resalta el ítem correspondiente en la barra lateral y deja sin resaltar los demás

### Requirement: Encabezado de sección

El sistema SHALL mostrar, en el encabezado de cada pantalla, el nombre del producto ("TimeTracker") y el título de la sección activa.

#### Scenario: El encabezado refleja la sección actual

- **WHEN** el usuario se encuentra en una sección determinada
- **THEN** el encabezado muestra "TimeTracker" junto con el título de esa sección

### Requirement: Adherencia al sistema de diseño

El sistema SHALL adherirse a la paleta de colores, tipografía, espaciado y patrones de componentes definidos en `DESIGN.md` (tema Precision Focus) para la barra lateral y el encabezado.

#### Scenario: El layout usa los tokens del sistema de diseño

- **WHEN** se renderiza la barra lateral o el encabezado
- **THEN** los colores, tipografía y espaciado aplicados corresponden a los tokens definidos en `DESIGN.md`
