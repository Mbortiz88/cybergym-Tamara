/* =========================================================
   CONFIGURAÇÃO DO FIREBASE (PROJETO: cybergym-matheus-ortiz)
   ========================================================= */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAoT05zjZH9W9fdmNeCGCppJwGeEJTxXos",
  authDomain: "cybergym-matheus-ortiz.firebaseapp.com",
  projectId: "cybergym-matheus-ortiz",
  storageBucket: "cybergym-matheus-ortiz.firebasestorage.app",
  messagingSenderId: "867243931319",
  appId: "1:867243931319:web:e666e71d57ab6e024a7f32",
  measurementId: "G-Z5Q9Q7D83K",
};

const DB_NAME = "TamaraFitnessDB_v3";
const DB_VERSION = 1;
const LEGACY_KEYS = [
  "tamara_sets_v13",
  "tamara_prs_v13",
  "tamara_workout_history",
  "tamara_measures_list",
];
const LEGACY_ACTIVE_KEY = "tamara_active_session_v18";

let fbApp = null;
let fbAuth = null;
let fbDb = null;
let currentCloudUser = null;
let unsubCheckins = null;
let unsubMeasures = null;
let unsubTemplates = null;
let isSyncingNow = false;
let isSavingCheckin = false;
let lastSyncTimestamp = 0;

/* Cache em memória do usuário ativo (isolado por uid) */
let stateCache = {
  userId: "local",
  checkins: [],
  measures: [],
  templates: {}, // { [exId]: { exId, sets: [...], pr: number, updatedAt: number } }
  activeSession: null,
};

const workoutData = {
  A: {
    id: "A",
    name: "Treino A",
    tag: "QUADRÍCEPS, EMPURRAR & CORE",
    focus:
      "Anterior de coxa, glúteos, sóleo, dorsais, peitoral e abdômen infra.",
    exercises: [
      {
        id: "a1",
        name: "Leg Press Horizontal",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 40,
        defaultReps: 12,
        note: "Amplitude confortável • Foco em quadríceps e glúteos",
      },
      {
        id: "a2",
        name: "Cadeira Extensora",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 20,
        defaultReps: 12,
        note: "Foco anterior de coxa e estabilidade do joelho",
      },
      {
        id: "a3",
        name: "Panturrilha Sentada",
        setsCount: 3,
        targetReps: "15–20",
        defaultLoad: 15,
        defaultReps: 15,
        note: "Foco no sóleo • Pausa curta embaixo e em cima",
      },
      {
        id: "a4",
        name: "Puxada Frontal na Polia",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 20,
        defaultReps: 12,
        note: "Costas + trabalho indireto de bíceps",
      },
      {
        id: "a5",
        name: "Supino Máquina Articulada",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Peitoral, ombros + trabalho indireto de tríceps",
      },
      {
        id: "a6",
        name: "Abdominal Infra com Apoio de Braços",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 0,
        defaultReps: 12,
        note: "Elevação controlada de joelhos/pernas (0 = Peso do corpo)",
      },
    ],
  },
  B: {
    id: "B",
    name: "Treino B",
    tag: "POSTERIOR, REMADA & TRÍCEPS",
    focus:
      "Posterior de coxa, adutores, gastrocnêmio, postura/costas, tríceps e prancha.",
    exercises: [
      {
        id: "b1",
        name: "Mesa ou Cadeira Flexora",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 20,
        defaultReps: 12,
        note: "Foco em posterior de coxa • Controle na volta",
      },
      {
        id: "b2",
        name: "Cadeira Adutora",
        setsCount: 3,
        targetReps: "15",
        defaultLoad: 25,
        defaultReps: 15,
        note: "Parte interna da coxa • Movimento contínuo",
      },
      {
        id: "b3",
        name: "Panturrilha no Leg Press Horizontal",
        setsCount: 3,
        targetReps: "15–20",
        defaultLoad: 40,
        defaultReps: 15,
        note: "Foco no gastrocnêmio • Joelhos quase estendidos",
      },
      {
        id: "b4",
        name: "Remada Baixa na Polia ou Máquina",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 20,
        defaultReps: 12,
        note: "Postura, costas + trabalho indireto de bíceps",
      },
      {
        id: "b5",
        name: "Tríceps na Polia",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 15,
        defaultReps: 12,
        note: "Foco direto na parte posterior dos braços",
      },
      {
        id: "b6",
        name: "Prancha Isométrica (Segundos)",
        setsCount: 3,
        targetReps: "30–45s",
        defaultLoad: 0,
        defaultReps: 35,
        note: "Controle abdominal e cervical neutra (Reps = segundos)",
      },
    ],
  },
  C: {
    id: "C",
    name: "Treino C",
    tag: "GLÚTEOS, OMBROS & BÍCEPS",
    focus:
      "Glúteo médio, agachamento seguro, panturrilha em pé, ombros, bíceps e core.",
    exercises: [
      {
        id: "c1",
        name: "Cadeira Abdutora",
        setsCount: 3,
        targetReps: "15",
        defaultLoad: 30,
        defaultReps: 15,
        note: "Glúteo médio e estabilidade lateral do quadril/joelho",
      },
      {
        id: "c2",
        name: "Agachamento Guiado Leve",
        setsCount: 3,
        targetReps: "12",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Com apoio e amplitude segura para joelhos e lombar",
      },
      {
        id: "c3",
        name: "Panturrilha em Pé na Máquina",
        setsCount: 3,
        targetReps: "15–20",
        defaultLoad: 15,
        defaultReps: 15,
        note: "Amplitude máxima com apoio firme",
      },
      {
        id: "c4",
        name: "Desenvolvimento na Máquina Articulada",
        setsCount: 3,
        targetReps: "12",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Ombros + trabalho indireto de tríceps",
      },
      {
        id: "c5",
        name: "Rosca Bíceps na Máquina ou Polia",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Foco direto nos braços sem balançar o tronco",
      },
      {
        id: "c6",
        name: "Abdominal Infra no Banco/Colchonete",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 0,
        defaultReps: 12,
        note: "Ativação profunda do core com cabeça totalmente apoiada",
      },
    ],
  },
  D: {
    id: "D",
    name: "Treino D",
    tag: "FULLBODY (FIM DE SEMANA)",
    focus:
      "Adutores, glúteos sem sobrecarga no joelho, resistência de panturrilha, postura, braços e core.",
    exercises: [
      {
        id: "d1",
        name: "Cadeira Adutora",
        setsCount: 3,
        targetReps: "15",
        defaultLoad: 25,
        defaultReps: 15,
        note: "Parte interna da coxa • Movimento controlado",
      },
      {
        id: "d2",
        name: "Elevação Pélvica na Máquina",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 30,
        defaultReps: 12,
        note: "Glúteos e posterior sem sobrecarga vertical nos joelhos/tíbia",
      },
      {
        id: "d3",
        name: "Panturrilha no Degrau ou Sentada",
        setsCount: 3,
        targetReps: "15–20",
        defaultLoad: 0,
        defaultReps: 15,
        note: "Estímulo leve de resistência e mobilidade de tornozelo",
      },
      {
        id: "d4",
        name: "Puxada Triângulo na Polia",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 20,
        defaultReps: 12,
        note: "Costas e postura • Puxada controlada em direção ao peito",
      },
      {
        id: "d5",
        name: "Crucifixo Inverso na Máquina",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Posterior de ombros e alinhamento postural sem sobrecarga cervical",
      },
      {
        id: "d6",
        name: "Tríceps Francês ou Coice na Polia",
        setsCount: 3,
        targetReps: "12–15",
        defaultLoad: 10,
        defaultReps: 12,
        note: "Firmeza de braços e controle abdominal",
      },
    ],
  },
};

let currentWorkoutKey = "A";
let activeWorkoutState = {};
let cardioState = {
  mode: "ESCADA",
  icon: "🪜",
  time: 15,
  kcal: 130,
  done: false,
};

let pendingWorkoutPhoto = "";
let pendingManualPhoto = "";

/* Cronômetro baseado no relógio real (não atrasa com tela bloqueada) */
let timerEndTimestamp = 0;
let timerInterval = null;
let timerRunning = false;

let calViewYear = new Date().getFullYear();
let calViewMonth = new Date().getMonth();
let selectedCalDateISO = getTodayISO();

/* =========================================================
   UTILITÁRIOS DE SEGURANÇA, ID E DATAS
   ========================================================= */
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function generateUID() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return (
    "id_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substring(2, 10)
  );
}

function getActiveUserId() {
  return currentCloudUser && currentCloudUser.uid
    ? currentCloudUser.uid
    : "local";
}

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoToBR(iso) {
  if (!iso || typeof iso !== "string" || !iso.includes("-")) return iso || "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function brToISO(br) {
  if (!br || typeof br !== "string") return "";
  if (br.includes("-")) return br;
  const parts = br.split("/");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

function safeReadLegacyJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/* =========================================================
   CAMADA 1: BANCO LOCAL INDEXEDDB (ISOLADO POR USUÁRIO)
   ========================================================= */
let dbPromise = null;

function openLocalDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("checkins")) {
        const store = db.createObjectStore("checkins", {
          keyPath: ["userId", "id"],
        });
        store.createIndex("by_user", "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains("measures")) {
        const store = db.createObjectStore("measures", {
          keyPath: ["userId", "id"],
        });
        store.createIndex("by_user", "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains("templates")) {
        const store = db.createObjectStore("templates", {
          keyPath: ["userId", "exId"],
        });
        store.createIndex("by_user", "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains("active_sessions")) {
        db.createObjectStore("active_sessions", { keyPath: "userId" });
      }
      if (!db.objectStoreNames.contains("tombstones")) {
        const store = db.createObjectStore("tombstones", {
          keyPath: ["userId", "id"],
        });
        store.createIndex("by_user", "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains("sync_queue")) {
        const store = db.createObjectStore("sync_queue", {
          keyPath: ["userId", "queueKey"],
        });
        store.createIndex("by_user", "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function idbGetAllByUser(storeName, userId) {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index("by_user");
    const req = index.getAll(userId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(storeName, key) {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(storeName, record) {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).put(record);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(storeName, key) {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbClearUserStore(storeName, userId) {
  const items = await idbGetAllByUser(storeName, userId);
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    items.forEach((item) => {
      if (storeName === "templates") {
        store.delete([userId, item.exId]);
      } else if (storeName === "sync_queue") {
        store.delete([userId, item.queueKey]);
      } else {
        store.delete([userId, item.id]);
      }
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function loadUserStateFromIDB(userId) {
  const [checkins, measures, templatesList, activeSess] = await Promise.all([
    idbGetAllByUser("checkins", userId),
    idbGetAllByUser("measures", userId),
    idbGetAllByUser("templates", userId),
    idbGet("active_sessions", userId),
  ]);

  checkins.sort(
    (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0),
  );
  measures.sort(
    (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0),
  );

  const templatesMap = {};
  templatesList.forEach((t) => {
    templatesMap[t.exId] = t;
  });

  stateCache = {
    userId,
    checkins,
    measures,
    templates: templatesMap,
    activeSession: activeSess || null,
  };
}

/* =========================================================
   CAMADA 2: FILA OFFLINE E SINCRONIZAÇÃO POR REGISTRO (FIRESTORE)
   ========================================================= */
async function enqueueSyncOp(userId, collectionName, docId, opType, payload) {
  if (!userId || userId === "local") return;
  const queueKey = `${collectionName}:${docId}`;
  await idbPut("sync_queue", {
    userId,
    queueKey,
    collectionName,
    docId,
    opType, // "upsert" | "delete"
    payload,
    updatedAt: Date.now(),
  });
}

async function flushSyncQueue() {
  if (!fbDb || !currentCloudUser) return false;
  if (isSyncingNow) return false;
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    return false;

  const userId = currentCloudUser.uid;
  const queue = await idbGetAllByUser("sync_queue", userId);
  if (!queue.length) return true;

  isSyncingNow = true;
  try {
    const userDocRef = fbDb.collection("users").doc(userId);
    // Garante metadados básicos no documento raiz
    await userDocRef.set(
      {
        displayName: currentCloudUser.displayName || "",
        email: currentCloudUser.email || "",
        schemaVersion: 3,
        lastActiveAt: Date.now(),
      },
      { merge: true },
    );

    // Envia em lotes seguros (até 25 operações por batch para respeitar 10MB por batch)
    const BATCH_LIMIT = 25;
    for (let i = 0; i < queue.length; i += BATCH_LIMIT) {
      const slice = queue.slice(i, i + BATCH_LIMIT);
      const batch = fbDb.batch();

      slice.forEach((item) => {
        const docRef = userDocRef
          .collection(item.collectionName)
          .doc(item.docId);
        if (item.opType === "delete") {
          batch.delete(docRef);
        } else {
          const cleanPayload = { ...item.payload };
          delete cleanPayload.userId;
          batch.set(docRef, cleanPayload, { merge: true });
        }
      });

      await batch.commit();

      for (const item of slice) {
        await idbDelete("sync_queue", [userId, item.queueKey]);
      }
    }

    lastSyncTimestamp = Date.now();
    await idbPut("meta", {
      key: `last_sync_${userId}`,
      value: lastSyncTimestamp,
    });
    renderConnectedCloudBanner(lastSyncTimestamp);
    return true;
  } catch (err) {
    console.warn("Erro ao enviar fila para Firestore:", err);
    const errCode = err && err.code ? err.code : "erro-rede";
    const userLabel =
      currentCloudUser.displayName || currentCloudUser.email || "Conta Google";
    updateCloudUI(
      "PENDENTE / OFFLINE",
      `${userLabel} • Alterações salvas localmente (${errCode}).`,
      true,
      true,
    );
    return false;
  } finally {
    isSyncingNow = false;
  }
}

async function pullRemoteSubcollections(userId) {
  if (!fbDb || !userId || userId === "local") return;
  const userDocRef = fbDb.collection("users").doc(userId);

  const [checkinsSnap, measuresSnap, templatesSnap, tombstonesSnap] =
    await Promise.all([
      userDocRef.collection("checkins").get(),
      userDocRef.collection("measures").get(),
      userDocRef.collection("templates").get(),
      userDocRef.collection("tombstones").get(),
    ]);

  // 1. Aplica tombstones (exclusões explícitas)
  const deletedIds = new Set();
  const localTombs = await idbGetAllByUser("tombstones", userId);
  localTombs.forEach((t) => deletedIds.add(t.id));

  for (const doc of tombstonesSnap.docs) {
    const data = doc.data() || {};
    const targetId = data.targetId || doc.id;
    deletedIds.add(targetId);
    await idbPut("tombstones", {
      userId,
      id: targetId,
      deletedAt: data.deletedAt || Date.now(),
    });
    await idbDelete("checkins", [userId, targetId]);
    await idbDelete("measures", [userId, targetId]);
  }

  // 2. Mescla check-ins remotos (last-write-wins por registro individual)
  for (const doc of checkinsSnap.docs) {
    if (deletedIds.has(doc.id)) continue;
    const remote = doc.data() || {};
    const local = await idbGet("checkins", [userId, doc.id]);
    const remoteUpdated =
      Number(remote.updatedAt) || Number(remote.createdAt) || 0;
    const localUpdated = local
      ? Number(local.updatedAt) || Number(local.createdAt) || 0
      : -1;

    if (!local || remoteUpdated > localUpdated) {
      await idbPut("checkins", {
        ...remote,
        userId,
        id: doc.id,
      });
    }
  }

  // 3. Mescla medidas remotas
  for (const doc of measuresSnap.docs) {
    if (deletedIds.has(doc.id)) continue;
    const remote = doc.data() || {};
    const local = await idbGet("measures", [userId, doc.id]);
    const remoteUpdated =
      Number(remote.updatedAt) || Number(remote.createdAt) || 0;
    const localUpdated = local
      ? Number(local.updatedAt) || Number(local.createdAt) || 0
      : -1;

    if (!local || remoteUpdated > localUpdated) {
      await idbPut("measures", {
        ...remote,
        userId,
        id: doc.id,
      });
    }
  }

  // 4. Mescla templates e recordes (PRs) por exercício
  for (const doc of templatesSnap.docs) {
    const remote = doc.data() || {};
    const exId = remote.exId || doc.id;
    const local = await idbGet("templates", [userId, exId]);
    const remoteUpdated = Number(remote.updatedAt) || 0;
    const localUpdated = local ? Number(local.updatedAt) || 0 : -1;

    const mergedPR = Math.max(
      Number(remote.pr) || 0,
      local ? Number(local.pr) || 0 : 0,
    );

    if (!local || remoteUpdated > localUpdated) {
      await idbPut("templates", {
        userId,
        exId,
        sets: Array.isArray(remote.sets) ? remote.sets : local?.sets || [],
        pr: mergedPR,
        updatedAt: Math.max(remoteUpdated, localUpdated),
      });
    } else if (mergedPR > (Number(local.pr) || 0)) {
      const updatedLocal = { ...local, pr: mergedPR };
      await idbPut("templates", updatedLocal);
      await enqueueSyncOp(userId, "templates", exId, "upsert", updatedLocal);
    }
  }
}

/* =========================================================
   CAMADA 3: MIGRAÇÃO AUTOMÁTICA DO FORMATO LEGADO (V2 -> V3)
   ========================================================= */
async function migrateLegacyDataIfNeeded(userId) {
  // A) Migração do localStorage antigo (apenas 1 vez)
  const localMigMeta = await idbGet("meta", "legacy_localstorage_migrated");
  if (!localMigMeta) {
    const oldHistory = safeReadLegacyJSON("tamara_workout_history", []);
    const oldMeasures = safeReadLegacyJSON("tamara_measures_list", []);
    const oldSets = safeReadLegacyJSON("tamara_sets_v13", {});
    const oldPrs = safeReadLegacyJSON("tamara_prs_v13", {});

    const hasAnyLegacy =
      (Array.isArray(oldHistory) && oldHistory.length > 0) ||
      (Array.isArray(oldMeasures) && oldMeasures.length > 0) ||
      Object.keys(oldSets).length > 0 ||
      Object.keys(oldPrs).length > 0;

    if (hasAnyLegacy) {
      const now = Date.now();
      if (Array.isArray(oldHistory)) {
        for (let i = 0; i < oldHistory.length; i++) {
          const item = oldHistory[i];
          if (!item) continue;
          const id = item.id || generateUID();
          const ts = now - i * 1000;
          const record = {
            userId,
            id,
            date: item.date || isoToBR(item.isoDate || getTodayISO()),
            isoDate: item.isoDate || brToISO(item.date) || getTodayISO(),
            workoutKey: item.workoutKey || "",
            workout: item.workout || "Treino",
            volumeKg: Number(item.volumeKg) || 0,
            cardio: item.cardio || "",
            photo: item.photo || "",
            isManual: Boolean(item.isManual),
            createdAt: ts,
            updatedAt: ts,
          };
          await idbPut("checkins", record);
          if (userId !== "local") {
            await enqueueSyncOp(userId, "checkins", id, "upsert", record);
          }
        }
      }

      if (Array.isArray(oldMeasures)) {
        for (let i = 0; i < oldMeasures.length; i++) {
          const m = oldMeasures[i];
          if (!m) continue;
          const id = m.id || generateUID();
          const ts = now - i * 1000;
          const record = {
            userId,
            id,
            date: m.date || new Date().toLocaleDateString("pt-BR"),
            peso: m.peso || "-",
            torax: m.torax || "-",
            cintura: m.cintura || "-",
            abdomen: m.abdomen || "-",
            quadril: m.quadril || "-",
            bracoD: m.bracoD || "-",
            bracoE: m.bracoE || "-",
            coxaD: m.coxaD || "-",
            coxaE: m.coxaE || "-",
            createdAt: ts,
            updatedAt: ts,
          };
          await idbPut("measures", record);
          if (userId !== "local") {
            await enqueueSyncOp(userId, "measures", id, "upsert", record);
          }
        }
      }

      const allExIds = new Set([
        ...Object.keys(oldSets),
        ...Object.keys(oldPrs),
      ]);
      for (const exId of allExIds) {
        const record = {
          userId,
          exId,
          sets: Array.isArray(oldSets[exId]) ? oldSets[exId] : [],
          pr: Number(oldPrs[exId]) || 0,
          updatedAt: now,
        };
        await idbPut("templates", record);
        if (userId !== "local") {
          await enqueueSyncOp(userId, "templates", exId, "upsert", record);
        }
      }

      // Limpa chaves antigas do localStorage após migrar com segurança
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem(LEGACY_ACTIVE_KEY);
    }

    await idbPut("meta", {
      key: "legacy_localstorage_migrated",
      value: true,
    });
  }

  // B) Se logado no Google, verifica se há dados criados no modo "local" para incorporar à conta
  if (userId !== "local") {
    const [localCheckins, localMeasures, localTemplates] = await Promise.all([
      idbGetAllByUser("checkins", "local"),
      idbGetAllByUser("measures", "local"),
      idbGetAllByUser("templates", "local"),
    ]);

    for (const item of localCheckins) {
      const migrated = { ...item, userId };
      await idbPut("checkins", migrated);
      await enqueueSyncOp(userId, "checkins", item.id, "upsert", migrated);
      await idbDelete("checkins", ["local", item.id]);
    }

    for (const item of localMeasures) {
      const migrated = { ...item, userId };
      await idbPut("measures", migrated);
      await enqueueSyncOp(userId, "measures", item.id, "upsert", migrated);
      await idbDelete("measures", ["local", item.id]);
    }

    for (const item of localTemplates) {
      const migrated = { ...item, userId };
      await idbPut("templates", migrated);
      await enqueueSyncOp(userId, "templates", item.exId, "upsert", migrated);
      await idbDelete("templates", ["local", item.exId]);
    }
  }

  // C) Se logado no Google, verifica o documento legado users/{uid} no Firestore
  if (userId !== "local" && fbDb) {
    const cloudMigMeta = await idbGet(
      "meta",
      `legacy_cloud_migrated_${userId}`,
    );
    if (!cloudMigMeta) {
      try {
        const userDocRef = fbDb.collection("users").doc(userId);
        const rootSnap = await userDocRef.get();
        if (rootSnap.exists) {
          const rootData = rootSnap.data() || {};
          const legacyBlob = rootData.data || rootData.payload || null;

          if (
            legacyBlob &&
            typeof legacyBlob === "object" &&
            !rootData.v3Migrated
          ) {
            const now = Date.now();

            if (typeof legacyBlob.tamara_workout_history === "string") {
              const arr = JSON.parse(legacyBlob.tamara_workout_history);
              if (Array.isArray(arr)) {
                for (let i = 0; i < arr.length; i++) {
                  const item = arr[i];
                  if (!item) continue;
                  const id =
                    item.id ||
                    `leg_c_${i}_${(item.isoDate || "").replace(/-/g, "")}`;
                  const existing = await idbGet("checkins", [userId, id]);
                  if (!existing) {
                    const ts = now - i * 1000;
                    const record = {
                      userId,
                      id,
                      date: item.date || isoToBR(item.isoDate || getTodayISO()),
                      isoDate:
                        item.isoDate || brToISO(item.date) || getTodayISO(),
                      workoutKey: item.workoutKey || "",
                      workout: item.workout || "Treino",
                      volumeKg: Number(item.volumeKg) || 0,
                      cardio: item.cardio || "",
                      photo: item.photo || "",
                      isManual: Boolean(item.isManual),
                      createdAt: ts,
                      updatedAt: ts,
                    };
                    await idbPut("checkins", record);
                    await enqueueSyncOp(
                      userId,
                      "checkins",
                      id,
                      "upsert",
                      record,
                    );
                  }
                }
              }
            }

            if (typeof legacyBlob.tamara_measures_list === "string") {
              const arr = JSON.parse(legacyBlob.tamara_measures_list);
              if (Array.isArray(arr)) {
                for (let i = 0; i < arr.length; i++) {
                  const m = arr[i];
                  if (!m) continue;
                  const id =
                    m.id || `leg_m_${i}_${(m.date || "").replace(/\//g, "")}`;
                  const existing = await idbGet("measures", [userId, id]);
                  if (!existing) {
                    const ts = now - i * 1000;
                    const record = {
                      userId,
                      id,
                      date: m.date || "",
                      peso: m.peso || "-",
                      torax: m.torax || "-",
                      cintura: m.cintura || "-",
                      abdomen: m.abdomen || "-",
                      quadril: m.quadril || "-",
                      bracoD: m.bracoD || "-",
                      bracoE: m.bracoE || "-",
                      coxaD: m.coxaD || "-",
                      coxaE: m.coxaE || "-",
                      createdAt: ts,
                      updatedAt: ts,
                    };
                    await idbPut("measures", record);
                    await enqueueSyncOp(
                      userId,
                      "measures",
                      id,
                      "upsert",
                      record,
                    );
                  }
                }
              }
            }

            const setsObj =
              typeof legacyBlob.tamara_sets_v13 === "string"
                ? JSON.parse(legacyBlob.tamara_sets_v13)
                : {};
            const prsObj =
              typeof legacyBlob.tamara_prs_v13 === "string"
                ? JSON.parse(legacyBlob.tamara_prs_v13)
                : {};
            const exKeys = new Set([
              ...Object.keys(setsObj || {}),
              ...Object.keys(prsObj || {}),
            ]);

            for (const exId of exKeys) {
              const existing = await idbGet("templates", [userId, exId]);
              const record = {
                userId,
                exId,
                sets: Array.isArray(setsObj[exId])
                  ? setsObj[exId]
                  : existing?.sets || [],
                pr: Math.max(
                  Number(prsObj[exId]) || 0,
                  Number(existing?.pr) || 0,
                ),
                updatedAt: now,
              };
              await idbPut("templates", record);
              await enqueueSyncOp(userId, "templates", exId, "upsert", record);
            }

            await flushSyncQueue();
            await userDocRef.set({ v3Migrated: true }, { merge: true });
          }
        }
        await idbPut("meta", {
          key: `legacy_cloud_migrated_${userId}`,
          value: true,
        });
      } catch (err) {
        console.warn("Aviso na migração legada do Firestore:", err);
      }
    }
  }
}

/* =========================================================
   SINCRONIZAÇÃO COMPLETA & LISTENERS EM TEMPO REAL
   ========================================================= */
function detachFirestoreListeners() {
  if (typeof unsubCheckins === "function") {
    unsubCheckins();
    unsubCheckins = null;
  }
  if (typeof unsubMeasures === "function") {
    unsubMeasures();
    unsubMeasures = null;
  }
  if (typeof unsubTemplates === "function") {
    unsubTemplates();
    unsubTemplates = null;
  }
}

function attachFirestoreRealtimeListeners(userId) {
  if (!fbDb || !userId || userId === "local") return;
  detachFirestoreListeners();

  const userDocRef = fbDb.collection("users").doc(userId);

  unsubCheckins = userDocRef.collection("checkins").onSnapshot(
    async (snap) => {
      if (isSyncingNow || getActiveUserId() !== userId) return;
      let changed = false;
      for (const change of snap.docChanges()) {
        const docId = change.doc.id;
        if (change.type === "removed") {
          await idbDelete("checkins", [userId, docId]);
          changed = true;
        } else {
          const remote = change.doc.data() || {};
          const local = await idbGet("checkins", [userId, docId]);
          const rUpd =
            Number(remote.updatedAt) || Number(remote.createdAt) || 0;
          const lUpd = local
            ? Number(local.updatedAt) || Number(local.createdAt) || 0
            : -1;
          if (!local || rUpd > lUpd) {
            await idbPut("checkins", { ...remote, userId, id: docId });
            changed = true;
          }
        }
      }
      if (changed) {
        await loadUserStateFromIDB(userId);
        renderDashboard();
      }
    },
    (err) => console.warn("Listener checkins:", err && err.code),
  );

  unsubMeasures = userDocRef.collection("measures").onSnapshot(
    async (snap) => {
      if (isSyncingNow || getActiveUserId() !== userId) return;
      let changed = false;
      for (const change of snap.docChanges()) {
        const docId = change.doc.id;
        if (change.type === "removed") {
          await idbDelete("measures", [userId, docId]);
          changed = true;
        } else {
          const remote = change.doc.data() || {};
          const local = await idbGet("measures", [userId, docId]);
          const rUpd =
            Number(remote.updatedAt) || Number(remote.createdAt) || 0;
          const lUpd = local
            ? Number(local.updatedAt) || Number(local.createdAt) || 0
            : -1;
          if (!local || rUpd > lUpd) {
            await idbPut("measures", { ...remote, userId, id: docId });
            changed = true;
          }
        }
      }
      if (changed) {
        await loadUserStateFromIDB(userId);
        renderDashboard();
      }
    },
    (err) => console.warn("Listener measures:", err && err.code),
  );

  unsubTemplates = userDocRef.collection("templates").onSnapshot(
    async (snap) => {
      if (isSyncingNow || getActiveUserId() !== userId) return;
      let changed = false;
      for (const change of snap.docChanges()) {
        const exId = change.doc.id;
        const remote = change.doc.data() || {};
        const local = await idbGet("templates", [userId, exId]);
        const rUpd = Number(remote.updatedAt) || 0;
        const lUpd = local ? Number(local.updatedAt) || 0 : -1;
        if (!local || rUpd > lUpd) {
          await idbPut("templates", {
            userId,
            exId,
            sets: remote.sets || [],
            pr: Math.max(Number(remote.pr) || 0, Number(local?.pr) || 0),
            updatedAt: rUpd,
          });
          changed = true;
        }
      }
      if (changed) {
        await loadUserStateFromIDB(userId);
      }
    },
    (err) => console.warn("Listener templates:", err && err.code),
  );
}

async function fullSyncCycle(silent = true) {
  if (!fbDb || !currentCloudUser) return false;
  const userId = currentCloudUser.uid;
  try {
    await migrateLegacyDataIfNeeded(userId);
    await flushSyncQueue();
    await pullRemoteSubcollections(userId);
    await flushSyncQueue();
    await loadUserStateFromIDB(userId);

    renderWorkoutCards();
    renderDashboard();

    lastSyncTimestamp = Date.now();
    await idbPut("meta", {
      key: `last_sync_${userId}`,
      value: lastSyncTimestamp,
    });
    renderConnectedCloudBanner(lastSyncTimestamp);

    if (!silent) {
      showToast("NUVEM SINCRONIZADA ✓", 1800);
    }
    return true;
  } catch (err) {
    const errCode = err && err.code ? err.code : "erro-sync";
    updateCloudUI(
      "ERRO DE SINCRONIZAÇÃO",
      `Falha ao sincronizar (${errCode}). Verifique sua conexão ou regras do Firestore.`,
      true,
      true,
    );
    if (!silent) {
      showToast(`ERRO NUVEM: ${errCode.toUpperCase()}`, 2400);
    }
    return false;
  }
}

/* =========================================================
   COMPRESSÃO E PRÉ-VISUALIZAÇÃO DE FOTO DO CHECK-IN
   ========================================================= */
function compressImageToDataURL(file, maxWidth = 720, quality = 0.74) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erro ao ler imagem"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleCheckinPhotoSelect(event, context) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    showToast("PROCESSANDO FOTO...", 1200);
    const compressedDataUrl = await compressImageToDataURL(file, 720, 0.74);

    if (context === "workout") {
      pendingWorkoutPhoto = compressedDataUrl;
      document.getElementById("workoutPhotoPreviewImg").src = compressedDataUrl;
      document.getElementById("workoutPhotoPreviewWrap").style.display =
        "block";
    } else {
      pendingManualPhoto = compressedDataUrl;
      document.getElementById("manualPhotoPreviewImg").src = compressedDataUrl;
      document.getElementById("manualPhotoPreviewWrap").style.display = "block";
    }
    showToast("FOTO ANEXADA ✓", 1500);
  } catch (err) {
    console.error(err);
    showToast("NÃO FOI POSSÍVEL CARREGAR A FOTO", 2000);
  }
}

function clearSelectedPhoto(context) {
  if (context === "workout") {
    pendingWorkoutPhoto = "";
    const input = document.getElementById("workoutPhotoInput");
    if (input) input.value = "";
    const wrap = document.getElementById("workoutPhotoPreviewWrap");
    if (wrap) wrap.style.display = "none";
  } else {
    pendingManualPhoto = "";
    const input = document.getElementById("manualPhotoInput");
    if (input) input.value = "";
    const wrap = document.getElementById("manualPhotoPreviewWrap");
    if (wrap) wrap.style.display = "none";
  }
}

function openPhotoLightboxById(checkinId) {
  const item = stateCache.checkins.find((c) => c.id === checkinId);
  if (!item || !item.photo) return;

  document.getElementById("plbTitle").textContent =
    `${item.date || ""} • ${String(item.workout || "").split(" (")[0]}`;
  document.getElementById("plbImage").src = item.photo;
  document.getElementById("plbCaption").textContent =
    item.cardio || item.workout || "";
  document.getElementById("photoLightboxModal").classList.add("open");
}

function closePhotoLightbox() {
  document.getElementById("photoLightboxModal").classList.remove("open");
}

/* =========================================================
   FIREBASE AUTH & INTERFACE DO CARD DE NUVEM
   ========================================================= */
function isFirebaseConfigured() {
  return Boolean(
    FIREBASE_CONFIG &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.appId,
  );
}

function formatSyncTimestamp(ts) {
  const num = Number(ts);
  if (!num) return "";
  const d = new Date(num);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function updateCloudUI(statusText, infoText, loggedIn, isError = false) {
  const statusEl = document.getElementById("cloudSyncStatus");
  const infoEl = document.getElementById("cloudUserInfo");
  const loggedOutBox = document.getElementById("cloudLoggedOutActions");
  const loggedInBox = document.getElementById("cloudLoggedInActions");

  if (statusEl) {
    statusEl.textContent = statusText;
    statusEl.style.background = "";
    statusEl.style.color = "";
    if (isError) {
      statusEl.classList.remove("active-checkin");
      statusEl.style.background = "rgba(255, 59, 92, 0.2)";
      statusEl.style.color = "#ff6b84";
    } else if (loggedIn) {
      statusEl.classList.add("active-checkin");
    } else {
      statusEl.classList.remove("active-checkin");
    }
  }

  if (infoEl && infoText) {
    infoEl.textContent = infoText;
  }

  if (loggedOutBox && loggedInBox) {
    loggedOutBox.style.display = loggedIn ? "none" : "block";
    loggedInBox.style.display = loggedIn ? "grid" : "none";
  }
}

function renderConnectedCloudBanner(syncTs) {
  if (!currentCloudUser) return;
  const userLabel =
    currentCloudUser.displayName || currentCloudUser.email || "Conta Google";
  const lastSyncStr = formatSyncTimestamp(syncTs || lastSyncTimestamp);
  const infoMsg = lastSyncStr
    ? `Conta: ${userLabel} • Última sincronização: ${lastSyncStr}`
    : `Conta: ${userLabel} • Sincronização individual ativa`;
  updateCloudUI("ATIVO • SINCRONIZADO", infoMsg, true, false);
}

function initFirebaseSafely() {
  if (
    !isFirebaseConfigured() ||
    typeof window.firebase === "undefined" ||
    !window.firebase.apps
  ) {
    updateCloudUI(
      "LOCAL / SEM CHAVE",
      "Modo offline ativo. Configure FIREBASE_CONFIG em script.js para habilitar o login Google na nuvem.",
      false,
    );
    return;
  }

  try {
    if (!window.firebase.apps.length) {
      fbApp = window.firebase.initializeApp(FIREBASE_CONFIG);
    } else {
      fbApp = window.firebase.app();
    }
    fbAuth = window.firebase.auth();
    fbDb = window.firebase.firestore();

    if (fbAuth && !fbAuth._tamaraAuthAttached) {
      fbAuth._tamaraAuthAttached = true;

      fbAuth.getRedirectResult().catch(() => {});

      fbAuth.onAuthStateChanged(async (user) => {
        currentCloudUser = user || null;
        const activeUid = getActiveUserId();

        await loadUserStateFromIDB(activeUid);
        renderWorkoutCards();
        renderDashboard();

        if (user) {
          const metaSync = await idbGet("meta", `last_sync_${user.uid}`);
          lastSyncTimestamp = metaSync ? Number(metaSync.value) || 0 : 0;
          renderConnectedCloudBanner(lastSyncTimestamp);
          await fullSyncCycle(true);
          attachFirestoreRealtimeListeners(user.uid);
        } else {
          detachFirestoreListeners();
          updateCloudUI(
            "OFFLINE / LOCAL",
            "Conecte sua conta Google para sincronizar treinos, check-ins, fotos, recordes e medidas automaticamente.",
            false,
          );
        }
      });
    }
  } catch (err) {
    updateCloudUI(
      "ERRO NUVEM",
      `Não foi possível inicializar o Firebase (${err.code || err.message}).`,
      false,
      true,
    );
  }
}

async function loginWithGoogle() {
  if (!isFirebaseConfigured()) {
    showToast("CONFIGURE O FIREBASE_CONFIG NO SCRIPT.JS", 2600);
    return;
  }

  try {
    if (!fbAuth) initFirebaseSafely();
    const provider = new window.firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await fbAuth.signInWithPopup(provider);
  } catch (err) {
    const errCode = err && err.code ? err.code : "";
    if (
      errCode === "auth/popup-blocked" ||
      errCode === "auth/cancelled-popup-request" ||
      errCode === "auth/operation-not-supported-in-this-environment"
    ) {
      try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        await fbAuth.signInWithRedirect(provider);
        return;
      } catch {}
    }
    showToast(`LOGIN GOOGLE BLOQUEADO ${errCode}`, 2400);
  }
}

async function logoutGoogle() {
  try {
    detachFirestoreListeners();
    if (fbAuth) {
      await fbAuth.signOut();
    }
    currentCloudUser = null;
    await loadUserStateFromIDB("local");
    renderWorkoutCards();
    renderDashboard();
    updateCloudUI(
      "OFFLINE / LOCAL",
      "Desconectado da conta Google. Seus dados continuam protegidos na sua conta.",
      false,
    );
    showToast("VOCÊ SAIU DA CONTA GOOGLE", 1800);
  } catch {
    showToast("ERRO AO SAIR DA CONTA", 1800);
  }
}

async function manualCloudSync() {
  if (!currentCloudUser) {
    showToast("ENTRE COM O GOOGLE PRIMEIRO", 1800);
    return;
  }
  await fullSyncCycle(false);
}

window.loginWithGoogle = loginWithGoogle;
window.logoutGoogle = logoutGoogle;
window.manualCloudSync = manualCloudSync;

/* =========================================================
   INICIALIZAÇÃO E RASCUNHO DO TREINO EM ANDAMENTO
   ========================================================= */
async function initApp() {
  try {
    await openLocalDB();
    await migrateLegacyDataIfNeeded("local");
    await loadUserStateFromIDB("local");

    initFirebaseSafely();

    const mcDateInput = document.getElementById("mcDate");
    if (mcDateInput && !mcDateInput.value) {
      mcDateInput.value = getTodayISO();
    }

    renderWorkoutCards();
    renderDashboard();
    registerSW();

    const savedSession = stateCache.activeSession;
    if (
      savedSession &&
      savedSession.workoutKey &&
      workoutData[savedSession.workoutKey]
    ) {
      openWorkout(savedSession.workoutKey, true);
    }
  } catch (err) {
    console.error("Erro na inicialização:", err);
    renderWorkoutCards();
  }
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

async function saveActiveSessionState() {
  const userId = getActiveUserId();
  let hasAnyProgress = Boolean(cardioState.done);
  Object.values(activeWorkoutState).forEach((sets) => {
    if (Array.isArray(sets) && sets.some((s) => s && s.done)) {
      hasAnyProgress = true;
    }
  });

  if (!hasAnyProgress) {
    stateCache.activeSession = null;
    await idbDelete("active_sessions", userId);
    return;
  }

  const payload = {
    userId,
    workoutKey: currentWorkoutKey,
    setsState: activeWorkoutState,
    cardioState: cardioState,
    updatedAt: Date.now(),
  };
  stateCache.activeSession = payload;
  await idbPut("active_sessions", payload);
}

async function clearSavedActiveSession() {
  const userId = getActiveUserId();
  stateCache.activeSession = null;
  await idbDelete("active_sessions", userId);
}

function resumeActiveWorkout() {
  const saved = stateCache.activeSession;
  if (saved && saved.workoutKey) {
    openWorkout(saved.workoutKey, true);
  }
}

function navigateTo(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");

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
  if (!container) return;

  const keys = Object.keys(workoutData);
  const savedSession = stateCache.activeSession;

  const banner = document.getElementById("resumeWorkoutBanner");
  if (banner) {
    if (
      savedSession &&
      savedSession.workoutKey &&
      workoutData[savedSession.workoutKey]
    ) {
      const wInProg = workoutData[savedSession.workoutKey];
      let total = 0;
      let done = 0;
      Object.values(savedSession.setsState || {}).forEach((sets) => {
        if (Array.isArray(sets)) {
          sets.forEach((s) => {
            total++;
            if (s && s.done) done++;
          });
        }
      });
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const rbTitle = document.getElementById("rbTitle");
      if (rbTitle)
        rbTitle.textContent = `${wInProg.name} • ${pct}% concluído (${done}/${total} séries)`;
      banner.style.display = "flex";
    } else {
      banner.style.display = "none";
    }
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
              <h2>${escapeHTML(w.name)}</h2>
              ${isInProgress ? `<span class="badge-in-progress">EM ANDAMENTO</span>` : ""}
            </div>
            <div class="wc-badges">
              <span class="badge-primary">${escapeHTML(w.tag)}</span>
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
  const w = workoutData[key];
  if (!w) return;

  currentWorkoutKey = key;
  clearSelectedPhoto("workout");
  const savedSession = stateCache.activeSession;

  document.getElementById("detailWorkoutName").textContent = w.name;
  document.getElementById("detailWorkoutTag").textContent = w.tag;
  document.getElementById("detailWorkoutFocus").textContent = w.focus;

  const hasValidRestoredSets =
    savedSession &&
    savedSession.workoutKey === key &&
    savedSession.setsState &&
    w.exercises.every(
      (ex) =>
        Array.isArray(savedSession.setsState[ex.id]) &&
        savedSession.setsState[ex.id].length > 0,
    );

  if (hasValidRestoredSets) {
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
      const tpl = stateCache.templates[ex.id];
      const saved = tpl && Array.isArray(tpl.sets) ? tpl.sets : null;
      if (saved && saved.length > 0) {
        activeWorkoutState[ex.id] = saved.map((s) => ({
          load: Number(s.load) || 0,
          reps: Number(s.reps) || ex.defaultReps,
          done: false,
        }));
      } else {
        activeWorkoutState[ex.id] = Array.from(
          { length: ex.setsCount },
          () => ({
            load: ex.defaultLoad,
            reps: ex.defaultReps,
            done: false,
          }),
        );
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
  document.getElementById("cardioDoneCheck").checked = Boolean(
    cardioState.done,
  );
  document
    .getElementById("cardioBox")
    .classList.toggle("cardio-completed", Boolean(cardioState.done));
  document.getElementById("selectedCardioName").textContent =
    cardioState.mode || "ESCADA";
  document.getElementById("selectedCardioIcon").textContent =
    cardioState.icon || "🪜";
  document.getElementById("cardioTimeVal").textContent = cardioState.time || 15;
  document.getElementById("cardioKcalVal").textContent =
    cardioState.kcal || 130;

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
    done: false,
  };
  syncCardioUIFromState();
}

function getExerciseMaxPR(exId) {
  const tpl = stateCache.templates[exId];
  return tpl ? Number(tpl.pr) || 0 : 0;
}

function renderExerciseCards() {
  const w = workoutData[currentWorkoutKey];
  const container = document.getElementById("exerciseListContainer");
  if (!w || !container) return;

  container.innerHTML = w.exercises
    .map((ex) => {
      const sets = activeWorkoutState[ex.id] || [];
      const allDone = sets.length > 0 && sets.every((s) => s.done);
      // Recorde contabiliza apenas séries concluídas (done: true) + histórico de PR
      const doneMaxLoad = sets.some((s) => s.done)
        ? Math.max(
            ...sets.filter((s) => s.done).map((s) => Number(s.load) || 0),
          )
        : 0;
      const savedPR = getExerciseMaxPR(ex.id);
      const displayPR = Math.max(doneMaxLoad, savedPR);

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
        `,
        )
        .join("");

      const canRemoveSet = sets.length > 1;

      return `
        <div class="hud-ex-card ${allDone ? "all-completed" : ""}" id="ex-card-${ex.id}">
          <div class="hud-ex-header">
            <div class="hud-ex-title-wrap">
              <div class="hud-ex-title-line">
                <h3 class="hud-ex-title">${escapeHTML(ex.name)}</h3>
                <span class="hud-completed-pill">✓ CONCLUÍDO</span>
              </div>
              <div class="hud-ex-submeta">
                ${displayPR > 0 ? `<span class="hud-pr-pill">🔥 RECORDE: ${displayPR} KG</span>` : `<span class="hud-target-pill">PESO CORPORAL</span>`}
                <span class="hud-target-pill">ALVO: ${escapeHTML(ex.targetReps)}</span>
              </div>
              <div class="hud-ex-note">${escapeHTML(ex.note)}</div>
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

async function adjustSetField(exId, setIdx, field, delta) {
  const item = activeWorkoutState[exId] && activeWorkoutState[exId][setIdx];
  if (!item) return;
  const nextVal = Math.max(0, Number((Number(item[field]) + delta).toFixed(1)));
  item[field] = nextVal;
  await persistSetsTemplate(exId);
  await saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

async function setFieldDirect(exId, setIdx, field, rawVal) {
  const item = activeWorkoutState[exId] && activeWorkoutState[exId][setIdx];
  if (!item) return;
  item[field] = Math.max(0, Number(rawVal) || 0);
  await persistSetsTemplate(exId);
  await saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

async function toggleSetDone(exId, setIdx) {
  const sets = activeWorkoutState[exId];
  if (!sets || !sets[setIdx]) return;
  sets[setIdx].done = !sets[setIdx].done;

  if (sets[setIdx].done) {
    startRestTimer();
    const allDone = sets.every((s) => s.done);
    if (allDone) {
      showToast("EXERCÍCIO CONCLUÍDO! ✓", 1500);
    }
  }

  await persistSetsTemplate(exId);
  await saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
}

async function addExtraSet(exId) {
  const sets = activeWorkoutState[exId];
  if (!sets) return;
  const last = sets[sets.length - 1] || { load: 10, reps: 12 };
  sets.push({ load: last.load, reps: last.reps, done: false });
  await persistSetsTemplate(exId);
  await saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("+1 SÉRIE ADICIONADA", 1200);
}

async function removeLastSet(exId) {
  const sets = activeWorkoutState[exId];
  if (!sets || sets.length <= 1) {
    showToast("MÍNIMO DE 1 SÉRIE OBRIGATÓRIA", 1300);
    return;
  }
  sets.pop();
  await persistSetsTemplate(exId);
  await saveActiveSessionState();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("−1 SÉRIE REMOVIDA", 1200);
}

async function persistSetsTemplate(exId) {
  const userId = getActiveUserId();
  const currentSets = activeWorkoutState[exId] || [];
  const existingTpl = stateCache.templates[exId] || {
    userId,
    exId,
    sets: [],
    pr: 0,
    updatedAt: 0,
  };

  // Só contabiliza recorde (PR) se a série estiver concluída (done === true)
  const completedLoads = currentSets
    .filter((s) => s && s.done)
    .map((s) => Number(s.load) || 0);
  const maxCompletedNow = completedLoads.length
    ? Math.max(...completedLoads)
    : 0;
  const updatedPR = Math.max(Number(existingTpl.pr) || 0, maxCompletedNow);

  const record = {
    userId,
    exId,
    sets: currentSets.map((s) => ({
      load: Number(s.load) || 0,
      reps: Number(s.reps) || 0,
    })),
    pr: updatedPR,
    updatedAt: Date.now(),
  };

  stateCache.templates[exId] = record;
  await idbPut("templates", record);

  if (userId !== "local") {
    await enqueueSyncOp(userId, "templates", exId, "upsert", record);
    flushSyncQueue();
  }
}

function updateWorkoutTopMetrics() {
  const w = workoutData[currentWorkoutKey];
  if (!w) return;
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
  document.getElementById("workoutTotalLoad").textContent =
    `⚡ ${Math.round(totalVolume)} KG`;
  document.getElementById("workoutProgressBadge").textContent =
    `${doneSets}/${totalSets} • ${pct}%`;
  document.getElementById("workoutProgressFill").style.width = `${pct}%`;
}

async function clearCurrentWorkout() {
  const w = workoutData[currentWorkoutKey];
  w.exercises.forEach((ex) => {
    if (activeWorkoutState[ex.id]) {
      activeWorkoutState[ex.id].forEach((s) => {
        s.done = false;
      });
    }
  });
  clearSelectedPhoto("workout");
  resetCardioUI();
  resetRestTimer();
  await clearSavedActiveSession();
  renderExerciseCards();
  updateWorkoutTopMetrics();
  showToast("SÉRIES E CARDIO DESMARCADOS ↺", 1600);
}

/* =========================================================
   CARDIO
   ========================================================= */
function toggleCardioDrawer() {
  const panel = document.getElementById("cardioDrawerPanel");
  const trigger = document.getElementById("cardioDrawerTrigger");
  const isOpen = panel.classList.toggle("open");
  trigger.classList.toggle("collapsed", !isOpen);
}

async function selectCardioMode(mode, icon) {
  cardioState.mode = mode;
  cardioState.icon = icon;
  document.getElementById("selectedCardioName").textContent = mode;
  document.getElementById("selectedCardioIcon").textContent = icon;

  document.querySelectorAll(".cardio-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  await saveActiveSessionState();
}

async function adjustCardioMetric(type, delta) {
  if (type === "time") {
    cardioState.time = Math.max(5, cardioState.time + delta);
    document.getElementById("cardioTimeVal").textContent = cardioState.time;
  } else if (type === "kcal") {
    cardioState.kcal = Math.max(10, cardioState.kcal + delta);
    document.getElementById("cardioKcalVal").textContent = cardioState.kcal;
  }
  await saveActiveSessionState();
}

async function toggleCardioDone(checked) {
  cardioState.done = checked;
  document
    .getElementById("cardioBox")
    .classList.toggle("cardio-completed", checked);
  await saveActiveSessionState();
  if (checked) {
    showToast(`CARDIO (${cardioState.mode}) CONCLUÍDO ✓`, 1500);
  }
}

/* =========================================================
   CRONÔMETRO PRECISO BASEADO EM TIMESTAMP (Date.now())
   ========================================================= */
function getRemainingTimerSeconds() {
  if (!timerRunning || !timerEndTimestamp) return 60;
  const diff = Math.ceil((timerEndTimestamp - Date.now()) / 1000);
  return Math.max(0, diff);
}

function updateTimerDisplay() {
  const secsLeft = timerRunning ? getRemainingTimerSeconds() : 60;
  const mins = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const secs = String(secsLeft % 60).padStart(2, "0");
  const el = document.getElementById("restTimerDisplay");
  if (el) el.textContent = `${mins}:${secs}`;
}

function startRestTimer() {
  clearInterval(timerInterval);
  timerEndTimestamp = Date.now() + 60000;
  timerRunning = true;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    const remaining = getRemainingTimerSeconds();
    updateTimerDisplay();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerEndTimestamp = 0;
      showToast("DESCANSO CONCLUÍDO! PRÓXIMA SÉRIE ⚡", 2200);
      updateTimerDisplay();
    }
  }, 250);
}

function toggleRestTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerEndTimestamp = 0;
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
  timerEndTimestamp = 0;
  updateTimerDisplay();
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && timerRunning) {
    updateTimerDisplay();
  }
});

/* =========================================================
   FINALIZAR TREINO & CHECK-IN MANUAL (REGISTROS INDIVIDUAIS)
   ========================================================= */
async function finishWorkoutSession() {
  if (isSavingCheckin) return;
  isSavingCheckin = true;

  try {
    const userId = getActiveUserId();
    const w = workoutData[currentWorkoutKey];
    const todayISO = getTodayISO();
    const now = Date.now();

    let totalVolume = 0;
    w.exercises.forEach((ex) => {
      (activeWorkoutState[ex.id] || []).forEach((s) => {
        if (s.done)
          totalVolume += (Number(s.load) || 0) * (Number(s.reps) || 0);
      });
    });

    const cardioSummary = cardioState.done
      ? `${cardioState.mode} • ${cardioState.time} min (${cardioState.kcal} kcal)`
      : "Não marcado";

    const checkinId = generateUID();
    const record = {
      userId,
      id: checkinId,
      date: new Date().toLocaleDateString("pt-BR"),
      isoDate: todayISO,
      workoutKey: w.id,
      workout: `${w.name} (${w.tag})`,
      volumeKg: Math.round(totalVolume),
      cardio: cardioSummary,
      photo: pendingWorkoutPhoto || "",
      isManual: false,
      createdAt: now,
      updatedAt: now,
    };

    await idbPut("checkins", record);
    stateCache.checkins.unshift(record);

    if (userId !== "local") {
      await enqueueSyncOp(userId, "checkins", checkinId, "upsert", record);
    }

    await clearSavedActiveSession();
    clearSelectedPhoto("workout");
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

    if (userId !== "local") {
      await flushSyncQueue();
    }
    setTimeout(() => navigateTo("dashboardScreen"), 450);
  } finally {
    isSavingCheckin = false;
  }
}

function applyQuickSport(name, icon) {
  const actInput = document.getElementById("mcActivity");
  if (!actInput) return;
  actInput.value = `${icon} ${name}`;
  actInput.focus();
}

async function saveManualCheckin() {
  if (isSavingCheckin) return;

  const rawActivity = document.getElementById("mcActivity").value.trim();
  const dateISO = document.getElementById("mcDate").value || getTodayISO();
  const duration = document.getElementById("mcDuration").value.trim();
  const note = document.getElementById("mcNote").value.trim();

  if (!rawActivity) {
    showToast("INFORME A ATIVIDADE (EX.: VÔLEI, FUTEBOL)!", 1700);
    return;
  }

  isSavingCheckin = true;
  try {
    const userId = getActiveUserId();
    const now = Date.now();
    const cleanLabel =
      rawActivity.replace(/^[^\wÀ-ú]+\s*/, "").trim() || rawActivity;
    const shortTag = cleanLabel.slice(0, 6).toUpperCase();

    const detailsParts = [];
    if (duration) detailsParts.push(`${duration} min`);
    if (note) detailsParts.push(note);
    const detailsText = detailsParts.length
      ? detailsParts.join(" • ")
      : "Check-in manual";

    const checkinId = generateUID();
    const record = {
      userId,
      id: checkinId,
      date: isoToBR(dateISO),
      isoDate: dateISO,
      workoutKey: shortTag,
      workout: `${rawActivity} (CHECK-IN MANUAL)`,
      volumeKg: 0,
      cardio: detailsText,
      photo: pendingManualPhoto || "",
      isManual: true,
      createdAt: now,
      updatedAt: now,
    };

    await idbPut("checkins", record);
    stateCache.checkins.unshift(record);

    if (userId !== "local") {
      await enqueueSyncOp(userId, "checkins", checkinId, "upsert", record);
    }

    document.getElementById("mcActivity").value = "";
    document.getElementById("mcDuration").value = "";
    document.getElementById("mcNote").value = "";
    clearSelectedPhoto("manual");

    const [y, m] = dateISO.split("-").map(Number);
    if (y && m) {
      calViewYear = y;
      calViewMonth = m - 1;
    }
    selectedCalDateISO = dateISO;

    renderDashboard();
    showToast(`CHECK-IN "${cleanLabel.toUpperCase()}" SALVO ✓`, 2000);

    if (userId !== "local") {
      await flushSyncQueue();
    }
  } finally {
    isSavingCheckin = false;
  }
}

/* =========================================================
   CALENDÁRIO ESTILO GYMRATS + SEQUÊNCIA (STREAK)
   ========================================================= */
function calculateStreak(history) {
  if (!Array.isArray(history) || !history.length) return 0;
  const uniqueDates = new Set();
  history.forEach((h) => {
    if (!h) return;
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
  if (isNaN(latestDate.getTime()) || latestDate < yesterday) return 0;

  let streak = 1;
  let cursor = new Date(latestDate);

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i] + "T00:00:00");
    if (isNaN(prev.getTime())) continue;
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
  const mcDateInput = document.getElementById("mcDate");
  if (mcDateInput) mcDateInput.value = isoDate;
  renderGymRatsCalendar();
}

function renderGymRatsCalendar() {
  const gridEl = document.getElementById("calDaysGrid");
  if (!gridEl) return;

  const history = stateCache.checkins || [];
  const monthNames = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];

  document.getElementById("calMonthLabel").textContent =
    `${monthNames[calViewMonth]} ${calViewYear}`;

  const checkinsMap = {};
  history.forEach((h) => {
    if (!h) return;
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

    const itemWithPhoto = dayLogs.find((item) => Boolean(item.photo));
    const hasPhoto = Boolean(itemWithPhoto);
    const cellBgStyle = hasPhoto
      ? `style="background-image: url('${itemWithPhoto.photo}')"`
      : "";

    let badgeText = "";
    if (hasCheckin) {
      const labels = dayLogs.map((item) => {
        if (item.workoutKey && ["A", "B", "C", "D"].includes(item.workoutKey)) {
          return item.workoutKey;
        }
        const wName = String(item.workout || "");
        const match = wName.match(/Treino\s+([A-D])/i);
        if (match) return match[1];
        const clean = wName
          .replace(/\(CHECK-IN MANUAL\)/i, "")
          .replace(/^[^\wÀ-ú]+\s*/, "")
          .trim();
        return clean.slice(0, 5).toUpperCase() || "✓";
      });
      badgeText = escapeHTML(labels.join("+"));
    }

    cellsHTML += `
      <div
        class="cal-day-cell ${hasCheckin ? "checked-in" : ""} ${hasPhoto ? "has-photo" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""}"
        ${cellBgStyle}
        onclick="selectCalendarDay('${iso}')"
      >
        <span class="day-num">${day}</span>
        ${hasCheckin ? `<span class="cal-day-badge">${badgeText}</span>` : ""}
      </div>
    `;
  }

  gridEl.innerHTML = cellsHTML;
  document.getElementById("calMonthCheckinsCount").textContent =
    `${monthCheckinDays} ${monthCheckinDays === 1 ? "dia" : "dias"} no mês`;

  const selLogs = checkinsMap[selectedCalDateISO] || [];
  const titleEl = document.getElementById("cddDateTitle");
  const badgeEl = document.getElementById("cddStatusBadge");
  const contentEl = document.getElementById("cddContent");

  titleEl.textContent = `DIA ${isoToBR(selectedCalDateISO)}`;
  if (selLogs.length > 0) {
    badgeEl.textContent = "CHECK-IN CONCLUÍDO ✓";
    badgeEl.classList.add("active-checkin");
    contentEl.innerHTML = selLogs
      .map((l) => {
        const safeId = escapeHTML(l.id);
        const safeWorkout = escapeHTML(l.workout);
        const safeCardio = escapeHTML(l.cardio || "");
        const photoHTML = l.photo
          ? `<img class="cdd-photo-thumb" src="${l.photo}" alt="Foto do treino" onclick="openPhotoLightboxById('${safeId}')" /><div class="cdd-photo-hint">🔍 Toque na foto para ampliar</div>`
          : "";
        if (l.isManual) {
          return `<div>• <strong>${safeWorkout}</strong><br/>&nbsp;&nbsp;Detalhes: ${safeCardio}${photoHTML}</div>`;
        }
        return `<div>• <strong>${safeWorkout}</strong>${l.volumeKg ? ` (${Number(l.volumeKg)} kg movidos)` : ""}<br/>&nbsp;&nbsp;Cardio: ${safeCardio}${photoHTML}</div>`;
      })
      .join(
        "<hr style='border:0;border-top:1px solid rgba(56,214,255,0.12);margin:8px 0;'/>",
      );
  } else {
    badgeEl.textContent = "SEM CHECK-IN";
    badgeEl.classList.remove("active-checkin");
    contentEl.textContent = "Nenhum treino ou atividade registrada nesta data.";
  }
}

/* =========================================================
   MEDIDAS CORPORAIS (REGISTROS INDIVIDUAIS)
   ========================================================= */
async function saveMeasurements() {
  const peso = document.getElementById("mPeso").value.trim();
  const torax = document.getElementById("mTorax").value.trim();
  const cintura = document.getElementById("mCintura").value.trim();
  const abdomen = document.getElementById("mAbdomen").value.trim();
  const quadril = document.getElementById("mQuadril").value.trim();
  const bracoD = document.getElementById("mBracoD").value.trim();
  const bracoE = document.getElementById("mBracoE").value.trim();
  const coxaD = document.getElementById("mCoxaD").value.trim();
  const coxaE = document.getElementById("mCoxaE").value.trim();

  if (
    !peso &&
    !torax &&
    !cintura &&
    !abdomen &&
    !quadril &&
    !bracoD &&
    !bracoE &&
    !coxaD &&
    !coxaE
  ) {
    showToast("PREENCHA AO MENOS UMA MEDIDA!", 1600);
    return;
  }

  const userId = getActiveUserId();
  const now = Date.now();
  const measureId = generateUID();

  const record = {
    userId,
    id: measureId,
    date: new Date().toLocaleDateString("pt-BR"),
    peso: peso || "-",
    torax: torax || "-",
    cintura: cintura || "-",
    abdomen: abdomen || "-",
    quadril: quadril || "-",
    bracoD: bracoD || "-",
    bracoE: bracoE || "-",
    coxaD: coxaD || "-",
    coxaE: coxaE || "-",
    createdAt: now,
    updatedAt: now,
  };

  await idbPut("measures", record);
  stateCache.measures.unshift(record);

  if (userId !== "local") {
    await enqueueSyncOp(userId, "measures", measureId, "upsert", record);
  }

  renderDashboard();
  showToast("MEDIDAS SALVAS COM SUCESSO ✓", 1800);

  if (userId !== "local") {
    await flushSyncQueue();
  }
}

function renderDashboard() {
  const history = stateCache.checkins || [];
  const measures = stateCache.measures || [];
  const streak = calculateStreak(history);

  document.getElementById("homeTotalSessions").textContent = history.length;
  document.getElementById("homeStreakVal").textContent =
    `${streak} ${streak === 1 ? "DIA" : "DIAS"}`;
  document.getElementById("homeLastWorkout").textContent =
    history.length && history[0]
      ? `${String(history[0].workout || "").split(" (")[0]} • ${history[0].date || ""}`
      : "—";

  document.getElementById("kpiWorkouts").textContent = history.length;
  document.getElementById("kpiStreak").textContent = `${streak}d`;
  const lastWithWeight = measures.find((m) => m && m.peso && m.peso !== "-");
  document.getElementById("kpiWeight").textContent = lastWithWeight
    ? `${lastWithWeight.peso} kg`
    : "—";

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
            <span>${escapeHTML(m.date || "")}</span>
            <span>PESO: ${escapeHTML(m.peso || "-")} KG</span>
          </div>
          <div class="measure-history-vals">
            Tórax: <strong>${escapeHTML(m.torax || "-")}</strong> cm • Cintura: <strong>${escapeHTML(m.cintura || "-")}</strong> cm • Abdômen: <strong>${escapeHTML(m.abdomen || "-")}</strong> cm • Quadril: <strong>${escapeHTML(m.quadril || "-")}</strong> cm<br/>
            Braço D/E: <strong>${escapeHTML(m.bracoD || "-")}</strong> / <strong>${escapeHTML(m.bracoE || "-")}</strong> cm • Coxa D/E: <strong>${escapeHTML(m.coxaD || "-")}</strong> / <strong>${escapeHTML(m.coxaE || "-")}</strong> cm
          </div>
        </div>
      `,
      )
      .join("");
  }

  const wListEl = document.getElementById("workoutHistoryList");
  if (!history.length) {
    wListEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;">Nenhum treino ou check-in registrado ainda.</div>`;
  } else {
    wListEl.innerHTML = history
      .slice(0, 20)
      .map(
        (h) => `
        <div class="measure-history-card">
          <div class="measure-history-top">
            <span>${escapeHTML(h.workout || "Treino")}</span>
            <span>${escapeHTML(h.date || "")}</span>
          </div>
          <div class="measure-history-vals">${h.isManual ? "Atividade" : "Cardio pós-treino"}: <strong>${escapeHTML(h.cardio || "Não marcado")}</strong></div>
          ${h.photo ? `<img class="history-photo-mini" src="${h.photo}" alt="Foto check-in" onclick="openPhotoLightboxById('${escapeHTML(h.id)}')" />` : ""}
        </div>
      `,
      )
      .join("");
  }
}

/* =========================================================
   BACKUP JSON & LIMPEZA TOTAL (COM TOMBSTONES EXPLÍCITOS)
   ========================================================= */
function exportBackupJSON() {
  const payload = {
    version: 3,
    exportedAt: new Date().toISOString(),
    checkins: stateCache.checkins,
    measures: stateCache.measures,
    templates: stateCache.templates,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
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
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const userId = getActiveUserId();
      const now = Date.now();

      // Suporta tanto backup v3 quanto backup antigo v2
      if (Array.isArray(data.checkins)) {
        for (const item of data.checkins) {
          const id = item.id || generateUID();
          const record = { ...item, userId, id, updatedAt: now };
          await idbPut("checkins", record);
          if (userId !== "local") {
            await enqueueSyncOp(userId, "checkins", id, "upsert", record);
          }
        }
      } else if (data.tamara_workout_history) {
        const arr =
          typeof data.tamara_workout_history === "string"
            ? JSON.parse(data.tamara_workout_history)
            : data.tamara_workout_history;
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const id = item.id || generateUID();
            const record = {
              userId,
              id,
              date: item.date || "",
              isoDate: item.isoDate || brToISO(item.date) || getTodayISO(),
              workoutKey: item.workoutKey || "",
              workout: item.workout || "Treino",
              volumeKg: Number(item.volumeKg) || 0,
              cardio: item.cardio || "",
              photo: item.photo || "",
              isManual: Boolean(item.isManual),
              createdAt: now - i * 1000,
              updatedAt: now,
            };
            await idbPut("checkins", record);
            if (userId !== "local") {
              await enqueueSyncOp(userId, "checkins", id, "upsert", record);
            }
          }
        }
      }

      if (Array.isArray(data.measures)) {
        for (const item of data.measures) {
          const id = item.id || generateUID();
          const record = { ...item, userId, id, updatedAt: now };
          await idbPut("measures", record);
          if (userId !== "local") {
            await enqueueSyncOp(userId, "measures", id, "upsert", record);
          }
        }
      } else if (data.tamara_measures_list) {
        const arr =
          typeof data.tamara_measures_list === "string"
            ? JSON.parse(data.tamara_measures_list)
            : data.tamara_measures_list;
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            const m = arr[i];
            const id = m.id || generateUID();
            const record = {
              userId,
              id,
              date: m.date || "",
              peso: m.peso || "-",
              torax: m.torax || "-",
              cintura: m.cintura || "-",
              abdomen: m.abdomen || "-",
              quadril: m.quadril || "-",
              bracoD: m.bracoD || "-",
              bracoE: m.bracoE || "-",
              coxaD: m.coxaD || "-",
              coxaE: m.coxaE || "-",
              createdAt: now - i * 1000,
              updatedAt: now,
            };
            await idbPut("measures", record);
            if (userId !== "local") {
              await enqueueSyncOp(userId, "measures", id, "upsert", record);
            }
          }
        }
      }

      if (data.templates && typeof data.templates === "object") {
        for (const [exId, tpl] of Object.entries(data.templates)) {
          const record = { ...tpl, userId, exId, updatedAt: now };
          await idbPut("templates", record);
          if (userId !== "local") {
            await enqueueSyncOp(userId, "templates", exId, "upsert", record);
          }
        }
      }

      await loadUserStateFromIDB(userId);
      renderWorkoutCards();
      renderDashboard();
      if (userId !== "local") {
        await flushSyncQueue();
      }
      showToast("BACKUP RESTAURADO COM SUCESSO ✓", 2000);
    } catch {
      showToast("ARQUIVO JSON INVÁLIDO!", 1800);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

async function resetAllAppData() {
  const confirmed = confirm(
    "Deseja realmente apagar TODO o histórico de treinos, calendário, recordes, cargas salvas e medidas corporais?",
  );
  if (!confirmed) return;

  const userId = getActiveUserId();
  const now = Date.now();

  // Registra tombstones explícitos para evitar que outro dispositivo ressuscite os itens
  if (userId !== "local") {
    for (const c of stateCache.checkins) {
      await idbPut("tombstones", { userId, id: c.id, deletedAt: now });
      await enqueueSyncOp(userId, "checkins", c.id, "delete", null);
      await enqueueSyncOp(userId, "tombstones", c.id, "upsert", {
        targetId: c.id,
        deletedAt: now,
      });
    }
    for (const m of stateCache.measures) {
      await idbPut("tombstones", { userId, id: m.id, deletedAt: now });
      await enqueueSyncOp(userId, "measures", m.id, "delete", null);
      await enqueueSyncOp(userId, "tombstones", m.id, "upsert", {
        targetId: m.id,
        deletedAt: now,
      });
    }
    for (const exId of Object.keys(stateCache.templates)) {
      await enqueueSyncOp(userId, "templates", exId, "delete", null);
    }
  }

  await idbClearUserStore("checkins", userId);
  await idbClearUserStore("measures", userId);
  await idbClearUserStore("templates", userId);
  await clearSavedActiveSession();

  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(LEGACY_ACTIVE_KEY);

  await loadUserStateFromIDB(userId);
  renderWorkoutCards();
  renderDashboard();

  if (userId !== "local") {
    await flushSyncQueue();
  }
  showToast("TODOS OS DADOS FORAM LIMPOS 🗑️", 2000);
}

function showToast(msg, duration = 1600) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

window.addEventListener("online", () => {
  if (currentCloudUser) {
    flushSyncQueue();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
