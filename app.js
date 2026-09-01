
const STORAGE_KEY = "coletivo_turma24b_organization_v1";

const BUCKETS = {
  unreviewed: { label: "Não analisado", color: "#75808f" },
  act: { label: "Agir agora", color: "#c63d3d" },
  understand: { label: "Entender melhor", color: "#cb8b14" },
  monitor: { label: "Acompanhar", color: "#2c6fbb" },
  none: { label: "Sem ação por enquanto", color: "#2f7a55" },
};

let organization = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
let currentView = "cards";

const els = {
  search: document.getElementById("search"),
  sort: document.getElementById("sort"),
  attendance: document.getElementById("attendance"),
  deliveries: document.getElementById("deliveries"),
  participation: document.getElementById("participation"),
  bucket: document.getElementById("bucket"),
  container: document.getElementById("studentContainer"),
  count: document.getElementById("resultCount"),
  summary: document.getElementById("summary"),
  dialog: document.getElementById("studentDialog"),
  dialogContent: document.getElementById("dialogContent"),
};

function getBucket(id) {
  return organization[id] || "unreviewed";
}

function saveOrganization() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(organization));
}

function updateBucket(id, bucket) {
  if (bucket === "unreviewed") delete organization[id];
  else organization[id] = bucket;
  saveOrganization();
  render();
}

function matchesAttendance(value, filter) {
  if (!filter) return true;
  if (filter === "under80") return value < 80;
  if (filter === "80to89") return value >= 80 && value < 90;
  return value >= 90;
}

function matchesDeliveries(value, filter) {
  if (!filter) return true;
  if (filter === "under70") return value < 70;
  if (filter === "70to89") return value >= 70 && value < 90;
  return value >= 90;
}

function getFilteredStudents() {
  const q = els.search.value.trim().toLocaleLowerCase("pt-BR");

  let list = STUDENTS.filter((student) => {
    const haystack = [
      student.id,
      student.name,
      student.evidence,
      student.context,
      student.participation,
    ].join(" ").toLocaleLowerCase("pt-BR");

    return (
      (!q || haystack.includes(q)) &&
      matchesAttendance(student.attendance, els.attendance.value) &&
      matchesDeliveries(student.deliveries, els.deliveries.value) &&
      (!els.participation.value || student.participation === els.participation.value) &&
      (!els.bucket.value || getBucket(student.id) === els.bucket.value)
    );
  });

  const [field, direction] = els.sort.value.split("-");
  const factor = direction === "asc" ? 1 : -1;

  list.sort((a, b) => {
    let av = a[field];
    let bv = b[field];

    if (typeof av === "string") {
      return av.localeCompare(bv, "pt-BR") * factor;
    }

    return (av - bv) * factor;
  });

  return list;
}

function bucketOptions(selected) {
  return Object.entries(BUCKETS)
    .map(([value, data]) =>
      `<option value="${value}" ${selected === value ? "selected" : ""}>${data.label}</option>`
    )
    .join("");
}

function renderCards(list) {
  if (!list.length) return `<div class="empty">Nenhum estudante corresponde aos filtros atuais.</div>`;

  return `<div class="cards">${list.map(student => {
    const bucket = getBucket(student.id);
    const bucketData = BUCKETS[bucket];

    return `
      <article class="student-card" style="--bucket-color:${bucketData.color}">
        <div class="card-head">
          <div>
            <h3 class="card-title">${student.name}, ${student.age}</h3>
            <span class="student-id">${student.id}</span>
          </div>
          <span class="status-pill" style="color:${bucketData.color}">${bucketData.label}</span>
        </div>

        <div class="metrics">
          <div class="metric"><b>Frequência</b><span>${student.attendance}%</span></div>
          <div class="metric"><b>Entregas</b><span>${student.deliveries}%</span></div>
          <div class="metric"><b>Participação</b><span>${student.participation}</span></div>
        </div>

        <div class="card-label">Evidência recente</div>
        <p class="card-text">${student.evidence}</p>

        <div class="card-bottom">
          <label>
            <span class="card-label">Organização da squad</span>
            <select data-student-bucket="${student.id}">
              ${bucketOptions(bucket)}
            </select>
          </label>
          <button class="details-btn" data-details="${student.id}">Detalhes</button>
        </div>
      </article>
    `;
  }).join("")}</div>`;
}

function renderTable(list) {
  if (!list.length) return `<div class="empty">Nenhum estudante corresponde aos filtros atuais.</div>`;

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Estudante</th><th>Idade</th><th>Frequência</th><th>Entregas</th>
            <th>Participação</th><th>Evidência recente</th><th>Organização</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(student => {
            const bucket = getBucket(student.id);
            return `
              <tr>
                <td><strong>${student.id}</strong></td>
                <td><button class="details-btn" data-details="${student.id}">${student.name}</button></td>
                <td>${student.age}</td>
                <td>${student.attendance}%</td>
                <td>${student.deliveries}%</td>
                <td>${student.participation}</td>
                <td>${student.evidence}</td>
                <td><select data-student-bucket="${student.id}">${bucketOptions(bucket)}</select></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSummary() {
  const counts = Object.fromEntries(Object.keys(BUCKETS).map(k => [k, 0]));
  STUDENTS.forEach(student => counts[getBucket(student.id)]++);

  Object.keys(BUCKETS).forEach(key => {
    document.getElementById(`count-${key}`).textContent = counts[key];
  });

  const reviewed = STUDENTS.length - counts.unreviewed;
  els.summary.innerHTML = `
    <span class="summary-chip"><strong>${reviewed}</strong> analisados</span>
    <span class="summary-chip"><strong>${counts.act}</strong> agir agora</span>
    <span class="summary-chip"><strong>${counts.understand}</strong> entender melhor</span>
    <span class="summary-chip"><strong>${counts.monitor}</strong> acompanhar</span>
    <span class="summary-chip"><strong>${counts.none}</strong> sem ação</span>
  `;
}

function render() {
  const list = getFilteredStudents();
  els.count.textContent = `${list.length} ${list.length === 1 ? "resultado" : "resultados"}`;
  els.container.innerHTML = currentView === "cards" ? renderCards(list) : renderTable(list);
  renderSummary();
}

function openDetails(id) {
  const s = STUDENTS.find(student => student.id === id);
  const bucket = getBucket(id);
  const bucketData = BUCKETS[bucket];

  els.dialogContent.innerHTML = `
    <span class="student-id">${s.id}</span>
    <h2>${s.name}, ${s.age}</h2>
    <span class="status-pill" style="color:${bucketData.color}">${bucketData.label}</span>

    <div class="metrics">
      <div class="metric"><b>Frequência</b><span>${s.attendance}%</span></div>
      <div class="metric"><b>Entregas</b><span>${s.deliveries}%</span></div>
      <div class="metric"><b>Participação</b><span>${s.participation}</span></div>
    </div>

    <div class="dialog-block">
      <h3>Evidência recente</h3>
      <p>${s.evidence}</p>
    </div>

    <div class="dialog-block">
      <h3>Contexto conhecido</h3>
      <p>${s.context}</p>
    </div>

    <div class="dialog-block">
      <h3>Organização da squad</h3>
      <select id="dialogBucket">${bucketOptions(bucket)}</select>
    </div>
  `;

  const select = els.dialogContent.querySelector("#dialogBucket");
  select.addEventListener("change", () => {
    updateBucket(id, select.value);
  });

  els.dialog.showModal();
}

function exportOrganization() {
  const payload = {
    exportedAt: new Date().toISOString(),
    students: STUDENTS.map(student => ({
      id: student.id,
      name: student.name,
      organization: getBucket(student.id),
      organizationLabel: BUCKETS[getBucket(student.id)].label,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "turma24b-organizacao-squad.json";
  a.click();
  URL.revokeObjectURL(url);
}

["input", "change"].forEach(eventName => {
  [els.search, els.sort, els.attendance, els.deliveries, els.participation, els.bucket]
    .forEach(el => el.addEventListener(eventName, render));
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-student-bucket]")) {
    updateBucket(event.target.dataset.studentBucket, event.target.value);
  }
});

document.addEventListener("click", (event) => {
  const details = event.target.closest("[data-details]");
  if (details) openDetails(details.dataset.details);

  const bucketFilter = event.target.closest("[data-bucket-filter]");
  if (bucketFilter) {
    els.bucket.value = bucketFilter.dataset.bucketFilter;
    render();
  }

  const view = event.target.closest("[data-view]");
  if (view) {
    currentView = view.dataset.view;
    document.querySelectorAll("[data-view]").forEach(btn => {
      const active = btn.dataset.view === currentView;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    render();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Remover toda a organização manual feita pela squad?")) {
    organization = {};
    saveOrganization();
    render();
  }
});

document.getElementById("exportBtn").addEventListener("click", exportOrganization);

render();
