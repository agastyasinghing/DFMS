# DFMS User Stories and Acceptance Criteria

## Purpose
This document translates the PRD and workbook-backed backlog into testable user stories for the DFMS Mission Control prototype. The selected data-intensive screen is the **Drone Inspection Dispatch Grid**.

## Source-of-Truth Note
The PRD (`dfms_prd.md`) is the source of truth. This document extracts and organizes story-level requirements for prototype design, implementation, and evaluation, and must remain aligned with PRD non-goals and asset boundaries.

## User Role Summary

| Role | Primary goal in prototype | Main information needed from screen | Main action/decision supported |
|---|---|---|---|
| Operations Manager | Coordinate multi-site inspection dispatch efficiently | Site/farm, turbine status, mission status, safety/weather blockers, drone/operator assignments | Decide what can be scheduled now vs blocked |
| Maintenance Technician | Plan maintenance work from synchronized inspection context | Turbine condition, weather, imagery status, damage severity, last inspection, flight path | Prioritize maintenance follow-up and review readiness |
| Safety Officer | Prevent unsafe overlap of crews and drone missions | Crew onsite indicator, safety status, blocker reasons, location context | Block/allow scheduling based on field safety conflicts |
| Environmental Analyst | Reduce wildlife/environmental harm from operations | Wildlife risk, environmental review state, route/restriction overlays, carbon/travel reduction cues | Require environmental review or hold missions when risk is high |
| IT / Systems Analyst | Ensure reliability and provenance of consolidated data | Source-system tags, freshness timestamps, read-only imported fields, sync coverage | Validate trustworthiness/completeness of displayed planning data |
| CTO / Security stakeholder | Validate scalable, controlled operational workflow assumptions | Field edit boundaries, imported vs editable separation, operational state visibility | Confirm prototype enforces clear control and data-boundary behaviors |
| Finance / Procurement stakeholder | Understand efficiency/cost implications of mission choices | Priority, downtime risk context, travel-reduction indicators, mission throughput states | Support investment and prioritization decisions with visible operational impact |

### US-001 — Drone Fleet Deployment

**User role:** Operations Manager  
**Story:** As an Operations Manager, I want to easily deploy the right drones to the right wind farm locations so that inspections are coordinated efficiently throughout all sites.  
**Workbook / PRD source:** PRD §7 Story 1; workbook backlog item for operations deployment coordination.  
**Prototype area supported:** Dispatch grid assignment and scheduling workflow.  
**Primary data fields:** site/farm, turbineId, turbineStatus, priority, droneAssignment, operatorAssignment, missionStatus, safetyStatus, weatherClearance.  
**Editable fields involved:** droneAssignment, operatorAssignment, plannedMissionTime, missionAction.  
**Acceptance criteria:**
- AC-001.1 Each grid row must show site/farm context, turbine status, assigned drone, assigned operator, and mission status in visible columns.
- AC-001.2 The active row action must be `Schedule` only when no blocking state is present (`Crew Conflict`, `Weather Hold`, `Certification Missing`, `Battery Low`, `Wildlife Review`, or `Blocked`).
- AC-001.3 If blocked, the action cell must show a specific blocker label (not a generic disabled control) and mission status must remain `Blocked` or `Needs Review`.
- AC-001.4 Changing drone/operator assignments in editable controls must update the row’s displayed assignment values in the static prototype state.

**Prototype implications:**
- Grid design must keep assignment and blocker state visible without opening a secondary view.
- Scheduling actions must communicate why dispatch is prevented when unsafe.

### US-002 — Technician’s Synced Inspection Data

**User role:** Maintenance Technician  
**Story:** As a Maintenance Technician, I want one synchronized place to see the key data points required for inspection planning so that I do not need to check multiple systems before acting.  
**Workbook / PRD source:** PRD §7 Story 2; workbook backlog item on synchronized technician data points.  
**Prototype area supported:** Grid column set, detail panel data provenance, sync/freshness metadata.  
**Primary data fields:** turbineId, turbineLocation, turbineStatus, droneCertification, temperature, windSpeed, windDirection, droneFlightPath, lastInspection, sourceSystemTags, dataFreshness.
**Editable fields involved:** maintenanceNotes, reviewState, assignment fields only; source-system fields read-only.
**Acceptance criteria:**
- AC-002.1 The interface must display turbine ID, location, status, drone certification, temperature, wind speed/direction, flight path, and last inspection for each mission.
- AC-002.2 Imported/system-of-record fields must be visually distinguished from editable planning fields using a consistent read-only indicator.
- AC-002.3 Selecting a mission must show source-system visibility in detail content, including which system supplies each major data group.
- AC-002.4 A sync timestamp or freshness label must be visible at row or detail level for mission data.

**Prototype implications:**
- Data dictionary and UI labeling must clearly separate editable planning controls from immutable imported values.

### US-003 — Crew and Drone Activity Safety

**User role:** Safety Officer  
**Story:** As a Safety Officer, I want activity status and location information for drones and maintenance crews to be easily accessible so that we can avoid overlaps that could cause safety risks.  
**Workbook / PRD source:** PRD §7 Story 3; workbook safety and crew/drone overlap backlog item.  
**Prototype area supported:** Safety columns, blocked filtering, blocker explanations in detail panel.  
**Primary data fields:** crewOnsite, safetyStatus, missionStatus, crewLocationNote, blockerReason.  
**Editable fields involved:** safetyOverrideNote (if simulated), plannedMissionTime (to resolve conflicts).
**Acceptance criteria:**
- AC-003.1 Rows with `crewOnsite = true` and overlapping mission timing must display `Crew Conflict` in the safety status column.
- AC-003.2 Rows marked `Crew Conflict` must not expose `Schedule` as active action and must display a blocked/next-step action label.
- AC-003.3 A blocked/unsafe filter must allow viewing only rows with `safetyStatus != Clear` or `missionStatus = Blocked`.
- AC-003.4 Detail content for a blocked row must explain the conflict and indicate required resolution before scheduling.

**Prototype implications:**
- Safety state should be scan-friendly in grid and auditable in detail panel narrative.

### US-004 — Weather-Aware Inspection Scheduling

**User role:** Operations Manager / Maintenance Technician  
**Story:** As an Operations Manager or Maintenance Technician, I want weather conditions visible during scheduling so that drone inspections are only planned under safe operating conditions.  
**Workbook / PRD source:** PRD §7 Story 4; workbook weather-aware scheduling requirement.  
**Prototype area supported:** Weather columns, safety/blocker logic, map weather overlay controls.  
**Primary data fields:** temperature, windSpeed, windDirection, weatherClearance, missionStatus, safetyStatus.  
**Editable fields involved:** none for imported weather values; mission planning fields respond to weather state.
**Acceptance criteria:**
- AC-004.1 Each mission row must show temperature, wind speed, wind direction, and weather clearance (`Clear`, `Caution`, or `Hold`).
- AC-004.2 Rows with weather clearance `Hold` must show `Weather Hold` in safety status and cannot present `Schedule` as an active action.
- AC-004.3 Rows with weather clearance `Caution` must remain schedulable only when no additional blockers are present and must be visually flagged as cautionary.
- AC-004.4 The map panel controls must include a weather-layer toggle/selector in prototype form (simulated UI control, no real API feed).

**Prototype implications:**
- Weather context must be available at-a-glance during dispatch without external tooling.

### US-005 — Drone Image Collection and Maintenance Prioritization

**User role:** Maintenance Technician  
**Story:** As a Maintenance Technician, I want to collect and review drone images of turbines so that turbines with major damage can be prioritized during maintenance scheduling.  
**Workbook / PRD source:** PRD §7 Story 5; workbook imagery + maintenance prioritization backlog item.  
**Prototype area supported:** Imagery status columns, detail placeholders, priority and review state indicators.  
**Primary data fields:** imageryStatus, damageSeverity, priority, lastInspection, reviewState, imagePlaceholderRef.  
**Editable fields involved:** reviewState, maintenancePriorityAdjustmentNote, technicianNotes.
**Acceptance criteria:**
- AC-005.1 Missions must display imagery status using only approved values (`No imagery`, `Capture pending`, `Images received`, `Review complete`).
- AC-005.2 Missions with `damageSeverity = Severe` must display `priority` as `High` or `Critical` and appear in severe/critical filter results.
- AC-005.3 The detail panel must include at least one inspection image placeholder region and a review state indicator.
- AC-005.4 Review states must be changeable in prototype controls without requiring file upload or external integrations.

**Prototype implications:**
- Static placeholders must communicate inspection evidence workflow without implementing real media pipelines.

### US-006 — Environmental Impact and Wildlife Review

**User role:** Environmental Analyst  
**Story:** As an Environmental Analyst, I want wildlife safety, flight activity, and environmental impact data visible so that drone operations minimize environmental harm.  
**Workbook / PRD source:** PRD §7 Story 6; workbook environmental impact and wildlife safety backlog item.  
**Prototype area supported:** Environmental risk indicators, map overlay controls, blocker explanations.  
**Primary data fields:** wildlifeRisk, environmentalReviewStatus, carbonTravelReductionIndicator, safetyStatus, missionStatus, restrictedAreaFlag.  
**Editable fields involved:** environmentalReviewStatus, analystNote, routeReviewDecision.
**Acceptance criteria:**
- AC-006.1 Rows with `wildlifeRisk = High` must show `Wildlife Review` in safety status and a blocked/review mission state until addressed.
- AC-006.2 Environmental detail content must display wildlife risk, environmental review state, and a carbon/travel-reduction indicator.
- AC-006.3 Map controls must include a restricted-area or wildlife overlay toggle (simulated control only).
- AC-006.4 Missions under wildlife review must not show `Schedule` as active action until status is cleared in prototype logic.

**Prototype implications:**
- Environmental constraints must be first-class scheduling signals, not buried annotations.

### US-007 — Consolidated Vendor, Spreadsheet, and Verbal Coordination Data

**User role:** Operations Manager / IT Analyst  
**Story:** As an Operations Manager, I want all drone fleet management information in one place so that I can track more fleets without relying on disconnected vendor apps, spreadsheets, and verbal updates.  
**Workbook / PRD source:** PRD §7 Story 7; workbook consolidation and systems integration backlog item.  
**Prototype area supported:** Source-system tags, data freshness, manual notes, imported-read-only field treatment.  
**Primary data fields:** sourceSystemTags, dataFreshness, manualOpsNote, turbineDataRef, weatherDataRef, hrisRef, vendorAppRef, maintenanceScheduleRef, environmentalLayerRef.  
**Editable fields involved:** manualOpsNote, local planning fields; imported references read-only.
**Acceptance criteria:**
- AC-007.1 The selected mission detail must list contributing systems, including Turbine CMS, Weather Forecasting System, HRIS, Drone Vendor App, Maintenance Schedule, Environmental Layer, and Manual Ops Note.
- AC-007.2 Source-system tags and freshness indicators must be visible without opening external applications.
- AC-007.3 Imported fields must be visually read-only, while manual ops notes remain editable in the prototype.
- AC-007.4 The interface must allow comparing consolidated context for multiple missions using the same single-screen workflow.

**Prototype implications:**
- Provenance and freshness UI patterns are required to build trust in consolidated operational data.

## Closed Sets Used by Acceptance Criteria

- **Turbine status:** `Active`, `Inactive`, `Fail`
- **Drone certification:** `Remote Pilot Certificate`, `None`
- **Priority:** `Low`, `Medium`, `High`, `Critical`
- **Weather clearance:** `Clear`, `Caution`, `Hold`
- **Safety status:** `Clear`, `Crew Conflict`, `Weather Hold`, `Certification Missing`, `Battery Low`, `Wildlife Review`, `Route Review`, `Blocked`
- **Mission status:** `Not Scheduled`, `Ready`, `Scheduled`, `In Flight`, `Completed`, `Blocked`, `Needs Review`
- **Damage severity:** `None`, `Minor`, `Moderate`, `Severe`, `Unknown`
- **Imagery status:** `No imagery`, `Capture pending`, `Images received`, `Review complete`
- **Wildlife risk:** `Low`, `Medium`, `High`

## Story-to-Screen Traceability Matrix

| Story ID | User role | Required grid columns | Required filters | Required editable fields | Required actions | Required detail/map elements |
|---|---|---|---|---|---|---|
| US-001 | Operations Manager | Site/Farm, Turbine Status, Drone Assignment, Operator Assignment, Mission Status, Safety Status | Site, Priority, Mission Status, Safety Status, Weather Clearance | Drone Assignment, Operator Assignment, Planned Time | Schedule / Block reason label | Blocker explanation in detail |
| US-002 | Maintenance Technician | Turbine ID, Location, Turbine Status, Drone Certification, Temp, Wind, Flight Path, Last Inspection, Freshness | Site, Turbine Status, Data freshness | Technician Notes, Review State (planning fields only) | View/edit planning notes | Source-system provenance details |
| US-003 | Safety Officer | Crew Onsite, Safety Status, Mission Status, Site | Unsafe/Blocked only, Crew Onsite | Planned Time, Safety Note (if included) | Blocked scheduling, resolve-conflict step | Conflict explanation in detail |
| US-004 | Operations Manager / Maintenance Technician | Temp, Wind Speed, Wind Direction, Weather Clearance, Safety Status | Weather Clearance, Unsafe/Blocked | (No direct weather edits) | Schedule only when not Hold/blocked | Weather-layer toggle on map |
| US-005 | Maintenance Technician | Imagery Status, Damage Severity, Priority, Last Inspection, Mission Status | Severity, Imagery Status, Priority | Review State, Technician Notes | Prioritize follow-up / mark review | Image placeholder + review state |
| US-006 | Environmental Analyst | Wildlife Risk, Safety Status, Mission Status, Site | Wildlife Risk, Environmental Review, Blocked | Environmental Review Status, Analyst Note | Hold/review gating before schedule | Wildlife/restricted overlay + environmental explanation |
| US-007 | Operations Manager / IT Analyst | Source Tags, Freshness, Manual Ops Note, Key mission columns | Source System, Freshness, Mission Status | Manual Ops Note, planning fields | Consolidated decision workflow | Multi-system source list in detail |

## Acceptance Evaluation Checklist

### Assignment alignment
- [ ] Documented seven core PRD stories (US-001 to US-007) with consistent format.
- [ ] Each story ties to the single selected screen: Drone Inspection Dispatch Grid.
- [ ] Story statements preserve PRD intent and workbook framing.

### Data dictionary coverage
- [ ] Core turbine, weather, drone, operator, safety, environmental, imagery, and provenance fields are explicitly named.
- [ ] Editable vs read-only field boundaries are documented for implementation.
- [ ] Closed-set values are listed and match prototype constraints.

### Dispatch workflow coverage
- [ ] Assignment workflow includes drone/operator selection and mission status progression.
- [ ] Scheduling action states are specified for allowed vs blocked conditions.
- [ ] Blocked rows provide explicit reason/next-step messaging.

### Safety/weather/environmental blockers
- [ ] Crew Conflict blocker behavior is testable.
- [ ] Weather Hold behavior is testable.
- [ ] Wildlife Review blocker behavior is testable.
- [ ] Blocked/unsafe filter behavior is included.

### Source-system consolidation
- [ ] Source-system tags are required and visible.
- [ ] Data freshness/sync visibility is required.
- [ ] Detail-level provenance requirements are present.
- [ ] Manual ops note handling is defined as editable within boundaries.

### Design/prototype implications
- [ ] Criteria are testable in static HTML/CSS/JS without real integrations.
- [ ] Story implications inform later tickets for grid, detail panel, and map controls.
- [ ] Requirements avoid backend/auth/API dependencies.

## Non-Goals Reminder
Future tickets must remain within prototype boundaries:
- No real drone dispatch.
- No real weather API calls.
- No real map tile integrations.
- No real HRIS/vendor systems.
- No backend.
- No authentication.
- No third-party logos, proprietary screenshots, copied map tiles, or brand assets.
- Design references are visual/interaction inspiration only.
