const workoutData = {
  A: {
    id: "A",
    name: "Treino A",
    tag: "QUADRÍCEPS, EMPURRAR & CORE",
    focus: "Anterior de coxa, glúteos, sóleo, dorsais, peitoral e abdômen infra.",
    exercises: [
      { id: "a1", name: "Leg Press Horizontal", setsCount: 3, targetReps: "12–15", defaultLoad: 40, defaultReps: 12, note: "Amplitude confortável • Foco em quadríceps e glúteos" },
      { id: "a2", name: "Cadeira Extensora", setsCount: 3, targetReps: "12–15", defaultLoad: 20, defaultReps: 12, note: "Foco anterior de coxa e estabilidade do joelho" },
      { id: "a3", name: "Panturrilha Sentada", setsCount: 3, targetReps: "15–20", defaultLoad: 15, defaultReps: 15, note: "Foco no sóleo • Pausa curta embaixo e em cima" },
      { id: "a4", name: "Puxada Frontal na Polia", setsCount: 3, targetReps: "12–15", defaultLoad: 20, defaultReps: 12, note: "Costas + trabalho indireto de bíceps" },
      { id: "a5", name: "Supino Máquina Articulada", setsCount: 3, targetReps: "12–15", defaultLoad: 10, defaultReps: 12, note: "Peitoral, ombros + trabalho indireto de tríceps" },
      { id: "a6", name: "Abdominal Infra com Apoio de Braços", setsCount: 3, targetReps: "12–15", defaultLoad: 0, defaultReps: 12, note: "Elevação controlada de joelhos/pernas (0 = Peso do corpo)" }
    ]
  },
  B: {
    id: "B",
    name: "Treino B",
    tag: "POSTERIOR, REMADA & TRÍCEPS",
    focus: "Posterior de coxa, adutores, gastrocnêmio, postura/costas, tríceps e prancha.",
    exercises: [
      { id: "b1", name: "Mesa ou Cadeira Flexora", setsCount: 3, targetReps: "12–15", defaultLoad: 20, defaultReps: 12, note: "Foco em posterior de coxa • Controle na volta" },
      { id: "b2", name: "Cadeira Adutora", setsCount: 3, targetReps: "15", defaultLoad: 25, defaultReps: 15, note: "Parte interna da coxa • Movimento contínuo" },
      { id: "b3", name: "Panturrilha no Leg Press Horizontal", setsCount: 3, targetReps: "15–20", defaultLoad: 40, defaultReps: 15, note: "Foco no gastrocnêmio • Joelhos quase estendidos" },
      { id: "b4", name: "Remada Baixa na Polia ou Máquina", setsCount: 3, targetReps: "12–15", defaultLoad: 20, defaultReps: 12, note: "Postura, costas + trabalho indireto de bíceps" },
      { id: "b5", name: "Tríceps na Polia", setsCount: 3, targetReps: "12–15", defaultLoad: 15, defaultReps: 12, note: "Foco direto na parte posterior dos braços" },
      { id: "b6", name: "Prancha Isométrica (Segundos)", setsCount: 3, targetReps: "30–45s", defaultLoad: 0, defaultReps: 35, note: "Controle abdominal e cervical neutra (Reps = segundos)" }
    ]
  },
  C: {
    id: "C",
    name: "Treino C",
    tag: "GLÚTEOS, OMBROS & BÍCEPS",
    focus: "Glúteo médio, agachamento seguro, panturrilha em pé, ombros, bíceps e core.",
    exercises: [
      { id: "c1", name: "Cadeira Abdutora", setsCount: 3, targetReps: "15", defaultLoad: 30, defaultReps: 15, note: "Glúteo médio e estabilidade lateral do quadril/joelho" },
      { id: "c2", name: "Agachamento Guiado Leve", setsCount: 3, targetReps: "12", defaultLoad: 10, defaultReps: 12, note: "Com apoio e amplitude segura para joelhos e lombar" },
      { id: "c3", name: "Panturrilha em Pé na Máquina", setsCount: 3, targetReps: "15–20", defaultLoad: 15, defaultReps: 15, note: "Amplitude máxima com apoio firme" },
      { id: "c4", name: "Desenvolvimento na Máquina Articulada", setsCount: 3, targetReps: "12", defaultLoad: 10, defaultReps: 12, note: "Ombros + trabalho indireto de tríceps" },
      { id: "c5", name: "Rosca Bíceps na Máquina ou Polia", setsCount: 3, targetReps: "12–15", defaultLoad: 10, defaultReps: 12, note: "Foco direto nos braços sem balançar o tronco" },
      { id: "c6", name: "Abdominal Infra no Banco/Colchonete", setsCount: 3, targetReps: "12–15", defaultLoad: 0, defaultReps: 12, note: "Ativação profunda do core com cabeça totalmente apoiada" }
    ]
  },
  D: {
    id: "D",
    name: "Treino D",
    tag: "FULLBODY (FIM DE SEMANA)",
    focus: "Adutores, glúteos sem sobrecarga no joelho, resistência de panturrilha, postura, braços e core.",
    exercises: [
      { id: "d1", name: "Cadeira Adutora", setsCount: 3, targetReps: "15", defaultLoad: 25, defaultReps: 15, note: "Parte interna da coxa • Movimento controlado" },
      { id: "d2", name: "Elevação Pélvica na Máquina", setsCount: 3, targetReps: "12–15", defaultLoad: 30, defaultReps: 12, note: "Glúteos e posterior sem sobrecarga vertical nos joelhos/tíbia" },
      { id: "d3", name: "Panturrilha no Degrau ou Sentada", setsCount: 3, targetReps: "15–20", defaultLoad: 0, defaultReps: 15, note: "Estímulo leve de resistência e mobilidade de tornozelo" },
      { id: "d4", name: "Puxada Triângulo na Polia", setsCount: 3, targetReps: "12–15", defaultLoad: 20, defaultReps: 12, note: "Costas e postura • Puxada controlada em direção ao peito" },
      { id: "d5", name: "Crucifixo Inverso na Máquina", setsCount: 3, targetReps: "12–15", defaultLoad: 10, defaultReps: 12, note: "Posterior de ombros e alinhamento postural sem sobrecarga cervical" },
      { id: "d6", name: "Tríceps Francês ou Coice na Polia", setsCount: 3, targetReps: "12–15", defaultLoad: 10, defaultReps: 12, note: "Firmeza de braços e controle abdominal" }
    ]
  }
};

const ACTIVE_SESSION_KEY = "tamara_active_session_v17";

let currentWorkoutKey = "A";
let activeWorkoutState = {};
let cardioState = {
  mode: "ESCADA",
  icon: "🪜",
  time: 15,
  kcal: 130,
  done: false
};

let timerSeconds = 60;
let timerInterval = null;
let timerRunning = false;

// Controle do Calendário GymRats
let calViewYear = new Date().getFullYear();
let calViewMonth = new Date().getMonth();
let selectedCalDateISO = getTodayISO();

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoToBR(iso) {
  if (!iso || !iso.includes("-")) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function brToISO(br) {
  if (!br) return "";
  if (br.includes("-")) return br;
  const parts = br.split("/");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

function initApp() {
  renderWorkoutCards();
  renderDashboard();
  registerSW();

  // RESTAURA AUTOMATICAMENTE O TREINO EM ANDAMENTO SE ELA FECHOU O APP NO MEIO DO TREINO
  const savedSession = getSavedActiveSession();
  if (savedSession && savedSession.workoutKey && workoutData[savedSession.workoutKey]) {
    openWorkout(savedSession.workoutKey, true);
  }
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

/* =========================================================
   PERSISTÊNCIA DA SESSÃO EM ANDAMENTO (CORREÇÃO DO BUG)
   ========================================================= */
function getSavedActiveSession() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY));
  } catch {
    return null;
  }
}

function saveActiveSessionState() {
  // Verifica se há pelo menos 1 série marcada ou cardio marcado
  let hasAnyProgress = cardioState.done;
  Object.values(activeWorkoutState).forEach((sets) => {
    if (sets.some((s) => s.done)) hasAnyProgress = true;
  });

  if (!hasAnyProgress) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  const payload = {
    workoutKey: currentWorkoutKey,
    setsState: activeWorkoutState,
    cardioState: cardioState,
    updatedAt: Date.now()
  };
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(payload));
}

function clearSavedActiveSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

function resumeActiveWorkout() {
  const saved = getSavedActiveSession();
  if (saved && saved.workoutKey) {
    openWorkout(saved.workoutKey, true);
  }
}

function navigateTo(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === screenId);
  });

  if (screenId === "homeScreen") {
    renderWorkoutCards();
    renderDashboard();
  } else if (screenId === "dashboardScreen") {
    renderDashboard();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderWorkoutCards() {
  const container = document.getElementById("workoutCardsList");
  const keys = Object.keys(workoutData);
  const savedSession = getSavedActiveSession();

  // Atualiza banner no topo da Home se houver treino pausado/em andamento
  const banner = document.getElementById("resumeWorkoutBanner");
  if (savedSession && savedSession.workoutKey && workoutData[savedSession.workoutKey]) {
    const wInProg = workoutData[savedSession.workoutKey];
    let total = 0;
    let done = 0;
    Object.values(savedSession.setsState || {}).forEach((sets) => {
      sets.forEach((s) => {
        total++;
        if (s.done) done++;
      });
    });
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    document.getElementById("rbTitle").textContent = `${wInProg.name} • ${pct}% concluído (${done}/${total} séries)`;
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }

  container.innerHTML = keys
    .map((key) => {
      const w = workoutData[key];
      const isWeekend = key === "D";
      const isInProgress = savedSession && savedSession.workoutKey === key;
      return `
        <div class="workout-card ${isInProgress ? "in-progress-card" : ""}" onclick="openWorkout('${key}')">
          <div class="wc-left">
            <div class="wc-title-row">
              <h2>${w.name}</h2>
              ${isInProgress ? `<span class="badge-in-progress">EM ANDAMENTO</span>` : ""}
            </div>
            <div class="wc-badges">
              <span class="badge-primary">${w.tag}</span>
              <span class="badge-neutral">${w.exercises.length} EXERCÍCIOS</span>
              ${isWeekend ? `<span class="badge-gold">+ POSTURA &amp; GLÚTEO</span>` : ""}
            </div>
          </div>
          <div class="wc-arrow">›</div>
        </div>
      `;
    })
    .join("");
}

function openWorkout(key, isRestoring = false) {
  currentWorkoutKey = key;
  const w = workoutData[key];
  const savedSetsStore = JSON.parse(localStorage.getItem("tamara_sets_v13")) || {};
  const savedSession = getSavedActiveSession();

  document.getElementById("detailWorkoutName").textContent = w.name;
  document.getElementById("detailWorkoutTag").textContent = w.tag;
  document.getElementById("detailWorkoutFocus").textContent = w.focus;

  // Se existe uma sessão em andamento para ESTE treino, retoma exato de onde parou!
  if (savedSession && savedSession.workoutKey === key && savedSession.setsState) {
    activeWorkoutState = savedSession.setsState;
    if (savedSession.cardioState) {
      cardioState = { ...savedSession.cardioState };
      syncCardioUIFromState();
    } else {
      resetCardioUI();
    }
    if (isRestoring) {
      showToast(`RETOMANDO ${w.name.toUpperCase()} ⚡`, 1600);
    }
  } else {
    activeWorkoutState = {};
    w.exercises.forEach((ex) => {
      const saved = savedSetsStore[ex.id];
      if (saved && Array.isArray(saved) && saved.length) {
        activeWorkoutState[ex.id] = saved.map((s) => ({
          load: Number(s.load) || 0,
          reps: Number(s.reps) || ex.defaultReps,
          done: false
        }));
      } else {
        activeWorkoutState[ex.id] = Array.from({ length: ex.setsCount }, () => ({
          load: ex.defaultLoad,
          reps: ex.defaultReps,
          done: false
        }));
      }
    });
    resetCardioUI();
  }

  renderExerciseCards();
  updateWorkoutTopMetrics();
  resetRestTimer();
  navigateTo("workoutDetailScreen");
}

function syncCardioUIFromState() {
  document.getElementById("cardioDoneCheck").checked = Boolean(cardioState.done);
  document.getElementById("cardioBox").classList.toggle("cardio-completed", Boolean(cardioState.done));
  document.getElementById("selectedCardioName").textContent = cardioState.mode || "ESCADA";
  document.getElementById("selectedCardioIcon").textContent = cardioState.icon || "🪜";
  document.getElementById("cardioTimeVal").textContent = cardioState.time || 15;
  document.getElementById("cardioKcalVal").textContent = cardioState.kcal || 130;

  document.querySelectorAll(".cardio-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === cardioState.mode);
  });
}

function resetCardioUI() {
  cardioState = {
    mode: "ESCADA",
    icon: "🪜",
    time: 15,
    kcal: 130,
    done: false
  };
  syncCardioUIFromState();
}

function getExerciseMaxPR(exId) {
  const prs = JSON.parse(localStorage.getItem("tamara_prs_v13")) || {};
  return prs[exId] || 0;
}

function renderExerciseCards() {
  const w = workoutData[currentWorkoutKey];
  const container = document.getElementById("exerciseListContainer");

  container.innerHTML = w.exercises
    .map((ex) => {
      const sets = activeWorkoutState[ex.id];
      const allDone = sets.length > 0 && sets.every((s) => s.done);
      const currentMaxLoad = Math.max(...sets.map((s) => Number(s.load) || 0));
      const savedPR = getExerciseMaxPR(ex.id);
      const displayPR = Math.max(currentMaxLoad, savedPR);

      const setsRowsHTML = sets
        .map(
          (set, idx) => `
          <div class="hud-set-row ${set.done ? "done" : ""}" id="set-row-${ex.id}-${idx}">
            <div class="set-num-box">${idx + 1}</div>
            <div class="set-stepper">
              <button type="button" class="set-step-btn" onclick="adjustSetField('${ex.id}', ${idx}, 'load', -2.5)">−</button>
              <input
                type="number"
                step="0.5"
                class="set-val-input"
                value="${set.load}"
                onchange="setFieldDirect('${ex.id}', ${idx}, 'load', this.value)"
              />
              <button type="button" class="set-step-btn" onclick="adjustSetField('${ex.id}', ${idx}, 'load', 2.5)">+</button>
            </div>
            <div class="set-stepper">
              <button type="button" class="set-step-btn" onclick="adjustSetField('${ex.id}', ${idx}, 'reps', -1)">−</button>
              <input
                type="number"
                class="set-val-input"
                value="${set.reps}"
                onchange="setFieldDirect('${ex.id}', ${idx}, 'reps', this.value)"
              />
              <button type="button" class="set-step-btn" onclick="adjustSetField('${ex.id}', ${idx}, 'reps', 1)">+</button>
            </div>
            <button type="button" class="set-ok-btn" onclick="toggleSetDone('${ex.id}', ${idx})" aria-label="Concluir série">
              ✓
            </button>
          </div>
        `
        )
        .join("");

      const canRemoveSet = sets.length > 1;

      return `
        <div class="hud-ex-card ${allDone ? "all-completed" : ""}" id="ex-card-${ex.id}">
          <div class="hud-ex-header">
            <div class="hud-ex-title-wrap">
              <div class="hud-ex-title-line">
                <h3 class="hud-ex-title">${ex.name}</h3>
                <span class="hud-completed-pill">✓ CONCLUÍDO</span>
              </div>
              <div class="hud-ex-submeta">
                ${displayPR > 0 ? `<span class="hud-pr-pill">🔥 RECORDE: ${displayPR} KG</span>` : `<span class="hud-target-pill">PESO CORPORAL</span>`}
                <span class="hud-target-pill">ALVO: ${ex.targetReps}</span>
              </div>
              <div class="hud-ex-note">${ex.note}</div>
            </div>
          </div>

          <div class="hud-sets-columns">
            <span>SÉRIE</span>
            <span>CARGA (KG)</span>
            <span>REPS</span>
            <span>OK</span>
          </div>

          <div class="hud-sets-list">
            ${setsRowsHTML}
          </div>

          <div class="hud-ex-footer">
            ${canRemoveSet ? `<button type="button" class="btn-remove-set" onclick="removeLastSet('${ex.id}')">− REMOVER SÉRIE</button>` : ""}
            <button type="button" class="btn-extra-set" onclick="addExtraSet('${ex.id}')">+ SÉRIE EXTRA</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function adjustSetField(exId, setIdx, field, delta) {
  const item = activeWorkoutState[exId][setIdx];
  if (!item) return;
  const nextVal = Math.max(0, Number((Number(item[field]) + delta).toFixed(1)));
  item[field] = nextVal;
  persistSetsTemplate(exId);
  saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

function setFieldDirect(exId, setIdx, field, rawVal) {
  const item = activeWorkoutState[exId][setIdx];
  if (!item) return;
  item[field] = Math.max(0, Number(rawVal) || 0);
  persistSetsTemplate(exId);
  saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

function toggleSetDone(exId, setIdx) {
  const sets = activeWorkoutState[exId];
  sets[setIdx].done = !sets[setIdx].done;

  if (sets[setIdx].done) {
    startRestTimer();
    const allDone = sets.every((s) => s.done);
    if (allDone) {
      showToast("EXERCÍCIO CONCLUÍDO! ✓", 1500);
    }
  }

  persistSetsTemplate(exId);
  saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

function addExtraSet(exId) {
  const sets = activeWorkoutState[exId];
  const last = sets[sets.length - 1] || { load: 10, reps: 12 };
  sets.push({ load: last.load, reps: last.reps, done: false });
  persistSetsTemplate(exId);
  saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("+1 SÉRIE ADICIONADA", 1200);
}

function removeLastSet(exId) {
  const sets = activeWorkoutState[exId];
  if (!sets || sets.length <= 1) {
    showToast("MÍNIMO DE 1 SÉRIE OBRIGATÓRIA", 1300);
    return;
  }
  sets.pop();
  persistSetsTemplate(exId);
  saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("−1 SÉRIE REMOVIDA", 1200);
}

function persistSetsTemplate(exId) {
  const savedSetsStore = JSON.parse(localStorage.getItem("tamara_sets_v13")) || {};
  savedSetsStore[exId] = activeWorkoutState[exId].map((s) => ({
    load: s.load,
    reps: s.reps
  }));
  localStorage.setItem("tamara_sets_v13", JSON.stringify(savedSetsStore));

  const prs = JSON.parse(localStorage.getItem("tamara_prs_v13")) || {};
  const maxNow = Math.max(...activeWorkoutState[exId].map((s) => Number(s.load) || 0));
  if (maxNow > (prs[exId] || 0)) {
    prs[exId] = maxNow;
    localStorage.setItem("tamara_prs_v13", JSON.stringify(prs));
  }
}

function updateWorkoutTopMetrics() {
  const w = workoutData[currentWorkoutKey];
  let totalSets = 0;
  let doneSets = 0;
  let totalVolume = 0;

  w.exercises.forEach((ex) => {
    const sets = activeWorkoutState[ex.id] || [];
    sets.forEach((s) => {
      totalSets++;
      if (s.done) {
        doneSets++;
        totalVolume += (Number(s.load) || 0) * (Number(s.reps) || 0);
      }
    });
  });

  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  document.getElementById("workoutTotalLoad").textContent = `⚡ ${Math.round(totalVolume)} KG`;
  document.getElementById("workoutProgressBadge").textContent = `${doneSets}/${totalSets} • ${pct}%`;
  document.getElementById("workoutProgressFill").style.width = `${pct}%`;
}

function clearCurrentWorkout() {
  const w = workoutData[currentWorkoutKey];
  w.exercises.forEach((ex) => {
    if (activeWorkoutState[ex.id]) {
      activeWorkoutState[ex.id].forEach((s) => {
        s.done = false;
      });
    }
  });
  resetCardioUI();
  resetRestTimer();
  clearSavedActiveSession();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("SÉRIES E CARDIO DESMARCADOS ↺", 1600);
}

/* CARDIO */
function toggleCardioDrawer() {
  const panel = document.getElementById("cardioDrawerPanel");
  const trigger = document.getElementById("cardioDrawerTrigger");
  const isOpen = panel.classList.toggle("open");
  trigger.classList.toggle("collapsed", !isOpen);
}

function selectCardioMode(mode, icon) {
  cardioState.mode = mode;
  cardioState.icon = icon;
  document.getElementById("selectedCardioName").textContent = mode;
  document.getElementById("selectedCardioIcon").textContent = icon;

  document.querySelectorAll(".cardio-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  saveActiveSessionState();
}

function adjustCardioMetric(type, delta) {
  if (type === "time") {
    cardioState.time = Math.max(5, cardioState.time + delta);
    document.getElementById("cardioTimeVal").textContent = cardioState.time;
  } else if (type === "kcal") {
    cardioState.kcal = Math.max(10, cardioState.kcal + delta);
    document.getElementById("cardioKcalVal").textContent = cardioState.kcal;
  }
  saveActiveSessionState();
}

function toggleCardioDone(checked) {
  cardioState.done = checked;
  document.getElementById("cardioBox").classList.toggle("cardio-completed", checked);
  saveActiveSessionState();
  if (checked) {
    showToast(`CARDIO (${cardioState.mode}) CONCLUÍDO ✓`, 1500);
  }
}

/* REST TIMER */
function updateTimerDisplay() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  document.getElementById("restTimerDisplay").textContent = `${mins}:${secs}`;
}

function startRestTimer() {
  clearInterval(timerInterval);
  timerSeconds = 60;
  timerRunning = true;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      showToast("DESCANSO CONCLUÍDO! PRÓXIMA SÉRIE ⚡", 2200);
      timerSeconds = 60;
      updateTimerDisplay();
    }
  }, 1000);
}

function toggleRestTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 60;
    updateTimerDisplay();
    showToast("TIMER REINICIADO (01:00)", 1200);
  } else {
    startRestTimer();
    showToast("DESCANSO INICIADO (60s)", 1200);
  }
}

function resetRestTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 60;
  updateTimerDisplay();
}

function finishWorkoutSession() {
  const w = workoutData[currentWorkoutKey];
  const history = JSON.parse(localStorage.getItem("tamara_workout_history")) || [];
  const todayISO = getTodayISO();

  let totalVolume = 0;
  w.exercises.forEach((ex) => {
    (activeWorkoutState[ex.id] || []).forEach((s) => {
      if (s.done) totalVolume += (Number(s.load) || 0) * (Number(s.reps) || 0);
    });
  });

  const cardioSummary = cardioState.done
    ? `${cardioState.mode} • ${cardioState.time} min (${cardioState.kcal} kcal)`
    : "Não marcado";

  history.unshift({
    date: new Date().toLocaleDateString("pt-BR"),
    isoDate: todayISO,
    workoutKey: w.id,
    workout: `${w.name} (${w.tag})`,
    volumeKg: Math.round(totalVolume),
    cardio: cardioSummary
  });

  localStorage.setItem("tamara_workout_history", JSON.stringify(history));

  // Limpa a sessão em andamento e desmarca séries para o próximo treino
  clearSavedActiveSession();
  w.exercises.forEach((ex) => {
    if (activeWorkoutState[ex.id]) {
      activeWorkoutState[ex.id].forEach((s) => {
        s.done = false;
      });
    }
  });
  resetCardioUI();
  resetRestTimer();

  selectedCalDateISO = todayISO;
  calViewYear = new Date().getFullYear();
  calViewMonth = new Date().getMonth();

  showToast(`CHECK-IN ${w.name.toUpperCase()} REGISTRADO! ✓`, 2000);
  renderDashboard();
  setTimeout(() => navigateTo("dashboardScreen"), 650);
}

/* =========================================================
   CALENDÁRIO ESTILO GYMRATS + SEQUÊNCIA (STREAK)
   ========================================================= */
function calculateStreak(history) {
  if (!history.length) return 0;
  const uniqueDates = new Set();
  history.forEach((h) => {
    const iso = h.isoDate || brToISO(h.date);
    if (iso) uniqueDates.add(iso);
  });

  const sorted = Array.from(uniqueDates).sort().reverse();
  if (!sorted.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const latestDate = new Date(sorted[0] + "T00:00:00");
  // Se o último treino não foi hoje nem ontem, a sequência ativa zerou
  if (latestDate < yesterday) return 0;

  let streak = 1;
  let cursor = new Date(latestDate);

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i] + "T00:00:00");
    const diffDays = Math.round((cursor - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      cursor = prev;
    } else if (diffDays > 1) {
      break;
    }
  }
  return streak;
}

function changeCalendarMonth(delta) {
  calViewMonth += delta;
  if (calViewMonth < 0) {
    calViewMonth = 11;
    calViewYear--;
  } else if (calViewMonth > 11) {
    calViewMonth = 0;
    calViewYear++;
  }
  renderGymRatsCalendar();
}

function selectCalendarDay(isoDate) {
  selectedCalDateISO = isoDate;
  renderGymRatsCalendar();
}

function renderGymRatsCalendar() {
  const history = JSON.parse(localStorage.getItem("tamara_workout_history")) || [];
  const monthNames = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
  ];

  document.getElementById("calMonthLabel").textContent = `${monthNames[calViewMonth]} ${calViewYear}`;

  // Mapeia treinos por data ISO (YYYY-MM-DD)
  const checkinsMap = {};
  history.forEach((h) => {
    const iso = h.isoDate || brToISO(h.date);
    if (!iso) return;
    if (!checkinsMap[iso]) checkinsMap[iso] = [];
    checkinsMap[iso].push(h);
  });

  const firstDayWeekday = new Date(calViewYear, calViewMonth, 1).getDay();
  const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
  const todayISO = getTodayISO();

  let monthCheckinDays = 0;
  let cellsHTML = "";

  for (let i = 0; i < firstDayWeekday; i++) {
    cellsHTML += `<div class="cal-day-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const mStr = String(calViewMonth + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const iso = `${calViewYear}-${mStr}-${dStr}`;
    const dayLogs = checkinsMap[iso] || [];
    const hasCheckin = dayLogs.length > 0;
    if (hasCheckin) monthCheckinDays++;

    const isToday = iso === todayISO;
    const isSelected = iso === selectedCalDateISO;

    // Extrai letra do treino (A, B, C ou D) para mostrar no quadradinho estilo GymRats
    let badgeText = "";
    if (hasCheckin) {
      const letters = dayLogs
        .map((item) => item.workoutKey || (item.workout.match(/Treino\s+([A-D])/i) || [])[1] || "✓")
        .join("+");
      badgeText = letters;
    }

    cellsHTML += `
      <div
        class="cal-day-cell ${hasCheckin ? "checked-in" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""}"
        onclick="selectCalendarDay('${iso}')"
      >
        <span class="day-num">${day}</span>
        ${hasCheckin ? `<span class="cal-day-badge">${badgeText}</span>` : ""}
      </div>
    `;
  }

  document.getElementById("calDaysGrid").innerHTML = cellsHTML;
  document.getElementById("calMonthCheckinsCount").textContent =
    `${monthCheckinDays} ${monthCheckinDays === 1 ? "dia" : "dias"} no mês`;

  // Atualiza caixa de detalhe do dia selecionado
  const selLogs = checkinsMap[selectedCalDateISO] || [];
  const titleEl = document.getElementById("cddDateTitle");
  const badgeEl = document.getElementById("cddStatusBadge");
  const contentEl = document.getElementById("cddContent");

  titleEl.textContent = `DIA ${isoToBR(selectedCalDateISO)}`;
  if (selLogs.length > 0) {
    badgeEl.textContent = "TREINO CONCLUÍDO ✓";
    badgeEl.classList.add("active-checkin");
    contentEl.innerHTML = selLogs
      .map(
        (l) =>
          `• <strong>${l.workout}</strong>${l.volumeKg ? ` (${l.volumeKg} kg movidos)` : ""}<br/>&nbsp;&nbsp;Cardio: ${l.cardio}`
      )
      .join("<br/>");
  } else {
    badgeEl.textContent = "DESCANSO";
    badgeEl.classList.remove("active-checkin");
    contentEl.textContent = "Nenhum treino registrado nesta data.";
  }
}

/* MEDIDAS CORPORAIS */
function saveMeasurements() {
  const peso = document.getElementById("mPeso").value.trim();
  const torax = document.getElementById("mTorax").value.trim();
  const cintura = document.getElementById("mCintura").value.trim();
  const abdomen = document.getElementById("mAbdomen").value.trim();
  const quadril = document.getElementById("mQuadril").value.trim();
  const bracoD = document.getElementById("mBracoD").value.trim();
  const bracoE = document.getElementById("mBracoE").value.trim();
  const coxaD = document.getElementById("mCoxaD").value.trim();
  const coxaE = document.getElementById("mCoxaE").value.trim();

  if (!peso && !torax && !cintura && !abdomen && !quadril && !bracoD && !bracoE && !coxaD && !coxaE) {
    showToast("PREENCHA AO MENOS UMA MEDIDA!", 1600);
    return;
  }

  const list = JSON.parse(localStorage.getItem("tamara_measures_list")) || [];
  list.unshift({
    date: new Date().toLocaleDateString("pt-BR"),
    peso: peso || "-",
    torax: torax || "-",
    cintura: cintura || "-",
    abdomen: abdomen || "-",
    quadril: quadril || "-",
    bracoD: bracoD || "-",
    bracoE: bracoE || "-",
    coxaD: coxaD || "-",
    coxaE: coxaE || "-"
  });

  localStorage.setItem("tamara_measures_list", JSON.stringify(list));
  renderDashboard();
  showToast("MEDIDAS SALVAS COM SUCESSO ✓", 1800);
}

function renderDashboard() {
  const history = JSON.parse(localStorage.getItem("tamara_workout_history")) || [];
  const measures = JSON.parse(localStorage.getItem("tamara_measures_list")) || [];
  const streak = calculateStreak(history);

  document.getElementById("homeTotalSessions").textContent = history.length;
  document.getElementById("homeStreakVal").textContent = `${streak} ${streak === 1 ? "DIA" : "DIAS"}`;
  document.getElementById("homeLastWorkout").textContent = history.length
    ? `${history[0].workout.split(" (")[0]} • ${history[0].date}`
    : "—";

  document.getElementById("kpiWorkouts").textContent = history.length;
  document.getElementById("kpiStreak").textContent = `${streak}d`;
  const lastWithWeight = measures.find((m) => m.peso && m.peso !== "-");
  document.getElementById("kpiWeight").textContent = lastWithWeight ? `${lastWithWeight.peso} kg` : "—";

  renderGymRatsCalendar();

  const mListEl = document.getElementById("measuresHistoryList");
  if (!measures.length) {
    mListEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;">Nenhuma medição registrada ainda.</div>`;
  } else {
    mListEl.innerHTML = measures
      .map(
        (m) => `
        <div class="measure-history-card">
          <div class="measure-history-top">
            <span>${m.date}</span>
            <span>PESO: ${m.peso} KG</span>
          </div>
          <div class="measure-history-vals">
            Tórax: <strong>${m.torax}</strong> cm • Cintura: <strong>${m.cintura}</strong> cm • Abdômen: <strong>${m.abdomen}</strong> cm • Quadril: <strong>${m.quadril || "-"}</strong> cm<br/>
            Braço D/E: <strong>${m.bracoD}</strong> / <strong>${m.bracoE}</strong> cm • Coxa D/E: <strong>${m.coxaD}</strong> / <strong>${m.coxaE}</strong> cm
          </div>
        </div>
      `
      )
      .join("");
  }

  const wListEl = document.getElementById("workoutHistoryList");
  if (!history.length) {
    wListEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;">Nenhum treino registrado ainda.</div>`;
  } else {
    wListEl.innerHTML = history
      .slice(0, 15)
      .map(
        (h) => `
        <div class="measure-history-card">
          <div class="measure-history-top">
            <span>${h.workout}</span>
            <span>${h.date}</span>
          </div>
          <div class="measure-history-vals">Cardio pós-treino: <strong>${h.cardio}</strong></div>
        </div>
      `
      )
      .join("");
  }
}

/* BACKUP JSON & LIMPEZA TOTAL */
function exportBackupJSON() {
  const payload = {
    tamara_sets_v13: JSON.parse(localStorage.getItem("tamara_sets_v13")) || {},
    tamara_prs_v13: JSON.parse(localStorage.getItem("tamara_prs_v13")) || {},
    tamara_workout_history: JSON.parse(localStorage.getItem("tamara_workout_history")) || [],
    tamara_measures_list: JSON.parse(localStorage.getItem("tamara_measures_list")) || []
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tamara-fitness-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("BACKUP EXPORTADO ✓", 1800);
}

function importBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.tamara_sets_v13) localStorage.setItem("tamara_sets_v13", JSON.stringify(data.tamara_sets_v13));
      if (data.tamara_prs_v13) localStorage.setItem("tamara_prs_v13", JSON.stringify(data.tamara_prs_v13));
      if (data.tamara_workout_history) localStorage.setItem("tamara_workout_history", JSON.stringify(data.tamara_workout_history));
      if (data.tamara_measures_list) localStorage.setItem("tamara_measures_list", JSON.stringify(data.tamara_measures_list));
      renderDashboard();
      showToast("BACKUP RESTAURADO COM SUCESSO ✓", 2000);
    } catch {
      showToast("ARQUIVO JSON INVÁLIDO!", 1800);
    }
  };
  reader.readAsText(file);
}

function resetAllAppData() {
  const confirmed = confirm("Deseja realmente apagar TODO o histórico de treinos, calendário, recordes, cargas salvas e medidas corporais?");
  if (!confirmed) return;

  localStorage.removeItem("tamara_sets_v13");
  localStorage.removeItem("tamara_prs_v13");
  localStorage.removeItem("tamara_workout_history");
  localStorage.removeItem("tamara_measures_list");
  clearSavedActiveSession();

  renderWorkoutCards();
  renderDashboard();
  showToast("TODOS OS DADOS FORAM LIMPOS 🗑️", 2000);
}

function showToast(msg, duration = 1600) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

document.addEventListener("DOMContentLoaded", initApp);
