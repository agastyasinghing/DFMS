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

  var state = {
    missions: [],
    filteredMissions: [],
    selectedMissionId: null,
    filters: Object.assign({}, DEFAULT_FILTERS),
    editedMissionIds: new Set()
  };

  function getDrones() { return (globalThis.DFMS_DATA && globalThis.DFMS_DATA.DRONES) || []; }
  function getOperators() { return (globalThis.DFMS_DATA && globalThis.DFMS_DATA.OPERATORS) || []; }
  function findDroneById(droneId) { return getDrones().find(function (d) { return d.droneId === droneId; }) || null; }
  function findOperatorById(operatorId) { return getOperators().find(function (o) { return o.operatorId === operatorId; }) || null; }

  function clearElement(element) { if (!element) return; while (element.firstChild) element.removeChild(element.firstChild); }
  function createCell(text, className) { var c=document.createElement('td'); c.textContent=text==null||text===''?'—':String(text); if(className) c.className=className; return c; }
  function formatDateTime(value) { if(!value) return '—'; var d=new Date(value); if(Number.isNaN(d.getTime())) return String(value); return d.toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'UTC'}); }
  function formatWind(m){ if(!m) return '—'; if(typeof m.windSpeedMph!=='number'&&!m.windDirection) return '—'; if(typeof m.windSpeedMph!=='number') return String(m.windDirection); if(!m.windDirection) return m.windSpeedMph+' mph'; return m.windSpeedMph+' mph '+m.windDirection; }
  function formatWeather(m){ if(!m) return '—'; var c=m.weatherClearance||'—'; return typeof m.temperatureF==='number'?c+' ('+m.temperatureF+'°F)':c; }
  function formatBattery(v){ return typeof v==='number'?v+'%':'—'; }
  function formatCrew(v){ return v===true?'Yes':'No'; }
  function getStatusClass(v){ var map={'Clear':'status-clear','Caution':'status-caution','Hold':'status-hold','Weather Hold':'status-hold','Blocked':'status-blocked','Critical':'status-critical','Ready':'status-ready','Scheduled':'status-scheduled','In Flight':'status-in-flight','Completed':'status-completed','Needs Review':'status-review','Wildlife Review':'status-review','Route Review':'status-review','Certification Missing':'status-review','Battery Low':'status-review','Crew Conflict':'status-review','Not Scheduled':'status-review'}; return map[v]||'status-review'; }
  function getPriorityClass(v){ if(v==='Critical') return 'status-critical'; if(v==='High') return 'status-caution'; if(v==='Medium') return 'status-scheduled'; if(v==='Low') return 'status-clear'; return 'status-review'; }
  function createStatusPill(v, extra){ var p=document.createElement('span'); p.className='status-pill '+getStatusClass(v)+(extra?' '+extra:''); p.textContent=v||'—'; return p; }
  function createEditableSelect(field, missionId, currentValue, options, compact){ var s=document.createElement('select'); s.className='editable-control'+(compact?' editable-control--compact':''); s.setAttribute('data-edit-field',field); s.setAttribute('data-mission-id',missionId); options.forEach(function(o){ var op=document.createElement('option'); op.value=o.value; op.textContent=o.label; if(String(o.value)===String(currentValue||'')) op.selected=true; s.appendChild(op);}); return s; }
  function getActionLabel(mission) { if (mission.missionStatus === 'Completed') return 'View Findings'; if (mission.missionStatus === 'In Flight') return 'Monitor'; if (mission.safetyStatus === 'Crew Conflict') return 'Resolve Crew'; if (mission.safetyStatus === 'Weather Hold') return 'Weather Hold'; if (mission.safetyStatus === 'Certification Missing') return 'Assign Pilot'; if (mission.safetyStatus === 'Battery Low') return 'Swap Drone'; if (mission.safetyStatus === 'Wildlife Review' || mission.safetyStatus === 'Route Review') return 'Review Route'; if (mission.safetyStatus === 'Blocked') return 'Blocked'; if (mission.missionStatus === 'Scheduled') return 'View Mission'; if (mission.missionStatus === 'Ready' && mission.safetyStatus === 'Clear') return 'Schedule'; return 'Review'; }

  function renderEmptyState(message){var g=document.getElementById('dispatch-grid-body'); if(!g) return; clearElement(g); var r=document.createElement('tr'); r.className='mission-row mission-row--empty'; var c=document.createElement('td'); c.colSpan=17;c.className='cell-muted';c.textContent=message;r.appendChild(c);g.appendChild(r);} 

  function renderDispatchGrid(missionsToRender){ var g=document.getElementById('dispatch-grid-body'); if(!g) return; clearElement(g); if(!missionsToRender.length){renderEmptyState('No missions match the current filters.');return;} var enums=getEnums(); var priorityOptions=(enums.priority||['Low','Medium','High','Critical']).map(function(v){return {value:v,label:v};}); var missionOptions=(enums.missionStatus||['Not Scheduled','Ready','Scheduled','In Flight','Completed','Blocked','Needs Review']).map(function(v){return {value:v,label:v};}); var droneOptions=[{value:'',label:'Unassigned'}].concat(getDrones().map(function(d){return {value:d.droneId,label:d.label+' ('+(typeof d.batteryPercent==='number'?d.batteryPercent+'%':'—')+')'};})); var operatorOptions=[{value:'',label:'Unassigned'}].concat(getOperators().map(function(o){return {value:o.operatorId,label:o.name+(o.certification==='None'?' (no certificate)':'')};}));
    missionsToRender.forEach(function(m){ var r=document.createElement('tr'); r.classList.add('mission-row'); if(state.editedMissionIds.has(m.missionId)) r.classList.add('mission-row--edited'); if (m.missionStatus === 'Blocked' || m.safetyStatus === 'Blocked') r.classList.add('mission-row--blocked'); if (m.missionStatus === 'Ready') r.classList.add('mission-row--ready'); if (m.priority === 'Critical') r.classList.add('mission-row--critical'); if (m.missionStatus === 'Needs Review') r.classList.add('mission-row--review'); if (m.missionStatus === 'In Flight') r.classList.add('mission-row--in-flight'); if (m.missionStatus === 'Completed') r.classList.add('mission-row--completed');
      r.appendChild(createCell(m.turbineId,'cell-readonly')); r.appendChild(createCell(m.siteName,'cell-readonly')); var t=document.createElement('td'); t.className='cell-readonly'; t.appendChild(createStatusPill(m.turbineStatus)); r.appendChild(t); r.appendChild(createCell(formatDateTime(m.lastInspection),'cell-readonly'));
      var p=document.createElement('td'); p.appendChild(createEditableSelect('priority',m.missionId,m.priority,priorityOptions,true)); r.appendChild(p);
      r.appendChild(createCell(m.damageSeverity,'cell-readonly')); r.appendChild(createCell(formatWeather(m),'cell-readonly')); r.appendChild(createCell(formatWind(m),'cell-readonly'));
      var d=document.createElement('td'); d.appendChild(createEditableSelect('assignedDroneId',m.missionId,m.assignedDroneId||'',droneOptions,true)); r.appendChild(d);
      r.appendChild(createCell(formatBattery(m.droneBatteryPercent),'cell-readonly'));
      var o=document.createElement('td'); o.appendChild(createEditableSelect('assignedOperatorId',m.missionId,m.assignedOperatorId||'',operatorOptions,true)); r.appendChild(o);
      r.appendChild(createCell(m.operatorCertification,'cell-readonly')); r.appendChild(createCell(formatCrew(m.crewOnsite),'cell-readonly')); r.appendChild(createCell(m.wildlifeRisk,'cell-readonly'));
      var s=document.createElement('td'); s.className='cell-readonly'; s.appendChild(createStatusPill(m.safetyStatus)); r.appendChild(s);
      var ms=document.createElement('td'); ms.appendChild(createEditableSelect('missionStatus',m.missionId,m.missionStatus,missionOptions,true)); r.appendChild(ms);
      var ac=document.createElement('td'); var b=document.createElement('button'); var al=getActionLabel(m); b.type='button'; b.className='action-button'; b.textContent=al; if(al==='Schedule') b.classList.add('action-button--primary'); if(al==='Blocked') b.classList.add('action-button--blocked'); if(al==='Review'||al==='Review Route') b.classList.add('action-button--review'); ac.appendChild(b); if(state.editedMissionIds.has(m.missionId)){var chip=document.createElement('span'); chip.className='edited-chip'; chip.textContent='Edited'; ac.appendChild(chip);} var n=document.createElement('input'); n.type='text'; n.maxLength=160; n.value=m.opsNote||''; n.className='editable-control editable-control--compact ops-note-input'; n.setAttribute('aria-label','Ops note for '+(m.turbineId||m.missionId)); n.setAttribute('data-edit-field','opsNote'); n.setAttribute('data-mission-id',m.missionId); ac.appendChild(n); r.appendChild(ac); g.appendChild(r);
    }); }

  function normalizeSearchText(v){return String(v||'').toLowerCase().trim();}
  function getFilterControls(){return {form:document.getElementById('filter-bar'),search:document.getElementById('filter-search'),site:document.getElementById('filter-site'),priority:document.getElementById('filter-priority'),weather:document.getElementById('filter-weather'),safety:document.getElementById('filter-safety'),mission:document.getElementById('filter-mission'),reset:document.getElementById('filter-reset')};}
  function readFiltersFromControls(){var c=getFilterControls(); return {search:c.search?c.search.value:'',site:c.site?c.site.value:'All',priority:c.priority?c.priority.value:'All',weather:c.weather?c.weather.value:'All',safety:c.safety?c.safety.value:'All',mission:c.mission?c.mission.value:'All'};}
  function missionMatchesFilters(m,f){var q=normalizeSearchText(f.search); var text=normalizeSearchText([m.missionId,m.turbineId,m.siteName,m.region,m.assignedDroneLabel,m.assignedDroneId,m.operatorName,m.safetyStatus,m.missionStatus,m.opsNote].join(' ')); if(q&&text.indexOf(q)===-1)return false; if(f.site!=='All'&&m.siteName!==f.site)return false; if(f.priority!=='All'&&m.priority!==f.priority)return false; if(f.weather!=='All'&&m.weatherClearance!==f.weather)return false; if(f.safety!=='All'&&m.safetyStatus!==f.safety)return false; if(f.mission!=='All'&&m.missionStatus!==f.mission)return false; return true;}
  function renderResultSummary(total, shown){var s=document.getElementById('filter-result-summary'); if(!s)return; s.textContent=shown===0?'No missions match '+total+' static records. KPI cards remain global.':'Showing '+shown+' of '+total+' missions. KPI cards remain global.';}
  function updateEditSessionSummary(){ var el=document.getElementById('edit-session-summary'); if(!el) return; var count=state.editedMissionIds.size; el.textContent=count===0?'Demo edits: none this session (in-memory only).':'Demo edits: '+count+' mission(s) changed this session (in-memory only).'; }
  function applyFilters(){ state.filters=readFiltersFromControls(); state.filteredMissions=state.missions.filter(function(m){return missionMatchesFilters(m,state.filters);}); renderDispatchGrid(state.filteredMissions); renderResultSummary(state.missions.length,state.filteredMissions.length); updateEditSessionSummary(); }
  function populateFilterOptions(){ var c=getFilterControls(); if(!c.site)return; var s=state.missions.map(function(m){return m.siteName;}).filter(Boolean).filter(function(v,i,a){return a.indexOf(v)===i;}).sort(function(a,b){return a.localeCompare(b);}); clearElement(c.site); ['All'].concat(s).forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;c.site.appendChild(o);}); c.site.value='All'; }
  function bindFilterEvents(){ var c=getFilterControls(); if(!c.form)return; c.form.addEventListener('submit',function(e){e.preventDefault();}); if(c.search)c.search.addEventListener('input',applyFilters); ['site','priority','weather','safety','mission'].forEach(function(k){if(c[k])c[k].addEventListener('change',applyFilters);}); if(c.reset){c.reset.addEventListener('click',function(e){e.preventDefault(); if(c.search)c.search.value=''; ['site','priority','weather','safety','mission'].forEach(function(k){if(c[k])c[k].value='All';}); state.filters=Object.assign({},DEFAULT_FILTERS); applyFilters();});}}

  function updateMissionField(missionId, field, value){ var mission=state.missions.find(function(m){return m.missionId===missionId;}); if(!mission) return; mission[field]=value; if(field==='assignedDroneId'){ var d=findDroneById(value); mission.assignedDroneId=value||''; mission.assignedDroneLabel=d?d.label:'Unassigned'; mission.droneBatteryPercent=d&&typeof d.batteryPercent==='number'?d.batteryPercent:null; } if(field==='assignedOperatorId'){ var o=findOperatorById(value); mission.assignedOperatorId=value||''; mission.operatorName=o?o.name:'Unassigned'; mission.operatorCertification=o?o.certification:'None'; } }
  function markMissionEdited(missionId){ state.editedMissionIds.add(missionId); }
  function refreshAfterEdit(){ applyFilters(); updateKpis(); }
  function handleGridEdit(event){ var t=event.target; if(!t||!t.dataset) return; var field=t.dataset.editField; var missionId=t.dataset.missionId; if(!field||!missionId) return; var value=t.value; updateMissionField(missionId,field,value); markMissionEdited(missionId); refreshAfterEdit(); }

  function bindGridEditEvents(){ var body=document.getElementById('dispatch-grid-body'); if(!body) return; body.addEventListener('change',handleGridEdit); body.addEventListener('input',function(event){ if(event.target&&event.target.dataset&&event.target.dataset.editField==='opsNote') handleGridEdit(event);}); }

  function updateKpis(){ var c={ready:0,blocked:0,critical:0,weather:0,crew:0,wildlife:0}; state.missions.forEach(function(m){ if(m.missionStatus==='Ready'&&m.safetyStatus==='Clear')c.ready+=1; if(m.missionStatus==='Blocked'||m.safetyStatus==='Blocked')c.blocked+=1; if(m.priority==='Critical')c.critical+=1; if(m.safetyStatus==='Weather Hold'||m.weatherClearance==='Hold')c.weather+=1; if(m.safetyStatus==='Crew Conflict'||m.crewOnsite===true)c.crew+=1; if(m.safetyStatus==='Wildlife Review'||m.wildlifeRisk==='High')c.wildlife+=1;}); var k={'kpi-ready':c.ready,'kpi-blocked':c.blocked,'kpi-critical':c.critical,'kpi-weather':c.weather,'kpi-crew':c.crew,'kpi-wildlife':c.wildlife}; Object.keys(k).forEach(function(id){var card=document.getElementById(id); if(!card)return; var v=card.querySelector('.metric-value'); if(v)v.textContent=String(k[id]);}); }
  function updateSyncStatus(){ var el=document.getElementById('sync-status'); if(!el)return; var latest=state.missions.reduce(function(max,m){ if(!m.lastSync)return max; if(!max)return m.lastSync; return new Date(m.lastSync)>new Date(max)?m.lastSync:max;},''); el.textContent=latest?'Last sync: '+formatDateTime(latest)+' UTC':'Last sync: static dataset loaded'; }
  function loadMissions(){ var df=globalThis.DFMS_DATA; var missions=(df&&df.SAMPLE_MISSIONS)||globalThis.DFMS_SAMPLE_MISSIONS; return Array.isArray(missions)?missions.map(function(m){return Object.assign({},m);}):[]; }
  function initialize(){ state.missions=loadMissions(); if(!state.missions.length){ renderEmptyState('Static mission data could not be loaded.'); renderResultSummary(0,0); updateKpis(); updateSyncStatus(); return; } populateFilterOptions(); bindFilterEvents(); bindGridEditEvents(); applyFilters(); updateKpis(); updateSyncStatus(); }
  initialize();
})();
