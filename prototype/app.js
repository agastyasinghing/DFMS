(function initializeDfmsPrototype() {
  var DEFAULT_FILTERS = {
    search: '',
    site: 'All',
    priority: 'All',
    weather: 'All',
    safety: 'All',
    mission: 'All'
  };

  var state = {
    missions: [],
    filteredMissions: [],
    selectedMissionId: null,
    filters: Object.assign({}, DEFAULT_FILTERS)
  };

  function clearElement(element) {
    if (!element) return;
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
    if (!value) return '—';

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
    if (!mission) return '—';

    var speed = mission.windSpeedMph;
    var direction = mission.windDirection;

    if (typeof speed !== 'number' && !direction) return '—';
    if (typeof speed !== 'number') return String(direction);
    if (!direction) return speed + ' mph';

    return speed + ' mph ' + direction;
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

    missionsToRender.forEach(function (mission) {
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
    var searchableText = normalizeSearchText([
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

    if (query && searchableText.indexOf(query) === -1) return false;
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

    if (shown === 0) {
      summary.textContent = 'No missions match ' + total + ' static records. KPI cards remain global.';
      return;
    }

    summary.textContent = 'Showing ' + shown + ' of ' + total + ' missions. KPI cards remain global.';
  }

  function applyFilters() {
    state.filters = readFiltersFromControls();
    state.filteredMissions = state.missions.filter(function (mission) {
      return missionMatchesFilters(mission, state.filters);
    });

    renderDispatchGrid(state.filteredMissions);
    renderResultSummary(state.missions.length, state.filteredMissions.length);
  }

  function populateFilterOptions() {
    var controls = getFilterControls();
    if (!controls.site) return;

    var uniqueSites = state.missions
      .map(function (mission) { return mission.siteName; })
      .filter(Boolean)
      .filter(function (siteName, index, allSites) {
        return allSites.indexOf(siteName) === index;
      })
      .sort(function (a, b) {
        return a.localeCompare(b);
      });

    clearElement(controls.site);

    ['All'].concat(uniqueSites).forEach(function (siteName) {
      var option = document.createElement('option');
      option.value = siteName;
      option.textContent = siteName;
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

    if (latestSync) {
      syncElement.textContent = 'Last sync: ' + formatDateTime(latestSync) + ' UTC';
      return;
    }

    syncElement.textContent = 'Last sync: static dataset loaded';
  }

  function loadMissions() {
    var dfmsData = globalThis.DFMS_DATA;
    var missions = (dfmsData && dfmsData.SAMPLE_MISSIONS) || globalThis.DFMS_SAMPLE_MISSIONS;
    return Array.isArray(missions) ? missions.slice() : [];
  }

  function initialize() {
    state.missions = loadMissions();

    if (!state.missions.length) {
      renderEmptyState('Static mission data could not be loaded.');
      renderResultSummary(0, 0);
      updateKpis();
      updateSyncStatus();
      return;
    }

    populateFilterOptions();
    bindFilterEvents();
    applyFilters();
    updateKpis();
    updateSyncStatus();
  }

  initialize();
})();
