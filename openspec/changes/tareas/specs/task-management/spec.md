## ADDED Requirements

### Requirement: Create Task under a Project

The system SHALL allow the user to create a Task by selecting an existing Project and providing a Name; a Task without an associated Project or without a Name SHALL be rejected. (US-002 AC-001, AC-002, BR-01)

#### Scenario: Create task with project and name

- **WHEN** the user submits the "Nueva Tarea" form with an existing Project selected and a non-empty Name
- **THEN** the system creates the Task associated with that Project

#### Scenario: Reject task without project

- **WHEN** the user submits the "Nueva Tarea" form without selecting a Project
- **THEN** the system blocks submission and does not create a Task

#### Scenario: Reject task without name

- **WHEN** the user submits the "Nueva Tarea" form with a Project selected but an empty Name
- **THEN** the system blocks submission and does not create a Task

### Requirement: Persist Tasks locally

The system SHALL persist every created or edited Task, including its association to a Project, to local device storage. (US-002 AC-003)

#### Scenario: Task survives reload

- **WHEN** the user creates a Task and then reloads the application
- **THEN** the Task is still present with the same Name and Project association

### Requirement: Edit Task

The system SHALL allow the user to edit the Name of an existing Task at any time, reusing the "Nueva Tarea" modal precargado with the Task's current data, with its title and primary button label changed to "Editar Tarea". (US-002 AC-004)

#### Scenario: Edit task name

- **WHEN** the user opens an existing Task for edit, changes the Name, and submits
- **THEN** the system updates the Task with the new Name

### Requirement: Tasks screen and Task modal match the design system and Figma prototype

The Tasks screen (main panel) and the Task creation/edit modal SHALL implement the design defined in the Figma prototype and adhere to the DESIGN.md "Precision Focus" design system, matching it visually (layout, colors, typography, spacing, components). (US-002 AC-005, AC-016)

#### Scenario: Design tokens applied on Tasks screen

- **WHEN** the Tareas screen is rendered
- **THEN** color, typography and spacing tokens match DESIGN.md's Precision Focus theme

#### Scenario: Visual review against Figma

- **WHEN** the implemented Tareas screen and "Nueva Tarea"/"Editar Tarea" modal are compared against the corresponding Figma frames
- **THEN** layout, colors, typography, spacing and components match
