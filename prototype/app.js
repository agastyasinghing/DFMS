(function initializeDfmsPrototype() {
  var state = {
    missions: [],
    selectedMissionId: null
  };

  function clearElement(element) {
    if (!element) {
      return;
    }
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createCell(text) {
    var cell = document.createElement('td');
    cell.textContent = text == null || text === '' ? '—' : String(text);
    return cell;
  }

  function formatDateTime(value) {
    if (!value) {
      return '—';
    }

    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

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
    if (!mission) {
      return '—';
    }

    var speed = mission.windSpeedMph;
    var direction = mission.windDirection;
    if (typeof speed !== 'number' && !direction) {
      return '—';
    }
    if (typeof speed !== 'number') {
      return String(direction);
    }
    if (!direction) {
      return speed + ' mph';
    }
    return speed + ' mph ' + direction;
  }

  function formatWeather(mission) {
    if (!mission) {
      return '—';
    }
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
      'Clear': 'status-clear',
      'Caution': 'status-caution',
      'Hold': 'status-hold',
      'Weather Hold': 'status-hold',
      'Blocked': 'status-blocked',
      'Critical': 'status-critical',
      'Ready': 'status-ready',
      'Scheduled': 'status-scheduled',
      'In Flight': 'status-in-flight',
      'Completed': 'status-completed',
      'Needs Review': 'status-review',
      'Wildlife Review': 'status-review',
      'Route Review': 'status-review',
      'Certification Missing': 'status-review',
      'Battery Low': 'status-review',
      'Crew Conflict': 'status-review'
    };

    return map[value] || 'status-review';
  }

  function getPriorityClass(value) {
    if (value === 'Critical') {
      return 'status-critical';
    }
    if (value === 'High') {
      return 'status-caution';
    }
    if (value === 'Medium') {
      return 'status-scheduled';
    }
    if (value === 'Low') {
      return 'status-clear';
    }
    return 'status-review';
  }

  function createStatusPill(value, extraClass) {
    var pill = document.createElement('span');
    pill.className = 'status-pill ' + getStatusClass(value) + (extraClass ? ' ' + extraClass : '');
    pill.textContent = value || '—';
    return pill;
  }

  function getActionLabel(mission) {
    if (mission.missionStatus === 'Completed') return 'View Findings';
    if (mission.missionStatus === 'In Flight') return 'Monitor';
    if (mission.safetyStatus === 'Crew Conflict') return 'Resolve Crew';
    if (mission.safetyStatus === 'Weather Hold') return 'Weather Hold';
    if (mission.safetyStatus === 'Certification Missing') return 'Assign Pilot';
    if (mission.safetyStatus === 'Battery Low') return 'Swap Drone';
    if (mission.safetyStatus === 'Wildlife Review') return 'Review Route';
    if (mission.safetyStatus === 'Route Review') return 'Review Route';
    if (mission.safetyStatus === 'Blocked') return 'Blocked';
    if (mission.missionStatus === 'Scheduled') return 'View Mission';
    if (mission.missionStatus === 'Ready' && mission.safetyStatus === 'Clear') return 'Schedule';
    return 'Review';
  }

  function renderEmptyState(message) {
    var gridBody = document.getElementById('dispatch-grid-body');
    if (!gridBody) {
      return;
    }

    clearElement(gridBody);
    var row = document.createElement('tr');
    row.className = 'mission-row';
    var cell = document.createElement('td');
    cell.colSpan = 17;
    cell.className = 'cell-muted';
    cell.textContent = message;
    row.appendChild(cell);
    gridBody.appendChild(row);
  }

  function renderDispatchGrid() {
    var gridBody = document.getElementById('dispatch-grid-body');
    if (!gridBody) {
      return;
    }

    clearElement(gridBody);

    if (!state.missions.length) {
      renderEmptyState('Static mission data could not be loaded.');
      return;
    }

    state.missions.forEach(function (mission) {
      var row = document.createElement('tr');
      row.classList.add('mission-row');

      if (mission.missionStatus === 'Blocked' || mission.safetyStatus === 'Blocked') row.classList.add('mission-row--blocked');
      if (mission.missionStatus === 'Ready') row.classList.add('mission-row--ready');
      if (mission.priority === 'Critical') row.classList.add('mission-row--critical');
      if (mission.missionStatus === 'Needs Review') row.classList.add('mission-row--review');
      if (mission.missionStatus === 'In Flight') row.classList.add('mission-row--in-flight');
      if (mission.missionStatus === 'Completed') row.classList.add('mission-row--completed');

      row.appendChild(createCell(mission.turbineId));
      row.appendChild(createCell(mission.siteName));

      var turbineStatusCell = document.createElement('td');
      turbineStatusCell.appendChild(createStatusPill(mission.turbineStatus));
      row.appendChild(turbineStatusCell);

      row.appendChild(createCell(formatDateTime(mission.lastInspection)));

      var priorityCell = document.createElement('td');
      priorityCell.appendChild(createStatusPill(mission.priority, getPriorityClass(mission.priority)));
      row.appendChild(priorityCell);

      row.appendChild(createCell(mission.damageSeverity));
      row.appendChild(createCell(formatWeather(mission)));
      row.appendChild(createCell(formatWind(mission)));
      row.appendChild(createCell(mission.assignedDroneLabel || mission.assignedDroneId));
      row.appendChild(createCell(formatBattery(mission.droneBatteryPercent)));
      row.appendChild(createCell(mission.operatorName));
      row.appendChild(createCell(mission.operatorCertification));
      row.appendChild(createCell(formatCrew(mission.crewOnsite)));
      row.appendChild(createCell(mission.wildlifeRisk));

      var safetyCell = document.createElement('td');
      safetyCell.appendChild(createStatusPill(mission.safetyStatus));
      row.appendChild(safetyCell);

      var missionStatusCell = document.createElement('td');
      missionStatusCell.appendChild(createStatusPill(mission.missionStatus));
      row.appendChild(missionStatusCell);

      var actionCell = document.createElement('td');
      var actionButton = document.createElement('button');
      var actionLabel = getActionLabel(mission);
      actionButton.type = 'button';
      actionButton.className = 'action-button';
      actionButton.textContent = actionLabel;

      if (actionLabel === 'Schedule') actionButton.classList.add('action-button--primary');
      if (actionLabel === 'Blocked') actionButton.classList.add('action-button--blocked');
      if (actionLabel === 'Review' || actionLabel === 'Review Route') actionButton.classList.add('action-button--review');

      actionCell.appendChild(actionButton);
      row.appendChild(actionCell);

      gridBody.appendChild(row);
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
      if (mission.missionStatus === 'Blocked' || mission.safetyStatus === 'Blocked') counts.blocked += 1;
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
      if (valueElement) valueElement.textContent = String(kpiMap[id]);
    });
  }

  function updateSyncStatus() {
    var syncElement = document.getElementById('sync-status');
    if (!syncElement) {
      return;
    }

    var latest = state.missions.reduce(function (maxValue, mission) {
      if (!mission.lastSync) return maxValue;
      if (!maxValue) return mission.lastSync;
      return new Date(mission.lastSync) > new Date(maxValue) ? mission.lastSync : maxValue;
    }, '');

    if (!latest) {
      syncElement.textContent = 'Last sync: static dataset loaded';
      return;
    }

    syncElement.textContent = 'Last sync: ' + formatDateTime(latest) + ' UTC';
  }

  function loadMissions() {
    var dfmsData = globalThis.DFMS_DATA;
    var missions = (dfmsData && dfmsData.SAMPLE_MISSIONS) || globalThis.DFMS_SAMPLE_MISSIONS;
    if (!Array.isArray(missions)) {
      return [];
    }
    return missions.slice();
  }

  function initialize() {
    state.missions = loadMissions();
    if (!state.missions.length) {
      renderEmptyState('Static mission data could not be loaded.');
      updateKpis();
      updateSyncStatus();
      return;
    }

    renderDispatchGrid();
    updateKpis();
    updateSyncStatus();
  }

  initialize();
})();
