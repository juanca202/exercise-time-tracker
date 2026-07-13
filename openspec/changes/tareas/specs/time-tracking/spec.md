## ADDED Requirements

### Requirement: Start a timer for a specific Task

The system SHALL allow the user to start a timer for a specific Task by selecting it from the Task list (the ▷ icon next to each Task), storing the "En Ejecución" state, the start time, and the Task identifier locally. (US-002 AC-006)

#### Scenario: Start timer from task list

- **WHEN** the user clicks the ▷ icon next to a Task that has no active timer
- **THEN** the system starts a timer for that Task, storing its start time and marking it as running

### Requirement: Only one active timer at a time, with auto-stop

The system SHALL allow only one (1) active timer app-wide. If the user starts a timer while another is active on a different Task, the system SHALL automatically stop the previous timer, compute and persist its Time Record, before starting the new one. (US-002 AC-007, BR-02, BR-03)

#### Scenario: Starting a new timer auto-stops the previous one

- **WHEN** a timer is running for Task A and the user starts a timer for Task B
- **THEN** the system stops Task A's timer, computes and persists its Duration as a Time Record, and starts Task B's timer as "En Ejecución"

### Requirement: Stop the active timer and compute duration

The system SHALL allow the user to stop the active timer, recording the End Time and computing the Duration as End Time minus Start Time. (US-002 AC-008)

#### Scenario: Stop active timer

- **WHEN** the user clicks "Detener Sesión" while a timer is active
- **THEN** the system records the End Time and computes the Duration from Start Time to End Time

### Requirement: Reject a zero-or-negative computed duration

The system SHALL validate that a Duration computed when stopping a timer is greater than zero before persisting the resulting Time Record. (US-002 AC-009, BR-04)

#### Scenario: Computed duration is zero

- **WHEN** the timer is stopped in the same instant it was started, producing a computed Duration of zero
- **THEN** the system does not persist a Time Record with a zero Duration

### Requirement: Persist timer-generated Time Records immediately

The system SHALL persist to local storage, immediately, the Time Record generated when a timer is stopped. (US-002 AC-010)

#### Scenario: Record persists after stopping

- **WHEN** the user stops an active timer with a valid (>0) Duration
- **THEN** the resulting Time Record is present in local storage right after the stop action, without requiring further user action

### Requirement: Show current timer state

The interface SHALL clearly show the timer's state (active/inactive) and the Task it is associated with. (US-002 AC-011)

#### Scenario: Active timer is visible

- **WHEN** a timer is running for a Task
- **THEN** the Tasks screen shows the running state, the associated Task's name, and the elapsed time

### Requirement: Timer actions complete within 1 second

The system SHALL start a timer, and SHALL stop it and persist the resulting Time Record, in under 1 second from the user's action. (US-002 AC-012)

#### Scenario: Start/stop responsiveness

- **WHEN** the user starts or stops a timer
- **THEN** the corresponding state change and persistence complete in under 1 second

### Requirement: Create a manual Time Record

The system SHALL allow the user to create a manual Time Record for a Task by entering the Task, the Date, and the Duration, without using the timer. (US-002 AC-013)

#### Scenario: Manual entry with valid data

- **WHEN** the user submits the "Entrada Manual" form with a Task, a Date, and a Duration greater than zero
- **THEN** the system creates a Time Record with those values

### Requirement: Reject an invalid manually-entered duration

The system SHALL validate that a manually-entered Duration is greater than zero, rejecting the record otherwise. (US-002 AC-014, BR-04)

#### Scenario: Manual duration is zero or negative

- **WHEN** the user submits the "Entrada Manual" form with a Duration of zero (or an equivalent non-positive value)
- **THEN** the system blocks submission and does not create a Time Record

### Requirement: Persist manual Time Records locally

The system SHALL persist a manually-entered Time Record to local device storage. (US-002 AC-015)

#### Scenario: Manual record survives reload

- **WHEN** the user creates a manual Time Record and then reloads the application
- **THEN** the Time Record is still present with the same Task, Date and Duration

### Requirement: Fixed 40-hour Weekly Goal

The system SHALL compute the Weekly Goal as a fixed value of 40 hours (8 hours × 5 workdays), not configurable by the user. (US-002 AC-017, BR-05)

#### Scenario: Weekly Goal is always 40 hours

- **WHEN** the Weekly Goal is displayed on the Tasks screen
- **THEN** its value is 40 hours regardless of any existing Time Record or user setting

### Requirement: Weekly Total scoped to the current workweek (Monday–Friday)

The system SHALL compute and display the Weekly Total by summing Time Records (from the timer and manual entries) generated during the current workweek, defined as Monday through Friday, local time. Time Records dated Saturday or Sunday SHALL NOT be included in the Weekly Total. (US-002 AC-018, BR-05)

#### Scenario: Weekly Total sums workweek records

- **WHEN** Time Records exist with dates within the current Monday–Friday range
- **THEN** the Weekly Total equals the sum of their Durations

#### Scenario: Previous week excluded

- **WHEN** a Time Record's date falls in the calendar week before the current workweek
- **THEN** that Time Record's Duration is not included in the Weekly Total

#### Scenario: Weekend excluded

- **WHEN** a Time Record's date falls on a Saturday or Sunday within the current calendar week
- **THEN** that Time Record's Duration is not included in the Weekly Total

### Requirement: Weekly Goal percentage

The system SHALL display the percentage reached of the Weekly Goal, computed as (Weekly Total ÷ Weekly Goal) × 100. (US-002 AC-019)

#### Scenario: Percentage below goal

- **WHEN** the Weekly Total is less than the 40-hour Weekly Goal
- **THEN** the displayed percentage is (Weekly Total ÷ 40h) × 100, below 100%

#### Scenario: Percentage above goal

- **WHEN** the Weekly Total exceeds the 40-hour Weekly Goal
- **THEN** the displayed percentage exceeds 100%, without being capped
