(function initializeDfmsPrototype() {
  var DEFAULT_FILTERS = {
    search: '',
    site: 'All',
    priority: 'All',
    weather: 'All',
    safety: 'All',
    mission: 'All'
  };

  function getEnums() {
    return (globalThis.DFMS_DATA && globalThis.DFMS_DATA.ENUMS) || {};
  }

  function getDrones() {
    return (globalThis.DFMS_DATA && globalThis.DFMS_DATA.DRONES) || [];
  }

  function getOperators() {
    return (globalThis.DFMS_DATA && globalThis.DFMS_DATA.OPERATORS) || [];
  }

  function findDroneById(droneId) {
    return getDrones().find(function (drone) {
      return drone.id === droneId;
    }) || null;
  }

  function findOperatorById(operatorId) {
    return getOperators().find(function (operator) {
      return operator.id === operatorId;
    }) || null;
  }

  var state = {
    missions: [],
    filteredMissions: [],
    selectedMissionId: null,
    filters: Object.assign({}, DEFAULT_FILTERS),
    editedMissionIds: new Set(),
    map: {
      activeLayer: 'Wind',
      activeTimeline: 'Now',
      focusedMissionId: null
    }
  };

  var BLOCKER_DEFINITIONS = {
    crew: {
      code: 'crew',
      safetyStatus: 'Crew Conflict',
      label: 'Crew Conflict',
      message: 'Maintenance crew is onsite in the mission corridor.',
      severity: 'hard',
      source: 'Maintenance Schedule'
    },
    weather: {
      code: 'weather',
      safetyStatus: 'Weather Hold',
      label: 'Weather Hold',
      message: 'Weather clearance is Hold or wind exceeds drone envelope.',
      severity: 'hard',
      source: 'Weather Forecasting System'
    },
    certification: {
      code: 'certification',
      safetyStatus: 'Certification Missing',
      label: 'Certification Missing',
      message: 'Assigned operator lacks required Remote Pilot certification.',
      severity: 'hard',
      source: 'HRIS'
    },
    battery: {
      code: 'battery',
      safetyStatus: 'Battery Low',
      label: 'Battery Low',
      message: 'Assigned drone battery is below dispatch threshold.',
      severity: 'hard',
      source: 'Drone Vendor App'
    },
    wildlife: {
      code: 'wildlife',
      safetyStatus: 'Wildlife Review',
      label: 'Wildlife Review',
      message: 'Wildlife risk is high and requires analyst review.',
      severity: 'review',
      source: 'Environmental Layer'
    },
    route: {
      code: 'route',
      safetyStatus: 'Route Review',
      label: 'Route Review',
      message: 'Route intersects a restricted or review-required area.',
      severity: 'review',
      source: 'Environmental Layer'
    }
  };
  var BLOCKER_ORDER = ['crew', 'weather', 'certification', 'battery', 'wildlife', 'route'];

  function clearElement(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createCell(text, className) {
    var cell = document.createElement('td');
    cell.textContent = text == null || text === '' ? '—' : String(text);

    if (className) {
      cell.className = className;
    }

    return cell;
  }

  function formatDateTime(value) {
    if (!value) return '—';

    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  }

  function formatWind(mission) {
    if (!mission) return '—';

    if (typeof mission.windSpeedMph !== 'number' && !mission.windDirection) return '—';
    if (typeof mission.windSpeedMph !== 'number') return String(mission.windDirection);
    if (!mission.windDirection) return mission.windSpeedMph + ' mph';

    return mission.windSpeedMph + ' mph ' + mission.windDirection;
  }

  function formatWeather(mission) {
    if (!mission) return '—';

    var clearance = mission.weatherClearance || '—';
    if (typeof mission.temperatureF === 'number') {
      return clearance + ' (' + mission.temperatureF + '°F)';
    }

    return clearance;
  }

  function formatBattery(value) {
    return typeof value === 'number' ? value + '%' : '—';
  }

  function formatCrew(value) {
    return value === true ? 'Yes' : 'No';
  }

  function getStatusClass(value) {
    var map = {
      Clear: 'status-clear',
      Caution: 'status-caution',
      Hold: 'status-hold',
      'Weather Hold': 'status-hold',
      Blocked: 'status-blocked',
      Critical: 'status-critical',
      Ready: 'status-ready',
      Scheduled: 'status-scheduled',
      'In Flight': 'status-in-flight',
      Completed: 'status-completed',
      'Needs Review': 'status-review',
      'Wildlife Review': 'status-review',
      'Route Review': 'status-review',
      'Certification Missing': 'status-review',
      'Battery Low': 'status-review',
      'Crew Conflict': 'status-review',
      'Not Scheduled': 'status-review'
    };

    return map[value] || 'status-review';
  }

  function getPriorityClass(value) {
    if (value === 'Critical') return 'status-critical';
    if (value === 'High') return 'status-caution';
    if (value === 'Medium') return 'status-scheduled';
    if (value === 'Low') return 'status-clear';
    return 'status-review';
  }

  function createStatusPill(value, extraClass) {
    var pill = document.createElement('span');
    pill.className = 'status-pill ' + getStatusClass(value) + (extraClass ? ' ' + extraClass : '');
    pill.textContent = value || '—';
    return pill;
  }

  function createEditableSelect(field, missionId, currentValue, options, compact) {
    var select = document.createElement('select');
    select.className = 'editable-control' + (compact ? ' editable-control--compact' : '');
    select.setAttribute('data-edit-field', field);
    select.setAttribute('data-mission-id', missionId);

    options.forEach(function (optionData) {
      var option = document.createElement('option');
      option.value = optionData.value;
      option.textContent = optionData.label;

      if (String(optionData.value) === String(currentValue || '')) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    return select;
  }

  function getActionLabel(mission) {
    if (mission.missionStatus === 'Completed') return 'View Findings';
    if (mission.missionStatus === 'In Flight') return 'Monitor';
    if (mission.safetyStatus === 'Crew Conflict') return 'Resolve Crew';
    if (mission.safetyStatus === 'Weather Hold') return 'Weather Hold';
    if (mission.safetyStatus === 'Certification Missing') return 'Assign Pilot';
    if (mission.safetyStatus === 'Battery Low') return 'Swap Drone';
    if (mission.safetyStatus === 'Wildlife Review' || mission.safetyStatus === 'Route Review') return 'Review Route';
    if (mission.safetyStatus === 'Blocked') return 'Blocked';
    if (mission.missionStatus === 'Scheduled') return 'View Mission';
    if (mission.missionStatus === 'Ready' && mission.safetyStatus === 'Clear') return 'Schedule';
    return 'Review';
  }

  function computeMissionBlockers(mission) {
    if (!mission) return [];
    var blockers = [];
    var drone = findDroneById(mission.assignedDroneId);

    if (mission.crewOnsite === true) blockers.push(BLOCKER_DEFINITIONS.crew);
    if (mission.weatherClearance === 'Hold') blockers.push(BLOCKER_DEFINITIONS.weather);
    if (drone && typeof drone.maxSafeWindMph === 'number' && typeof mission.windSpeedMph === 'number' && mission.windSpeedMph > drone.maxSafeWindMph) {
      blockers.push(BLOCKER_DEFINITIONS.weather);
    }
    if (mission.operatorCertification !== 'Remote Pilot Certificate') blockers.push(BLOCKER_DEFINITIONS.certification);
    if (!mission.assignedDroneId || mission.assignedDroneId === 'Unassigned') blockers.push(BLOCKER_DEFINITIONS.battery);
    if (typeof mission.droneBatteryPercent === 'number' && mission.droneBatteryPercent < 30) blockers.push(BLOCKER_DEFINITIONS.battery);
    if (!mission.assignedOperatorId || mission.assignedOperatorId === 'OP-999' || mission.operatorName === 'Unassigned') blockers.push(BLOCKER_DEFINITIONS.certification);
    if (mission.wildlifeRisk === 'High') blockers.push(BLOCKER_DEFINITIONS.wildlife);
    if (routeNeedsReview(mission.flightPath)) blockers.push(BLOCKER_DEFINITIONS.route);

    return blockers.filter(function (blocker, index, all) {
      return all.findIndex(function (entry) { return entry.code === blocker.code; }) === index;
    });
  }

  function getPrimarySafetyStatus(blockers) {
    if (!blockers.length) return 'Clear';
    return blockers[0].safetyStatus;
  }

  function routeNeedsReview(flightPath) {
    if (!flightPath) return true;

    var status = String(flightPath.status || '').toLowerCase();
    return flightPath.restrictedAreaOverlap === true
      || status.indexOf('review') !== -1
      || status.indexOf('missing') !== -1;
  }

  function enforceMissionStatus(mission, blockers) {
    var hasHardBlocker = blockers.some(function (blocker) { return blocker.severity === 'hard'; });
    var hasReviewBlocker = blockers.some(function (blocker) { return blocker.severity === 'review'; });

    if (hasHardBlocker && (mission.missionStatus === 'Ready' || mission.missionStatus === 'Scheduled')) {
      mission.missionStatus = 'Blocked';
      return;
    }
    if (!hasHardBlocker && hasReviewBlocker && (mission.missionStatus === 'Ready' || mission.missionStatus === 'Scheduled')) {
      mission.missionStatus = 'Needs Review';
    }
  }

  function recomputeMissionRules(mission) {
    var blockers = computeMissionBlockers(mission);
    blockers.sort(function (a, b) {
      return BLOCKER_ORDER.indexOf(a.code) - BLOCKER_ORDER.indexOf(b.code);
    });
    mission.blockers = blockers;
    mission.safetyStatus = getPrimarySafetyStatus(blockers);
    mission.hasHardBlocker = blockers.some(function (blocker) { return blocker.severity === 'hard'; });
    mission.requiresReview = blockers.some(function (blocker) { return blocker.severity === 'review'; });
    mission.isDispatchable = mission.safetyStatus === 'Clear' && (mission.missionStatus === 'Ready' || mission.missionStatus === 'Scheduled');
    mission.ruleSummary = blockers.length
      ? blockers.map(function (blocker) { return blocker.label; }).join(' · ')
      : 'Prototype rule check: no demo blockers';
    enforceMissionStatus(mission, blockers);
  }

  function recomputeAllMissionRules() {
    state.missions.forEach(recomputeMissionRules);
  }

  function renderEmptyState(message) {
    var gridBody = document.getElementById('dispatch-grid-body');
    if (!gridBody) return;

    clearElement(gridBody);

    var row = document.createElement('tr');
    row.className = 'mission-row mission-row--empty';

    var cell = document.createElement('td');
    cell.colSpan = 17;
    cell.className = 'cell-muted';
    cell.textContent = message;

    row.appendChild(cell);
    gridBody.appendChild(row);
  }

  function renderDispatchGrid(missionsToRender) {
    var gridBody = document.getElementById('dispatch-grid-body');
    if (!gridBody) return;

    clearElement(gridBody);

    if (!missionsToRender.length) {
      renderEmptyState('No missions match the current filters.');
      return;
    }

    var enums = getEnums();
    var priorityOptions = (enums.priority || ['Low', 'Medium', 'High', 'Critical']).map(function (value) {
      return { value: value, label: value };
    });
    var missionOptions = (enums.missionStatus || ['Not Scheduled', 'Ready', 'Scheduled', 'In Flight', 'Completed', 'Blocked', 'Needs Review']).map(function (value) {
      return { value: value, label: value };
    });
    var droneOptions = [{ value: '', label: 'Unassigned' }].concat(
      getDrones().map(function (drone) {
        return {
          value: drone.id,
          label: drone.label + ' (' + (typeof drone.batteryPercent === 'number' ? drone.batteryPercent + '%' : '—') + ')'
        };
      })
    );
    var operatorOptions = [{ value: '', label: 'Unassigned' }].concat(
      getOperators().map(function (operator) {
        return {
          value: operator.id,
          label: operator.name + (operator.certification === 'None' ? ' (no certificate)' : '')
        };
      })
    );

    missionsToRender.forEach(function (mission) {
      var row = document.createElement('tr');
      row.classList.add('mission-row');

      if (state.editedMissionIds.has(mission.missionId)) row.classList.add('mission-row--edited');
      if (mission.missionStatus === 'Blocked' || mission.safetyStatus === 'Blocked') row.classList.add('mission-row--blocked');
      if (mission.missionStatus === 'Ready') row.classList.add('mission-row--ready');
      if (mission.priority === 'Critical') row.classList.add('mission-row--critical');
      if (mission.missionStatus === 'Needs Review') row.classList.add('mission-row--review');
      if (mission.missionStatus === 'In Flight') row.classList.add('mission-row--in-flight');
      if (mission.missionStatus === 'Completed') row.classList.add('mission-row--completed');

      row.appendChild(createCell(mission.turbineId, 'cell-readonly'));
      row.appendChild(createCell(mission.siteName, 'cell-readonly'));

      var turbineStatusCell = document.createElement('td');
      turbineStatusCell.className = 'cell-readonly';
      turbineStatusCell.appendChild(createStatusPill(mission.turbineStatus));
      row.appendChild(turbineStatusCell);

      row.appendChild(createCell(formatDateTime(mission.lastInspection), 'cell-readonly'));

      var priorityCell = document.createElement('td');
      priorityCell.appendChild(createEditableSelect('priority', mission.missionId, mission.priority, priorityOptions, true));
      row.appendChild(priorityCell);

      row.appendChild(createCell(mission.damageSeverity, 'cell-readonly'));
      row.appendChild(createCell(formatWeather(mission), 'cell-readonly'));
      row.appendChild(createCell(formatWind(mission), 'cell-readonly'));

      var droneCell = document.createElement('td');
      droneCell.appendChild(createEditableSelect('assignedDroneId', mission.missionId, mission.assignedDroneId || '', droneOptions, true));
      row.appendChild(droneCell);

      row.appendChild(createCell(formatBattery(mission.droneBatteryPercent), 'cell-readonly'));

      var operatorCell = document.createElement('td');
      operatorCell.appendChild(createEditableSelect('assignedOperatorId', mission.missionId, mission.assignedOperatorId || '', operatorOptions, true));
      row.appendChild(operatorCell);

      row.appendChild(createCell(mission.operatorCertification, 'cell-readonly'));
      row.appendChild(createCell(formatCrew(mission.crewOnsite), 'cell-readonly'));
      row.appendChild(createCell(mission.wildlifeRisk, 'cell-readonly'));

      var safetyCell = document.createElement('td');
      safetyCell.className = 'cell-readonly';
      safetyCell.appendChild(createStatusPill(mission.safetyStatus));
      if (Array.isArray(mission.blockers) && mission.blockers.length) {
        var blockerWrap = document.createElement('div');
        blockerWrap.className = 'blocker-chip-wrap';
        mission.blockers.forEach(function (blocker) {
          var chip = document.createElement('span');
          chip.className = 'blocker-chip blocker-chip--' + blocker.severity;
          chip.title = blocker.message + ' Source: ' + blocker.source + '. Prototype rule check.';
          chip.textContent = blocker.label;
          blockerWrap.appendChild(chip);
        });
        safetyCell.appendChild(blockerWrap);
      }
      row.appendChild(safetyCell);

      var missionStatusCell = document.createElement('td');
      missionStatusCell.appendChild(createEditableSelect('missionStatus', mission.missionId, mission.missionStatus, missionOptions, true));
      row.appendChild(missionStatusCell);

      var actionCell = document.createElement('td');
      var actionButton = document.createElement('button');
      var actionLabel = getActionLabel(mission);
      actionButton.type = 'button';
      actionButton.className = 'action-button';
      actionButton.textContent = actionLabel;

      if (actionLabel === 'Schedule') actionButton.classList.add('action-button--primary');
      if (mission.hasHardBlocker || actionLabel === 'Blocked') actionButton.classList.add('action-button--blocked');
      if (actionLabel === 'Review' || actionLabel === 'Review Route') actionButton.classList.add('action-button--review');

      actionCell.appendChild(actionButton);

      if (state.editedMissionIds.has(mission.missionId)) {
        var editedChip = document.createElement('span');
        editedChip.className = 'edited-chip';
        editedChip.textContent = 'Edited';
        actionCell.appendChild(editedChip);
      }

      var noteInput = document.createElement('input');
      noteInput.type = 'text';
      noteInput.maxLength = 160;
      noteInput.value = mission.opsNote || '';
      noteInput.className = 'editable-control editable-control--compact ops-note-input';
      noteInput.setAttribute('aria-label', 'Ops note for ' + (mission.turbineId || mission.missionId));
      noteInput.setAttribute('data-edit-field', 'opsNote');
      noteInput.setAttribute('data-mission-id', mission.missionId);

      actionCell.appendChild(noteInput);
      row.appendChild(actionCell);
      gridBody.appendChild(row);
    });
  }

  function normalizeSearchText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function getFilterControls() {
    return {
      form: document.getElementById('filter-bar'),
      search: document.getElementById('filter-search'),
      site: document.getElementById('filter-site'),
      priority: document.getElementById('filter-priority'),
      weather: document.getElementById('filter-weather'),
      safety: document.getElementById('filter-safety'),
      mission: document.getElementById('filter-mission'),
      reset: document.getElementById('filter-reset')
    };
  }

  function readFiltersFromControls() {
    var controls = getFilterControls();

    return {
      search: controls.search ? controls.search.value : '',
      site: controls.site ? controls.site.value : 'All',
      priority: controls.priority ? controls.priority.value : 'All',
      weather: controls.weather ? controls.weather.value : 'All',
      safety: controls.safety ? controls.safety.value : 'All',
      mission: controls.mission ? controls.mission.value : 'All'
    };
  }

  function missionMatchesFilters(mission, filters) {
    var query = normalizeSearchText(filters.search);
    var text = normalizeSearchText([
      mission.missionId,
      mission.turbineId,
      mission.siteName,
      mission.region,
      mission.assignedDroneLabel,
      mission.assignedDroneId,
      mission.operatorName,
      mission.safetyStatus,
      mission.missionStatus,
      mission.opsNote
    ].join(' '));

    if (query && text.indexOf(query) === -1) return false;
    if (filters.site !== 'All' && mission.siteName !== filters.site) return false;
    if (filters.priority !== 'All' && mission.priority !== filters.priority) return false;
    if (filters.weather !== 'All' && mission.weatherClearance !== filters.weather) return false;
    if (filters.safety !== 'All' && mission.safetyStatus !== filters.safety) return false;
    if (filters.mission !== 'All' && mission.missionStatus !== filters.mission) return false;

    return true;
  }

  function renderResultSummary(total, shown) {
    var summary = document.getElementById('filter-result-summary');
    if (!summary) return;

    summary.textContent = shown === 0
      ? 'No missions match ' + total + ' static records. KPI cards remain global.'
      : 'Showing ' + shown + ' of ' + total + ' missions. KPI cards remain global.';
  }

  function updateEditSessionSummary() {
    var summary = document.getElementById('edit-session-summary');
    if (!summary) return;

    var count = state.editedMissionIds.size;
    summary.textContent = count === 0
      ? 'Demo edits: none this session (in-memory only).'
      : 'Demo edits: ' + count + ' mission(s) changed this session (in-memory only).';
  }



  function getMapElements() {
    return {
      panel: document.getElementById('weather-map-panel'),
      canvas: document.getElementById('map-canvas'),
      markerLayer: document.getElementById('map-marker-layer'),
      routeLayer: document.getElementById('map-route-layer'),
      layerControls: document.getElementById('map-layer-controls'),
      timeline: document.getElementById('map-timeline-controls'),
      summary: document.getElementById('map-status-summary')
    };
  }

  function getMapBounds(missions) {
    var coords = missions
      .filter(function (mission) { return mission && mission.coordinates; })
      .map(function (mission) { return mission.coordinates; });

    if (!coords.length) {
      return { minLat: 0, maxLat: 1, minLon: 0, maxLon: 1 };
    }

    return coords.reduce(function (acc, coordinates) {
      acc.minLat = Math.min(acc.minLat, coordinates.lat);
      acc.maxLat = Math.max(acc.maxLat, coordinates.lat);
      acc.minLon = Math.min(acc.minLon, coordinates.lon);
      acc.maxLon = Math.max(acc.maxLon, coordinates.lon);
      return acc;
    }, { minLat: coords[0].lat, maxLat: coords[0].lat, minLon: coords[0].lon, maxLon: coords[0].lon });
  }

  function normalizeMissionPosition(mission, bounds) {
    if (!mission || !mission.coordinates) return { left: 50, top: 50 };
    var lonSpan = Math.max(bounds.maxLon - bounds.minLon, 0.01);
    var latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.01);
    var left = ((mission.coordinates.lon - bounds.minLon) / lonSpan) * 80 + 10;
    var top = (1 - ((mission.coordinates.lat - bounds.minLat) / latSpan)) * 72 + 14;
    return { left: Math.max(8, Math.min(92, left)), top: Math.max(8, Math.min(88, top)) };
  }

  function getMarkerStatusClass(mission) {
    if (mission.missionStatus === 'In Flight') return 'map-marker--in-flight';
    if (mission.missionStatus === 'Completed') return 'map-marker--completed';
    if (mission.hasHardBlocker || mission.missionStatus === 'Blocked') return 'map-marker--blocked';
    if (mission.requiresReview || mission.missionStatus === 'Needs Review') return 'map-marker--review';
    if (mission.weatherClearance === 'Caution') return 'map-marker--caution';
    return 'map-marker--clear';
  }

  function renderMapPanel() {
    var elements = getMapElements();
    if (!elements.canvas || !elements.markerLayer) return;

    clearElement(elements.markerLayer);
    clearElement(elements.routeLayer);

    var visibleMissions = state.filteredMissions.slice();
    if (state.map.focusedMissionId && !visibleMissions.some(function (mission) { return mission.missionId === state.map.focusedMissionId; })) {
      state.map.focusedMissionId = null;
    }

    var focused = state.missions.find(function (mission) { return mission.missionId === state.map.focusedMissionId; }) || visibleMissions[0] || null;
    var bounds = getMapBounds(visibleMissions.length ? visibleMissions : state.missions);

    visibleMissions.forEach(function (mission) {
      var marker = document.createElement('button');
      var pos = normalizeMissionPosition(mission, bounds);
      marker.type = 'button';
      marker.className = 'map-marker ' + getMarkerStatusClass(mission);
      marker.style.left = pos.left + '%';
      marker.style.top = pos.top + '%';
      marker.setAttribute('data-map-mission-id', mission.missionId);
      marker.setAttribute('data-mission-id', mission.missionId);
      marker.setAttribute('aria-label', 'Demo marker ' + mission.turbineId + ' at ' + mission.siteName);
      marker.title = mission.turbineId + ' · ' + mission.siteName + ' · ' + mission.safetyStatus;
      if (focused && focused.missionId === mission.missionId) marker.classList.add('map-marker--selected');
      elements.markerLayer.appendChild(marker);
    });

    if (focused && elements.routeLayer) {
      var route = document.createElement('div');
      route.className = 'map-route-preview';
      var label = document.createElement('p');
      label.className = 'map-route-label';
      if (focused.requiresReview || (focused.flightPath && focused.flightPath.restrictedAreaOverlap === true)) route.classList.add('map-route-preview--review');
      label.textContent = 'Static demo route · ' + focused.turbineId + ' · No live weather feed';
      elements.routeLayer.appendChild(route);
      elements.routeLayer.appendChild(label);
    }

    if (elements.layerControls) {
      Array.prototype.forEach.call(elements.layerControls.querySelectorAll('[data-map-layer]'), function (button) {
        button.classList.toggle('is-active', button.getAttribute('data-map-layer') === state.map.activeLayer);
      });
    }

    if (elements.timeline) {
      Array.prototype.forEach.call(elements.timeline.querySelectorAll('[data-map-time]'), function (button) {
        button.classList.toggle('is-active', button.getAttribute('data-map-time') === state.map.activeTimeline);
      });
    }

    if (elements.summary) {
      elements.summary.textContent = 'Prototype map layer: ' + state.map.activeLayer + ' · Timeline: ' + state.map.activeTimeline
        + ' · Visible markers: ' + visibleMissions.length + ' of ' + state.missions.length
        + (focused ? ' · Focused mission: ' + focused.turbineId : ' · Focused mission: none');
    }

    if (elements.canvas) {
      var layerClasses = ['map-canvas--layer-wind','map-canvas--layer-gust','map-canvas--layer-temp','map-canvas--layer-precip','map-canvas--layer-wildlife','map-canvas--layer-crew'];
      elements.canvas.classList.remove.apply(elements.canvas.classList, layerClasses);
      elements.canvas.classList.add('map-canvas--layer-' + state.map.activeLayer.toLowerCase());
    }
  }

  function bindMapEvents() {
    var elements = getMapElements();
    if (!elements.panel) return;

    elements.panel.addEventListener('click', function (event) {
      var layerButton = event.target.closest('[data-map-layer]');
      if (layerButton) {
        state.map.activeLayer = layerButton.getAttribute('data-map-layer');
        renderMapPanel();
      }

      var timelineButton = event.target.closest('[data-map-time]');
      if (timelineButton) {
        state.map.activeTimeline = timelineButton.getAttribute('data-map-time');
        renderMapPanel();
      }

      var marker = event.target.closest('[data-map-mission-id]');
      if (marker) {
        state.map.focusedMissionId = marker.getAttribute('data-map-mission-id');
        renderMapPanel();
      }
    });
  }
  function applyFilters() {
    state.filters = readFiltersFromControls();
    state.filteredMissions = state.missions.filter(function (mission) {
      return missionMatchesFilters(mission, state.filters);
    });

    renderDispatchGrid(state.filteredMissions);
    renderResultSummary(state.missions.length, state.filteredMissions.length);
    updateEditSessionSummary();
    renderMapPanel();
  }

  function populateFilterOptions() {
    var controls = getFilterControls();
    if (!controls.site) return;

    var uniqueSites = state.missions
      .map(function (mission) {
        return mission.siteName;
      })
      .filter(Boolean)
      .filter(function (site, index, all) {
        return all.indexOf(site) === index;
      })
      .sort(function (a, b) {
        return a.localeCompare(b);
      });

    clearElement(controls.site);

    ['All'].concat(uniqueSites).forEach(function (site) {
      var option = document.createElement('option');
      option.value = site;
      option.textContent = site;
      controls.site.appendChild(option);
    });

    controls.site.value = 'All';
  }

  function bindFilterEvents() {
    var controls = getFilterControls();
    if (!controls.form) return;

    controls.form.addEventListener('submit', function (event) {
      event.preventDefault();
    });

    if (controls.search) {
      controls.search.addEventListener('input', applyFilters);
    }

    ['site', 'priority', 'weather', 'safety', 'mission'].forEach(function (filterKey) {
      if (controls[filterKey]) {
        controls[filterKey].addEventListener('change', applyFilters);
      }
    });

    if (controls.reset) {
      controls.reset.addEventListener('click', function (event) {
        event.preventDefault();

        if (controls.search) {
          controls.search.value = '';
        }

        ['site', 'priority', 'weather', 'safety', 'mission'].forEach(function (filterKey) {
          if (controls[filterKey]) {
            controls[filterKey].value = 'All';
          }
        });

        state.filters = Object.assign({}, DEFAULT_FILTERS);
        applyFilters();
      });
    }
  }

  function updateMissionField(missionId, field, value) {
    var mission = state.missions.find(function (item) {
      return item.missionId === missionId;
    });

    if (!mission) return;

    mission[field] = value;

    if (field === 'assignedDroneId') {
      var selectedDrone = findDroneById(value);
      mission.assignedDroneId = value || '';
      mission.assignedDroneLabel = selectedDrone ? selectedDrone.label : 'Unassigned';
      mission.droneBatteryPercent = selectedDrone && typeof selectedDrone.batteryPercent === 'number'
        ? selectedDrone.batteryPercent
        : null;
    }

    if (field === 'assignedOperatorId') {
      var selectedOperator = findOperatorById(value);
      mission.assignedOperatorId = value || '';
      mission.operatorName = selectedOperator ? selectedOperator.name : 'Unassigned';
      mission.operatorCertification = selectedOperator ? selectedOperator.certification : 'None';
    }
  }

  function markMissionEdited(missionId) {
    state.editedMissionIds.add(missionId);
  }

  function refreshAfterEdit() {
    recomputeAllMissionRules();
    applyFilters();
    updateKpis();
    renderMapPanel();
  }

  function handleGridEdit(event) {
    var target = event.target;
    if (!target || !target.dataset) return;

    var field = target.dataset.editField;
    var missionId = target.dataset.missionId;
    if (!field || !missionId) return;

    updateMissionField(missionId, field, target.value);
    markMissionEdited(missionId);
    refreshAfterEdit();
  }

  function bindGridEditEvents() {
    var gridBody = document.getElementById('dispatch-grid-body');
    if (!gridBody) return;

    gridBody.addEventListener('change', handleGridEdit);
    gridBody.addEventListener('input', function (event) {
      if (event.target && event.target.dataset && event.target.dataset.editField === 'opsNote') {
        handleGridEdit(event);
      }
    });
  }

  function updateKpis() {
    var counts = {
      ready: 0,
      blocked: 0,
      critical: 0,
      weather: 0,
      crew: 0,
      wildlife: 0
    };

    state.missions.forEach(function (mission) {
      if (mission.missionStatus === 'Ready' && mission.safetyStatus === 'Clear') counts.ready += 1;
      if (mission.missionStatus === 'Blocked' || mission.safetyStatus === 'Blocked' || mission.hasHardBlocker === true) counts.blocked += 1;
      if (mission.priority === 'Critical') counts.critical += 1;
      if (mission.safetyStatus === 'Weather Hold' || mission.weatherClearance === 'Hold') counts.weather += 1;
      if (mission.safetyStatus === 'Crew Conflict' || mission.crewOnsite === true) counts.crew += 1;
      if (mission.safetyStatus === 'Wildlife Review' || mission.wildlifeRisk === 'High') counts.wildlife += 1;
    });

    var kpiMap = {
      'kpi-ready': counts.ready,
      'kpi-blocked': counts.blocked,
      'kpi-critical': counts.critical,
      'kpi-weather': counts.weather,
      'kpi-crew': counts.crew,
      'kpi-wildlife': counts.wildlife
    };

    Object.keys(kpiMap).forEach(function (id) {
      var card = document.getElementById(id);
      if (!card) return;

      var valueElement = card.querySelector('.metric-value');
      if (valueElement) {
        valueElement.textContent = String(kpiMap[id]);
      }
    });
  }

  function updateSyncStatus() {
    var syncElement = document.getElementById('sync-status');
    if (!syncElement) return;

    var latestSync = state.missions.reduce(function (currentMax, mission) {
      if (!mission.lastSync) return currentMax;
      if (!currentMax) return mission.lastSync;
      return new Date(mission.lastSync) > new Date(currentMax) ? mission.lastSync : currentMax;
    }, '');

    syncElement.textContent = latestSync
      ? 'Last sync: ' + formatDateTime(latestSync) + ' UTC'
      : 'Last sync: static dataset loaded';
  }

  function loadMissions() {
    var dfmsData = globalThis.DFMS_DATA;
    var missions = (dfmsData && dfmsData.SAMPLE_MISSIONS) || globalThis.DFMS_SAMPLE_MISSIONS;

    return Array.isArray(missions)
      ? missions.map(function (mission) { return Object.assign({}, mission); })
      : [];
  }

  function initialize() {
    state.missions = loadMissions();

    if (!state.missions.length) {
      renderEmptyState('Static mission data could not be loaded.');
      renderResultSummary(0, 0);
      updateKpis();
      updateSyncStatus();
      renderMapPanel();
      return;
    }

    populateFilterOptions();
    bindFilterEvents();
    bindGridEditEvents();
    bindMapEvents();
    recomputeAllMissionRules();
    applyFilters();
    updateKpis();
    updateSyncStatus();
  }

  initialize();
})();
