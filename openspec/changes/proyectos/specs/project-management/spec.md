## ADDED Requirements

### Requirement: Create Project

The system SHALL allow the user to create a Project by providing a required Name and an optional Description. (US-001 AC-001, AC-002)

#### Scenario: Create with name and description

- **WHEN** the user submits the "Nuevo Proyecto" form with a non-empty Name and a Description
- **THEN** the system creates the Project with both fields and closes the form

#### Scenario: Create with name only

- **WHEN** the user submits the "Nuevo Proyecto" form with a non-empty Name and an empty Description
- **THEN** the system creates the Project with the Description stored as empty/absent

#### Scenario: Reject empty name

- **WHEN** the user submits the "Nuevo Proyecto" form with an empty or whitespace-only Name
- **THEN** the system blocks submission and does not create a Project

### Requirement: Persist Projects locally

The system SHALL persist every created or edited Project (Name, Description) to local device storage, surviving an unexpected app close or a device restart. (US-001 AC-003)

#### Scenario: Project survives reload

- **WHEN** the user creates a Project and then reloads the application
- **THEN** the Project is still present with the same Name and Description

### Requirement: List Projects

The system SHALL display the list of all created Projects. (US-001 AC-004)

#### Scenario: Projects screen shows all projects

- **WHEN** the user navigates to the Proyectos screen and at least one Project exists
- **THEN** every existing Project is shown as a card in the list

#### Scenario: Empty state with no projects

- **WHEN** the user navigates to the Proyectos screen and no Project exists
- **THEN** the system shows the empty/"Crear Nuevo Proyecto" state instead of a project card

### Requirement: Edit Project

The system SHALL allow the user to edit the Name and Description of an existing Project at any time, reusing the "Nuevo Proyecto" modal precargado with the Project's current data, with its title and primary button label changed to "Editar Proyecto". (US-001 AC-005, AC-006)

#### Scenario: Edit name and description

- **WHEN** the user opens an existing Project for edit, changes the Name and/or Description, and submits
- **THEN** the system updates the Project with the new values

#### Scenario: Reject empty name on edit

- **WHEN** the user edits an existing Project and clears the Name field before submitting
- **THEN** the system blocks submission and the Project's Name remains unchanged

### Requirement: Projects screen matches the design system

The Projects screen SHALL adhere to the DESIGN.md "Precision Focus" design system (palette, typography, spacing, component patterns). (US-001 AC-007)

#### Scenario: Design tokens applied

- **WHEN** the Proyectos screen is rendered
- **THEN** color, typography and spacing tokens match those defined in DESIGN.md for the Precision Focus theme

### Requirement: Sidebar navigation to Projects

The application SHALL provide a sidebar navigation link that gives access to the Proyectos section from any other section. (US-001 AC-008)

#### Scenario: Navigate from another section

- **WHEN** the user is on the Tareas or Historial de registros screen and clicks "Proyectos" in the sidebar
- **THEN** the application navigates to the Proyectos screen

### Requirement: Projects screen matches the Figma prototype

The implementation of the Projects screen SHALL be visually faithful (layout, colors, typography, spacing, components) to the referenced high-fidelity Figma prototype. (US-001 AC-009)

#### Scenario: Visual review against Figma

- **WHEN** the implemented Proyectos screen is compared against the Figma "Proyectos" frame
- **THEN** layout, colors, typography, spacing and components match
