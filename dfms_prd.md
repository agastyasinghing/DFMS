# DFMS Product Requirements Document

**Product:** Drone Fleet Management System for Wind Turbine Maintenance  
**Prototype Name:** DFMS Mission Control  
**Primary Screen:** Drone Inspection Dispatch Grid  
**Course Context:** INFO 380 product workbook prototype assignment  
**Version:** v0.1 PRD Draft  
**Status:** Planning-ready for Codex frontend tickets  
**Primary Output:** Functional static HTML/CSS/JavaScript prototype

---

## 1. Executive Summary

DFMS Mission Control is a static but functional frontend prototype for a drone fleet management system used in wind turbine maintenance. The prototype focuses on one data-intensive operational screen: the **Drone Inspection Dispatch Grid**. This screen consolidates turbine condition data, weather constraints, drone readiness, operator certification, maintenance crew location, environmental risk, and inspection imagery status into one decision-oriented command center.

The purpose of the prototype is not to build a production drone platform. The purpose is to demonstrate how the team’s workbook findings, backlog, stakeholder needs, data dictionary, and design decisions can become a cohesive, realistic interface that supports inspection scheduling and dispatch decisions.

The prototype should feel like a real field-operations console, not a generic dashboard. Its visual language should intentionally emulate several real product categories:

- **Windy.com-style weather map interaction** for wind overlays, layer controls, forecast timelines, and weather clearance visualization.
- **DroneDeploy-style inspection workflow** for mission planning, drone telemetry, site capture records, inspection imagery, and field-operation status.
- **NASA Worldview-style earth-data layering** for serious geospatial overlays, environmental layers, and map-driven decision context.
- **Bloomberg-style dense decision grids** for compact, high-signal operational data and alert-heavy row states.
- **Grafana-style observability panels** for KPI cards, operational health summaries, and status monitoring.

The final deliverable should be a polished single-page prototype that lets a user search, filter, inspect, edit, and act on turbine inspection missions using realistic sample data.

---

## 2. Workbook Grounding

This PRD is grounded in the team’s INFO 380 Product Workbook.

### 2.1 Project Overview

The workbook defines the project as a **Drone Fleet Management System for Wind Turbine Maintenance**. The system is intended to automate scheduling, dispatching, and monitoring of drones to improve turbine maintenance efficiency, reduce human risk, lower maintenance cost, and reduce carbon footprint.

### 2.2 Problem Statement

Current wind turbine inspection is largely manual. The workbook identifies several consequences:

- Wind turbines average roughly **170 hours/year/turbine** of downtime.
- Manual inspections expose maintenance technicians to high-risk physical inspection work.
- Manual intervention and travel increase cost and environmental footprint.
- Inspection information is fragmented across existing systems, spreadsheets, vendor applications, and verbal coordination.
- Operations teams need better scheduling support across weather conditions, drone availability, operator readiness, and maintenance crew activity.

### 2.3 Opportunity

The opportunity is to integrate existing systems so drone inspections can be scheduled safely and efficiently across varying field conditions. The prototype should show how DFMS can combine weather forecasting, turbine monitoring, HR/certification records, drone vendor data, field crew status, and environmental constraints into a unified operations screen.

### 2.4 Desired Outcomes

The prototype should demonstrate how DFMS can help achieve the workbook’s desired outcomes:

- Reduce inspection time.
- Reduce turbine downtime.
- Decrease safety incidents.
- Increase turbine lifespan through more frequent inspection.
- Reduce environmental impact by minimizing unnecessary travel and improving drone routing.
- Avoid wildlife disturbance during drone operations.
- Improve visibility into maintenance needs using drone imagery and inspection records.

---

## 3. Product Vision

DFMS Mission Control gives wind operations teams a single command-center interface for deciding which turbine inspections can safely proceed, which missions are blocked, and what action is needed to move a blocked mission forward.

The prototype should communicate this product vision clearly:

> **DFMS turns scattered turbine, drone, weather, safety, certification, and environmental data into one operational dispatch grid so wind teams can schedule safer drone inspections and reduce downtime.**

This vision should be visible in the page structure, data model, sample rows, action states, and acceptance criteria.

---

## 4. Product Goals

### 4.1 Assignment Goals

The prototype must satisfy the assignment requirements:

1. Review the backlog and identify user stories and acceptance criteria.
2. Choose one data-intensive screen that supports those stories.
3. Use the data dictionary to identify fields, types, constraints, and editable values.
4. Sketch the grid columns, filters, editable fields, and actions.
5. Create realistic sample data.
6. Write a detailed prototype generation prompt.
7. Generate a functional HTML prototype.
8. Evaluate the prototype against acceptance criteria and the prompt.

### 4.2 Product Demonstration Goals

The prototype should demonstrate:

- Consolidated drone inspection scheduling.
- Real-time-style operational visibility.
- Weather-aware dispatch decision-making.
- Drone/operator assignment.
- Safety blocker detection.
- Maintenance crew conflict awareness.
- Wildlife/environmental review states.
- Turbine condition prioritization.
- Source-system data trust through visible sync/source indicators.
- A polished interface suitable for a class presentation.

### 4.3 Visual Quality Goal

The prototype should feel like a carefully designed operations product. It should avoid generic AI dashboard aesthetics. It should have a distinctive, dense, high-confidence visual identity based on real-world operational tools.

---

## 5. Non-Goals

The prototype must not imply that production systems have been built.

Out of scope:

- No backend server.
- No real database.
- No authentication implementation.
- No real drone dispatch.
- No real weather API calls.
- No real FAA compliance engine.
- No real HRIS integration.
- No real vendor API integration.
- No real image upload or computer vision analysis.
- No real map tiles from Windy, DroneDeploy, NASA, Google, Mapbox, or other providers.
- No third-party logos, trademarks, or brand-identifying assets.
- No copied proprietary screenshots, icons, code, or images.

The prototype may simulate these capabilities using static sample data, generated UI elements, CSS/SVG shapes, and frontend-only JavaScript.

---

## 6. Target Users and Stakeholders

### 6.1 Operations Manager

**Goal:** Coordinate drone inspections across wind farms and reduce operational downtime.  
**Relevant workbook needs:** Smooth DFMS operation, drone/software provider coordination, operational strategy, real-time data and analytics, scalable integration with existing systems.  
**Prototype needs:** Dispatch grid, site filters, drone assignment, mission status, blocker visibility, multi-site overview.

### 6.2 Maintenance Technician

**Goal:** Identify turbine maintenance needs while reducing manual inspection risk.  
**Relevant workbook needs:** Detailed turbine and drone status, improved repair efficiency, safer inspection processes.  
**Prototype needs:** Turbine status, last inspection, damage severity, inspection image status, notes, maintenance review state.

### 6.3 Safety Officer

**Goal:** Prevent unsafe overlap between drone missions and maintenance crew activity.  
**Relevant workbook needs:** Safety policy compliance, risk assessment, avoiding harmful site overlap.  
**Prototype needs:** Crew onsite flag, drone/crew location awareness, safety status, blocked mission states, conflict explanations.

### 6.4 Environmental Analyst

**Goal:** Reduce harmful environmental impacts from drone operations.  
**Relevant workbook needs:** Wildlife safety analysis, environmental impact tracking, video/drone activity logs, carbon impact data.  
**Prototype needs:** Wildlife risk layer, route efficiency indicators, carbon savings estimate, environmental review blockers.

### 6.5 IT Analyst

**Goal:** Ensure data is reliable, consistent, integrated, and useful for visualization.  
**Relevant workbook needs:** System integrations, data warehouse, standardized visualization, reliable drone image transfer.  
**Prototype needs:** Source-system tags, sync timestamps, field provenance, integration status indicators.

### 6.6 Chief Technology Officer

**Goal:** Ensure the system can scale securely and integrate with existing infrastructure.  
**Relevant workbook needs:** Scalable architecture, reliable systems, encryption, authorization, operational readiness.  
**Prototype needs:** Visible architecture assumptions, role-based action constraints, source-system simulation, status observability.

### 6.7 Chief Security Officer

**Goal:** Ensure sensitive employee, operational, and infrastructure data is protected.  
**Relevant workbook needs:** Encryption, authorization, secure communication, zero-trust thinking across systems.  
**Prototype needs:** No real data exposure, role-based access notes, non-editable source fields, simulated access boundaries.

### 6.8 Finance / Procurement

**Goal:** Understand cost implications of drone fleet deployment and operational efficiency.  
**Relevant workbook needs:** Budget estimates, drone costs, real-time data cost tradeoffs.  
**Prototype needs:** Downtime risk, inspection priority, estimated avoided truck trip, carbon/travel reduction cues.

---

## 7. Selected User Stories

The prototype should focus on the strongest backlog stories rather than attempting to represent the entire product.

### Story 1: Drone Fleet Deployment

**As an Operations Manager, I want to easily deploy the right drones to the right wind farm locations so that inspections are coordinated efficiently throughout all sites.**

Source backlog item: Operations manager deploying drone fleet to wind farms.

#### Acceptance Criteria

- The screen displays turbine ID, site/farm, turbine status, last inspection, priority, drone assignment, operator assignment, and mission status.
- The user can filter missions by site, priority, weather clearance, safety status, and mission status.
- The user can assign or change the drone for a mission using an editable dropdown.
- The user can assign or change the operator for a mission using an editable dropdown.
- The user can schedule a mission only if the row has no blocking safety, weather, certification, battery, or crew conflict conditions.
- If a mission cannot be scheduled, the action button must show the reason or next required step instead of a generic disabled state.

### Story 2: Technician’s Seven Data Points Synced in One Place

**As a technician, I want one synchronized place to see the key data points required for inspection planning so that I do not need to check multiple systems before acting.**

Source backlog item: Technician’s 7 distinct data points synced in one place.

#### Acceptance Criteria

- The screen displays at minimum: turbine ID, turbine location, turbine status, drone certification, temperature, wind speed/direction, drone flight path, and last inspection.
- Source-system fields are visually marked as imported/read-only.
- The selected mission detail panel shows which source system each major field came from.
- The screen shows a sync timestamp or data freshness indicator.
- The prototype makes it clear which fields are editable planning fields and which fields are system-of-record fields.

### Story 3: Crew and Drone Activity Safety

**As a Safety Officer, I want activity status and location information for drones and maintenance crews to be easily accessible so that we can avoid overlaps that could cause safety risks.**

Source backlog item: Activity status and location information for drones and maintenance crews.

#### Acceptance Criteria

- The grid includes a crew onsite indicator.
- The grid includes a safety status column.
- If maintenance crew activity conflicts with a drone mission, the row must display `Crew Conflict`.
- Missions with crew conflict cannot be scheduled until the conflict is resolved.
- The detail panel explains the blocker and suggests the next action.
- The user can filter the grid to show only blocked or unsafe missions.

### Story 4: Weather-Aware Inspection Scheduling

**As an Operations Manager or Maintenance Technician, I want weather conditions visible during scheduling so that drone inspections are only planned under safe operating conditions.**

Source workbook connection: weather system integration, turbine inspection scheduling, safety requirements, and data dictionary fields for temperature and wind speed.

#### Acceptance Criteria

- The screen includes temperature, wind speed, wind direction, and weather clearance.
- Weather clearance must be derived from sample data conditions as `Clear`, `Caution`, or `Hold`.
- A mission with weather clearance `Hold` cannot be scheduled.
- Weather conditions must be visible in both the grid and selected mission detail panel.
- The map area should include weather-layer controls inspired by weather mapping tools.

### Story 5: Drone Image Collection and Maintenance Prioritization

**As a Maintenance Technician, I want to collect and review drone images of turbines so that turbines with major damage can be prioritized during maintenance scheduling.**

Source backlog item: Image collection from drones.

#### Acceptance Criteria

- The grid includes image/capture status or latest inspection imagery status.
- The grid includes damage severity.
- Severe or critical damage should increase visible inspection priority.
- The detail panel displays inspection image placeholders or capture tiles.
- The prototype should distinguish between `No imagery`, `Capture pending`, `Images received`, and `Review complete`.

### Story 6: Environmental Impact and Wildlife Review

**As an Environmental Analyst, I want wildlife safety, flight activity, and environmental impact data visible so that drone operations minimize environmental harm.**

Source backlog item: Environmental Analyst requesting lower environmental impacts and clear data/metrics.

#### Acceptance Criteria

- The grid includes wildlife risk.
- The grid includes an environmental or carbon/travel-reduction indicator.
- High wildlife risk should require review before mission scheduling.
- The map includes a visual wildlife or restricted-area layer.
- The detail panel explains environmental cautions when present.

### Story 7: Consolidated Vendor, Spreadsheet, and Verbal Coordination Data

**As an Operations Manager, I want all drone fleet management information in one place so that I can track more fleets without relying on disconnected vendor apps, spreadsheets, and verbal updates.**

Source backlog item: Automatic consolidation of information from vendor applications, spreadsheets, and verbal coordination.

#### Acceptance Criteria

- Each row includes small source-system tags or indicators.
- The detail panel lists data sources such as Turbine CMS, Weather Forecasting System, HRIS, Drone Vendor App, Maintenance Schedule, Environmental Layer, and Manual Ops Note.
- The prototype includes a data freshness indicator.
- Editable notes can represent manually captured coordination updates.
- Imported system fields remain read-only in the grid.

---

## 8. Primary Screen Requirements

### 8.1 Screen Name

**DFMS Mission Control: Drone Inspection Dispatch Grid**

### 8.2 Screen Purpose

The screen exists to answer one operational question:

> Which turbine inspection missions can safely proceed right now, and what must be fixed for blocked missions?

### 8.3 Screen Layout

The page should use a single-page command center layout:

1. **Global header**
   - Product name: DFMS Mission Control
   - Environment label: Prototype / Demo Mode
   - Sync timestamp
   - Current role: Operations Manager
   - Small operational status indicator

2. **KPI strip**
   - Ready to Schedule
   - Blocked Missions
   - Critical Priority
   - Weather Holds
   - Crew Conflicts
   - Wildlife Reviews

3. **Upper operations area**
   - Left: weather/map panel
   - Right: selected mission detail panel

4. **Filter bar**
   - Search input
   - Site filter
   - Priority filter
   - Weather clearance filter
   - Safety status filter
   - Mission status filter
   - Reset filters button

5. **Main dispatch grid**
   - Dense, scrollable data table
   - Editable dropdown cells where appropriate
   - Status pills
   - Row action buttons
   - Selected row highlight

6. **Footer / prototype note**
   - Static demo disclaimer
   - Assignment alignment note or hidden comments if necessary

---

## 9. Design Direction and Visual Requirements

### 9.1 Design Thesis

The prototype should feel like a **renewable-energy operations command center**. It should be more visually specific than a generic SaaS dashboard. It should use real operational density, map overlays, mission-state logic, and compact alert-heavy visual language.

The target blend is:

> **Windy map panel + DroneDeploy mission workflow + NASA-style layer logic + Bloomberg decision grid + Grafana operational KPI strip.**

### 9.2 Windy-Inspired Weather Map Requirements

Borrow interface patterns from weather map products, especially Windy.com, without using their logos, screenshots, or proprietary map assets.

Use:

- Dark map-like background.
- Animated or pseudo-animated wind streaks/particles.
- Weather layer chips or controls such as `Wind`, `Gust`, `Temp`, `Precip`, `Wildlife`, `Crew`.
- Bottom forecast/timeline scrubber such as `Now`, `+1h`, `+3h`, `+6h`, `+12h`.
- Weather legend showing wind speed thresholds.
- Clickable turbine markers colored by mission/safety status.
- A map picker or selected-point tooltip style when a turbine is selected.

Do not use:

- Windy logo.
- Windy map tiles.
- Windy screenshots.
- Windy proprietary icons.
- Directly copied code.

### 9.3 DroneDeploy-Inspired Mission Workflow Requirements

Borrow inspection workflow patterns from drone mapping and reality-capture products, especially DroneDeploy, without using brand assets.

Use:

- Selected mission card.
- Drone assignment and telemetry block.
- Battery, signal, capture status, route length, and image count.
- Inspection image/capture placeholder tiles.
- Flight route summary.
- Mission checklist for weather, battery, certification, crew clearance, and environmental review.
- Project/site framing: site, turbine, mission, capture, review.

Do not use:

- DroneDeploy logo.
- DroneDeploy screenshots.
- DroneDeploy proprietary images or icons.
- Exact product copy.
- Any UI that implies affiliation.

### 9.4 NASA Worldview-Inspired Layering Requirements

Borrow the idea of serious earth-data layers:

- Layer stack or overlay toggles.
- Environmental zone overlay.
- Weather/turbine/crew/wildlife overlays.
- Time-based viewing feel.
- Map legend with operational meaning.

The prototype should not use NASA imagery or logos unless explicitly using public-domain materials with proper attribution. For simplicity, generated CSS/SVG graphics are preferred.

### 9.5 Bloomberg-Inspired Data Grid Requirements

Borrow dense operational information design:

- Compact rows.
- High contrast.
- Status-heavy columns.
- Alert color logic.
- Numeric and categorical information visible at once.
- Low whitespace in the grid, but still readable.
- Quick row scanning.
- Strong sorting/filtering cues.

Avoid making the table look like a plain spreadsheet. The dispatch grid should feel like an operational decision table.

### 9.6 Grafana-Inspired Monitoring Requirements

Borrow observability dashboard patterns:

- KPI cards.
- Small trend/health indicators.
- Alert counts.
- Operational state summary.
- Data freshness/status indicator.

The KPI strip should quickly communicate whether the fleet is healthy, blocked, or ready.

### 9.7 Visual Style Requirements

Preferred style:

- Dark command-center theme.
- Deep navy, charcoal, and muted black base.
- Electric cyan/green for ready/clear states.
- Amber for caution/review states.
- Red for blocked/critical states.
- Blue for scheduled/in-flight states.
- Compact uppercase labels for metadata.
- Rounded cards, but not overly soft.
- Technical typography and dense spacing.
- Subtle map grid/terrain lines.
- Status pills and source tags.
- Clear selected-row treatment.

The UI should be presentation-polished but still believable as an internal operations tool.

### 9.8 Asset Usage Requirements

Because this prototype is for presentation/class use, it may closely emulate visual patterns from the reference products. However, all assets must be original or generated inside the prototype.

Allowed:

- Similar panel placement.
- Similar weather-layer interaction patterns.
- Similar route/mission card structure.
- Similar status-density and compact grid design.
- Original CSS/SVG weather particles.
- Original turbine markers.
- Original placeholder thumbnails.
- Original icon-like shapes built with CSS/SVG/Unicode.

Not allowed:

- Logos.
- Proprietary screenshots.
- Third-party product images.
- Exact copied map tiles.
- Brand-identifying names in the UI.
- Copied frontend code.
- Proprietary icon sets unless explicitly open source and attributed.

---

## 10. Data Dictionary Mapping

The prototype must visibly use the workbook’s data dictionary fields and extend them only where needed for the dispatch grid.

### 10.1 Workbook Fields

| Field | Workbook Type | Prototype Type | Required | Editable | Source System | Constraint / Notes |
|---|---|---:|---:|---:|---|---|
| Turbine ID | Integer | Integer/string display | Yes | No | Turbine Management System | 6 digits; cannot be null |
| Turbine Location | Decimal Degrees Coordinate Array | `{ lat, lon }` | Yes | No | Turbine Management System | Two decimal-degree values |
| Turbine Status | Text | Enum | Yes | No | Turbine Monitoring System | Allowed: `Active`, `Inactive`, `Fail` |
| Drone Certifications | Text | Enum | Yes | No | HRIS | Allowed: `Remote Pilot Certificate`, `None` |
| Temperature | Float | Number | Yes | No | Weather Forecasting System | Fahrenheit, two decimals |
| Wind Speed | Text Array in workbook | Number + direction enum/string | Yes | No | Weather Forecasting System | Prototype should separate speed and direction for clarity |
| Drone Flight Path | Image | Route/thumbnail/SVG placeholder | Yes | No | Flight Planning / Environmental Layer | Derived from turbine location and restrictions |
| Last Inspection | DateTime | ISO datetime string | Yes | No | Inspection History | Format: `YYYY-MM-DD HH:mm:ss` |

### 10.2 Prototype Extension Fields

The prototype may add the following fields to support the chosen data-intensive screen.

| Field | Type | Required | Editable | Allowed Values / Constraints | Rationale |
|---|---|---:|---:|---|---|
| siteName | String | Yes | No | Named wind farm/site | Needed for filtering and dispatch context |
| region | String | No | No | Region/state | Supports realistic operations context |
| priority | Enum | Yes | Yes | `Low`, `Medium`, `High`, `Critical` | Needed for scheduling decisions |
| damageSeverity | Enum | Yes | No | `None`, `Minor`, `Moderate`, `Severe`, `Unknown` | Supports image/prioritization story |
| weatherClearance | Enum | Yes | Derived/read-only | `Clear`, `Caution`, `Hold` | Supports weather-aware scheduling |
| safetyStatus | Enum | Yes | Derived/read-only | `Clear`, `Crew Conflict`, `Weather Hold`, `Certification Missing`, `Battery Low`, `Wildlife Review`, `Route Review`, `Blocked` | Main blocker status |
| assignedDrone | Enum/string | Yes | Yes | Drone ID or `Unassigned` | Supports drone deployment story |
| droneBattery | Integer | Yes | No | 0–100 | Dispatch blocker if low |
| operatorName | Enum/string | Yes | Yes | Operator name or `Unassigned` | Supports assignment workflow |
| crewOnsite | Boolean | Yes | No | `Yes` / `No` | Supports safety story |
| wildlifeRisk | Enum | Yes | No | `Low`, `Medium`, `High` | Supports environmental story |
| carbonSavingsKg | Number | No | No | Decimal >= 0 | Shows environmental benefit |
| imageryStatus | Enum | Yes | No | `No imagery`, `Capture pending`, `Images received`, `Review complete` | Supports image collection story |
| imageCount | Integer | No | No | >= 0 | Supports inspection detail panel |
| missionStatus | Enum | Yes | Yes | `Not Scheduled`, `Ready`, `Scheduled`, `In Flight`, `Completed`, `Blocked`, `Needs Review` | Main workflow state |
| sourceSystems | Array/string | Yes | No | Tags from integrated systems | Supports data consolidation story |
| lastSync | DateTime/string | Yes | No | Recent timestamp | Supports data freshness/trust |
| opsNote | String | No | Yes | Free text, max 160 chars | Represents verbal/manual coordination |
| routeDistanceMiles | Number | No | No | Decimal > 0 | Supports flight path/route summary |
| estimatedInspectionMinutes | Integer | No | No | Positive integer | Supports efficiency claim |

### 10.3 Editable vs Read-Only Logic

Editable fields:

- `priority`
- `assignedDrone`
- `operatorName`
- `missionStatus`
- `opsNote`

Read-only/source-controlled fields:

- Turbine ID
- Turbine Location
- Turbine Status
- Drone Certifications
- Temperature
- Wind Speed
- Wind Direction
- Drone Flight Path
- Last Inspection
- Weather Clearance
- Safety Status
- Crew Onsite
- Wildlife Risk
- Damage Severity
- Imagery Status
- Source Systems
- Last Sync

Rationale: the prototype should demonstrate good system design by preventing direct editing of system-of-record data while allowing users to edit operational planning fields.

---

## 11. Sample Data Requirements

The prototype should include 12–15 realistic mission rows. The data should intentionally include a mix of ready, blocked, caution, and completed states so every filter and acceptance criterion can be demonstrated.

### 11.1 Required Sample Row Types

At minimum, the dataset must include:

1. A clear mission ready to schedule.
2. A weather hold due to high wind.
3. A certification-missing blocker.
4. A crew conflict blocker.
5. A wildlife review blocker.
6. A low-battery blocker.
7. A critical turbine failure with severe damage.
8. An active turbine with overdue inspection.
9. An inactive turbine scheduled for later inspection.
10. A mission currently in flight.
11. A completed mission with review complete imagery.
12. A row with manual ops note indicating verbal coordination.

### 11.2 Example Status Logic

- If `weatherClearance = Hold`, set safety status to `Weather Hold` unless a higher priority blocker is present.
- If `droneCertifications = None`, set safety status to `Certification Missing`.
- If `crewOnsite = true`, set safety status to `Crew Conflict`.
- If `wildlifeRisk = High`, set safety status to `Wildlife Review`.
- If `droneBattery < 30`, set safety status to `Battery Low`.
- If multiple blockers are present, the detail panel should list all blockers even if the grid shows the primary blocker.
- If no blockers are present and mission is not completed/in-flight, safety status should be `Clear`.

### 11.3 Suggested Sites

Use fictional but realistic wind farm names:

- Columbia Ridge
- Sage Flats
- Red Mesa
- Pine Hollow
- Cedar Mesa
- High Desert Array
- North Sound Wind
- Palouse Ridge

### 11.4 Suggested Drone IDs

- DRN-014
- DRN-027
- DRN-031
- DRN-044
- DRN-052
- DRN-063
- Unassigned

### 11.5 Suggested Operators

- Maya Chen
- Luis Ortega
- Priya Shah
- Ethan Brooks
- Jordan Lee
- Unassigned

---

## 12. Dispatch Logic Requirements

The prototype must include simple frontend-only rule logic that determines row state and available actions from sample data.

### 12.1 Blocker Detection

For each row, compute blockers:

- Weather blocker if weather clearance is `Hold` or wind speed exceeds threshold.
- Certification blocker if assigned operator certification is `None` or operator is unassigned.
- Battery blocker if drone battery is below 30%.
- Crew blocker if crew onsite is true.
- Wildlife blocker if wildlife risk is `High`.
- Route blocker if flight path status is missing or route review required.

### 12.2 Primary Safety Status

Primary safety status should be determined in priority order:

1. `Crew Conflict`
2. `Weather Hold`
3. `Certification Missing`
4. `Battery Low`
5. `Wildlife Review`
6. `Route Review`
7. `Clear`

If a mission is `Completed`, the row may show `Clear` or `Completed` depending on table design, but the detail panel should show that no dispatch action is needed.

### 12.3 Action Button Logic

| Conditions | Button Label | Behavior |
|---|---|---|
| No blockers, mission not scheduled | `Schedule` | Updates mission status to `Scheduled` |
| Mission scheduled | `View Mission` | Selects row and opens details |
| Mission in flight | `Monitor` | Selects row and shows telemetry detail |
| Mission completed | `View Findings` | Selects row and shows imagery/review detail |
| Weather blocker | `Weather Hold` | Selects row and explains blocker |
| Crew conflict | `Resolve Crew` | Selects row and explains blocker |
| Certification missing | `Assign Certified Operator` | Selects row and highlights operator dropdown |
| Battery low | `Swap Drone` | Selects row and highlights drone dropdown |
| Wildlife high | `Review Route` | Selects row and explains environmental caution |
| Multiple blockers | `Blocked` or top blocker action | Detail panel lists all blockers |

### 12.4 Editing Rules

- Changing assigned drone should update displayed battery and drone status if drone metadata is modeled.
- Changing assigned operator should update certification if operator metadata is modeled.
- Changing mission status should update KPI counts.
- Changing priority should update row priority pill and sorting if implemented.
- Editing notes should persist in frontend state until page refresh.
- Source-system fields should not be editable.

---

## 13. Grid Requirements

### 13.1 Required Columns

The dispatch grid should include the following columns:

1. Turbine ID
2. Site
3. Turbine Status
4. Last Inspection
5. Priority
6. Damage
7. Weather
8. Wind
9. Drone
10. Battery
11. Operator
12. Certification
13. Crew
14. Wildlife
15. Safety Status
16. Mission Status
17. Action

If space is limited, some fields may be abbreviated but should remain accessible in the detail panel.

### 13.2 Optional Columns

- Region
- Carbon Savings
- Route Distance
- Imagery Status
- Source Systems
- Last Sync

### 13.3 Grid Behavior

- Rows should be generated dynamically from `data.js` or an inline sample data array.
- Filters should update the visible rows without page reload.
- KPI cards should update based on current dataset state.
- Selecting a row should update the detail panel and map marker selection.
- Row styling should reflect priority and safety status.
- Critical/high-priority blocked missions should be visually prominent.

---

## 14. Filter Requirements

The prototype should include these filters:

| Filter | Type | Values |
|---|---|---|
| Search | Text input | Turbine ID, site, operator, drone |
| Site | Dropdown/chips | All + site names |
| Priority | Dropdown/chips | All, Low, Medium, High, Critical |
| Weather | Dropdown/chips | All, Clear, Caution, Hold |
| Safety | Dropdown/chips | All, Clear, Crew Conflict, Weather Hold, Certification Missing, Battery Low, Wildlife Review, Route Review |
| Mission Status | Dropdown/chips | All, Not Scheduled, Ready, Scheduled, In Flight, Completed, Blocked, Needs Review |

Optional useful filters:

- `Blocked Only`
- `Ready Only`
- `Critical Only`
- `Crew Conflict Only`

---

## 15. Detail Panel Requirements

The selected mission detail panel should act like a DroneDeploy-inspired inspection/mission card.

### 15.1 Header

- Turbine ID
- Site name
- Priority pill
- Safety status pill
- Mission status pill

### 15.2 Mission Summary

- Assigned drone
- Battery
- Operator
- Certification
- Estimated inspection time
- Route distance
- Last inspection
- Turbine status

### 15.3 Blockers and Recommendations

Show:

- Primary blocker
- All blockers
- Recommended next action

Examples:

- `Wind speed exceeds safe flight threshold. Recheck forecast at +3h.`
- `Maintenance crew currently onsite. Coordinate crew clearance before dispatch.`
- `Assigned operator lacks Remote Pilot Certificate. Assign certified operator.`
- `Wildlife risk high near flight path. Environmental review required.`

### 15.4 Inspection Imagery Section

Show 3–4 generated placeholder tiles:

- Blade surface
- Nacelle view
- Tower base
- Route snapshot

Each tile should have small status labels:

- Pending capture
- Received
- Needs review
- Reviewed

### 15.5 Source-System Trust Section

Show compact source tags:

- Turbine CMS
- Weather Forecasting System
- HRIS
- Drone Vendor App
- Maintenance Schedule
- Environmental Layer
- Manual Ops Note

Each source tag should show a freshness indicator such as `synced 2m ago`, `synced 5m ago`, or `manual note`.

---

## 16. Map Panel Requirements

The map panel should be visually impressive even though it is static/generated.

### 16.1 Required Elements

- Dark map-like background.
- Turbine markers positioned across the panel.
- Selected turbine marker highlight.
- Drone route line for selected mission.
- Wind particle/streak overlay using CSS or SVG.
- Weather layer controls.
- Map legend.
- Forecast timeline.
- Environmental/wildlife zone overlay.

### 16.2 Marker Colors

- Green/cyan: Clear/ready
- Amber: Caution/review
- Red: Blocked/critical
- Blue: Scheduled/in flight
- Gray: Completed/inactive

### 16.3 Map Interactions

- Clicking a turbine marker selects the corresponding grid row and updates the detail panel.
- Clicking layer controls visually toggles layer active states.
- Timeline buttons update active state only; no real weather model required.
- Map should not depend on external map libraries or API keys.

---

## 17. KPI Requirements

Top KPI cards should summarize operational state.

Required cards:

1. Ready to Schedule
2. Blocked Missions
3. Critical Priority
4. Weather Holds
5. Crew Conflicts
6. Wildlife Reviews

Each card should include:

- Count
- Short label
- Small sublabel or delta text
- Color-coded state

KPI counts should be computed from the current sample dataset. If filters are applied, either preserve global counts or show filtered counts consistently. Simplicity preference: KPI counts reflect the full current dataset after edits.

---

## 18. Accessibility and Usability Requirements

Even though the prototype is visually dense, it should remain usable.

Requirements:

- Text must have sufficient contrast against dark background.
- Status should not rely on color alone; use labels.
- Inputs and buttons should have visible focus states.
- Table should remain readable on laptop screen width.
- Use semantic HTML where reasonable.
- Buttons should have descriptive labels.
- Avoid tiny body text below readable size.
- Provide fallback text for image placeholders.

---

## 19. Security and Access Considerations for Prototype

The workbook includes security, authorization, authentication, encryption, and access-control needs. The static prototype should represent these ideas without implementing production security.

### 19.1 Represented in Prototype

- Show role label in header, such as `Role: Operations Manager`.
- Mark source-system fields as read-only.
- Editable fields should be limited to planning fields.
- Show source-system trust indicators.
- Include notes in documentation that production DFMS would require MFA, role-based access control, encryption, and audit logging.

### 19.2 Not Implemented in Prototype

- Login.
- MFA.
- Role switching.
- Audit logs.
- Real access control.
- Real encryption.
- Backend security.

---

## 20. Non-Functional Requirements

### 20.1 Performance

- Prototype should load locally in under 2 seconds.
- Filtering should feel instant for 12–15 sample rows.
- No network calls required.

### 20.2 Reliability

- App should work by opening `prototype/index.html` in a browser.
- JavaScript errors should not break initial rendering.
- If no rows match filters, show a clean empty state.

### 20.3 Maintainability

- Separate concerns:
  - `index.html` for structure.
  - `styles.css` for design.
  - `data.js` for sample data.
  - `app.js` for rendering and interactions.
- Use readable function names.
- Keep sample data easy to edit.
- Avoid unnecessary dependencies.

### 20.4 Portability

- The prototype should not require Node, build tools, package installation, API keys, or deployment.
- It should run as static HTML/CSS/JS.

---

## 21. Recommended Repository Structure

```txt
DFMS/
  README.md
  docs/
    PRD.md
    USER_STORIES.md
    PROMPT.md
    ACCEPTANCE_EVALUATION.md
    CODEX_TICKETS.md
  prototype/
    index.html
    styles.css
    app.js
    data.js
```

Optional later additions:

```txt
  assets/
    README.md
  screenshots/
    prototype-preview.png
```

No external assets are required for the first implementation wave.

---

## 22. Codex Build Strategy

The frontend should be built in small tickets. Each ticket should be mergeable and should avoid massive rewrites.

### Ticket 01: Repository Scaffold and Documentation Shell

Create the project structure, initial README, docs placeholders, and prototype file placeholders.

### Ticket 02: PRD and User Story Documentation

Add this PRD and extract the user stories/acceptance criteria into `docs/USER_STORIES.md`.

### Ticket 03: Data Model and Sample Dataset

Create realistic sample data in `prototype/data.js`, including rows for ready, blocked, weather hold, certification missing, crew conflict, wildlife review, low battery, in-flight, and completed missions.

### Ticket 04: Base HTML Layout

Build the core page structure: header, KPI strip, map/detail split, filter bar, and dispatch grid container.

### Ticket 05: Command-Center Styling System

Implement the dark operations-console visual style, status colors, cards, table styling, map area, and responsive layout.

### Ticket 06: Dynamic Grid Rendering

Render rows from sample data into the dispatch grid with status pills, editable dropdowns, and action buttons.

### Ticket 07: Filtering and Search

Implement search and filters for site, priority, weather, safety, and mission status.

### Ticket 08: Editable Planning Fields

Implement editable priority, drone assignment, operator assignment, mission status, and ops note behavior.

### Ticket 09: Dispatch Rule Engine

Implement frontend-only blocker detection, safety status calculation, action button logic, and KPI updates.

### Ticket 10: Windy-Inspired Map Panel

Implement static/generated map panel with turbine markers, wind streaks, layer controls, legend, and forecast timeline.

### Ticket 11: DroneDeploy-Inspired Mission Detail Panel

Implement selected mission detail panel with telemetry, blockers, recommendations, source tags, and inspection imagery placeholders.

### Ticket 12: Evaluation Documentation and Polish

Complete `docs/PROMPT.md`, `docs/ACCEPTANCE_EVALUATION.md`, final README instructions, and QA pass.

---

## 23. Prototype Generation Prompt Requirements

The later detailed prompt for Codex or an HTML generator should include:

- Project background from workbook.
- Assignment requirements.
- Chosen screen: Drone Inspection Dispatch Grid.
- User stories and acceptance criteria.
- Data dictionary fields and constraints.
- Required sample data variety.
- Visual reference strategy.
- Asset usage boundaries.
- Required files.
- Required interactions.
- Evaluation checklist.

The prompt should explicitly instruct the model to avoid generic dashboard design and to emulate multiple real operational interface patterns.

---

## 24. Acceptance Evaluation Plan

The final prototype should be evaluated against both the assignment requirements and product acceptance criteria.

### 24.1 Assignment Evaluation

| Requirement | Evidence in Final Repo |
|---|---|
| Review backlog and identify stories | `docs/USER_STORIES.md` |
| Choose one data-intensive screen | `docs/PRD.md` and prototype page title |
| Use data dictionary fields | `docs/PRD.md`, `prototype/data.js`, grid columns |
| Identify fields/types/constraints/editable values | `docs/PRD.md` data dictionary mapping |
| Sketch grid columns, filters, editable fields, actions | `docs/PRD.md`, prototype UI |
| Create realistic sample data | `prototype/data.js` |
| Write detailed prompt | `docs/PROMPT.md` |
| Generate functional HTML prototype | `prototype/index.html`, `styles.css`, `app.js`, `data.js` |
| Evaluate prototype | `docs/ACCEPTANCE_EVALUATION.md` |

### 24.2 User Story Evaluation

The final evaluation document should verify:

- Operations Manager can identify and schedule ready missions.
- Technician can view synced turbine, weather, drone, certification, flight path, and last inspection data.
- Safety Officer can identify crew conflicts and blocked missions.
- Weather holds prevent scheduling.
- Drone image/capture status is visible.
- Wildlife/environmental review states are visible.
- Source-system consolidation is visible through tags and freshness indicators.

### 24.3 Design Evaluation

The final evaluation should answer:

- Does the UI avoid generic SaaS dashboard aesthetics?
- Does the map area clearly evoke weather-layer and geospatial tools?
- Does the detail panel clearly evoke drone inspection workflows?
- Does the table feel like a dense decision grid rather than a plain spreadsheet?
- Are all copied/emulated patterns adapted into DFMS-branded original UI?
- Are third-party logos, screenshots, and proprietary assets avoided?

---

## 25. Open Questions

These questions can remain unresolved for the class prototype but should be documented:

1. How many wind farms and turbines does the fictional organization operate?
2. What exact wind speed threshold should block drone flight?
3. Should damage severity be manually reviewed or automatically inferred from imagery?
4. How should verbal coordination be captured in a real production system?
5. How often should weather, HRIS, turbine, and drone vendor data sync?
6. What source system has final authority when imported fields conflict?
7. What exact role-based access groups should exist in production?
8. Should wildlife review rely on public environmental data, internal surveys, or manual analyst input?
9. How should audit logging work for dispatch changes?
10. How would production DFMS handle partial connectivity at remote wind farm sites?

---

## 26. Final Build Definition of Done

The prototype is complete when:

- `prototype/index.html` opens locally and displays the full interface.
- The page includes a global header, KPI cards, map panel, detail panel, filters, and dispatch grid.
- The grid renders realistic sample data.
- Filters and search work.
- Editable planning fields work.
- Rule-based safety/action logic works.
- Selecting a row updates the map/detail panel.
- The visual design strongly follows the selected real-product inspiration patterns without using protected brand assets.
- Documentation explains user stories, data fields, acceptance criteria, prompt, and evaluation.
- The prototype clearly satisfies the INFO 380 assignment requirements.

---

## 27. PRD Summary

DFMS Mission Control should be a polished, static, data-intensive operations prototype centered on one core screen: the Drone Inspection Dispatch Grid. It should show how drone inspection scheduling becomes safer and more efficient when turbine status, weather data, operator certification, crew location, drone readiness, wildlife risk, and inspection imagery are consolidated into one command center.

The strongest version of the prototype is not a generic dashboard. It is a purpose-built field operations console: weather-map driven, inspection-workflow aware, dense with operational data, and clearly tied to the workbook’s backlog, data dictionary, stakeholder needs, and success outcomes.

