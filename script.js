 /* ── Floating Nav Toggle ── */
        (function() {
            const nav = document.getElementById('floatingNav');
            const toggle = document.getElementById('fnavToggle');
            const panel = document.getElementById('fnavPanel');

            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                nav.classList.toggle('expanded');
            });

            document.addEventListener('click', function(e) {
                if (!nav.contains(e.target)) {
                    nav.classList.remove('expanded');
                }
            });

            document.querySelectorAll('.fnav-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    // Only update active state for non-navigation items
                    if (item.dataset.app !== 'sentiment') {
                        document.querySelectorAll('.fnav-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                });
            });
        })();

        document.addEventListener('DOMContentLoaded', function () {
  Chart.register(ChartDataLabels);

  /* ---------------- INCIDENT DATA ---------------- */

  const incidents = [
    { id: 1, priority: "P1", location: "Bangalore", title: "Server Down" },
    { id: 2, priority: "P2", location: "Chennai", title: "DB Latency" },
    { id: 3, priority: "P3", location: "Mumbai", title: "UI Bug" },
    { id: 4, priority: "P1", location: "Hyderabad", title: "API Failure" },
    { id: 5, priority: "P4", location: "Pune", title: "Minor Delay" },
    { id: 6, priority: "P2", location: "Bangalore", title: "Cache Issue" }
  ];

  /* ---------------- COMMON LIST VIEW FUNCTION ---------------- */

  function showIncidentList(list, title, containerSelector, restoreFn) {
    const container = document.querySelector(containerSelector);

    let html = `
  <div class="incident-list">

    <div class="incident-header">
      <h3>${title}</h3>
      <button class="back-btn">← Back</button>
    </div>

    <table class="incident-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Location</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
`;


    if (list.length === 0) {
      html += `<tr><td colspan="5">No incidents found</td></tr>`;
    } else {
      list.forEach(i => {
        html += `
        <tr>
          <td>${i.id}</td>
          <td>${i.title}</td>
          <td>${i.priority}</td>
          <td>${i.location}</td>
          <td>
            <button class="view-btn" onclick="viewIncident(${i.id})">
              View Incident
            </button>
          </td>
        </tr>
      `;
      });
    }

    html += `</tbody></table></div>`;

    container.innerHTML = html;

    container.querySelector(".back-btn").onclick = restoreFn;
  }


  /* ---------------- LOCATION BUBBLE CHART ---------------- */

  const locationLabels = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai'];

  function renderLocationChart() {

  const ctx2 = document.getElementById('locationChart').getContext('2d');

 const gradient = ctx2.createLinearGradient(0, 0, 400, 0);

gradient.addColorStop(0.3, "#1E88E5");   // Soft Orange
gradient.addColorStop(0.4, "#eca961"); // Deep Orange
gradient.addColorStop(1, "#f9683c");   // Rich Blue

  // Calculate counts
  let locationData = locationLabels.map(location => ({
    location,
    count: incidents.filter(i => i.location === location).length
  }));

  // Sort descending
  locationData.sort((a, b) => b.count - a.count);

  const sortedLabels = locationData.map(l => l.location);
  const sortedCounts = locationData.map(l => l.count);

  return new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: sortedLabels,
      datasets: [{
        data: sortedCounts,
        backgroundColor: gradient,
        borderRadius: 14,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
        hoverBackgroundColor: (context) => {
  const chart = context.chart;
  const ctx = chart.ctx;
  const gradientHover = ctx.createLinearGradient(0, 0, 400, 0);
  gradientHover.addColorStop(0, "#ffc670");  // brighter orange
  gradientHover.addColorStop(1, "#FF7043");  // brighter blue
  return gradientHover;
}
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',

      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      },

      onClick: (evt, elements) => {
        if (!elements.length) return;

        const index = elements[0].index;
        const location = sortedLabels[index];

        showIncidentList(
          incidents.filter(i => i.location === location),
          `Incidents in ${location}`,
          ".chart-card .canvas-container",
          () => {
            document.querySelector(".chart-card .canvas-container").innerHTML =
              `<canvas id="locationChart"></canvas>`;
            locationChart = renderLocationChart();
          }
        );
      },

      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: "rgba(200,200,255,0.1)"
          },
          ticks: {
            
            font: { size: 12 }
          },
          title: {
            display: true,
            text: "Number of Incidents",
            font: { size: 13, weight: '600' }
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            
            font: { size: 13, weight: '600' }
          }
        }
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#dab464",
          padding: 10,
          cornerRadius: 8,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: function(context) {
              return `${context.raw} incidents`;
            }
          }
        }
      }
    }
  });
}

  let locationChart = renderLocationChart();


  /* ---------------- PRIORITY PIE CHART ---------------- */

  function renderPriorityChart() {

    const ctx3 = document.getElementById('priorityChart').getContext('2d');

    return new Chart(ctx3, {
      type: 'pie',
      data: {
        labels: ['P1', 'P2', 'P3', 'P4'],
        datasets: [{
          data: [28.4, 27.7, 34.7, 9.2],
          backgroundColor: [
            '#ff9900',
            '#FFB547',
            'rgb(115,139,216)',
            '#4318FF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: { display: false },

          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value, ctx) => {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          }
        },

        onClick: (evt, elements) => {
          if (!elements.length) return;

          const index = elements[0].index;
          const priority = ['P1', 'P2', 'P3', 'P4'][index];

          showIncidentList(
            incidents
              .filter(i => i.priority === priority)
              .sort((a, b) => a.id - b.id),
            `Incidents for ${priority}`,
            ".priority-card .donut-container",
            () => {
              document.querySelector(".priority-card .donut-container").innerHTML =
                `<canvas id="priorityChart"></canvas>`;
              priorityChart = renderPriorityChart();
            }
          );
        }
      }
    });
  }

  let priorityChart = renderPriorityChart();


  /* ---------------- PROJECT TIMELINE ---------------- */

  renderTimeline();

  function renderTimeline() {

    const container = document.getElementById('projectsTimeline');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const projects = [
      { name: 'Project A', start: 1, changes: [1, 3, 7], breach: 8 },
      { name: 'Project B', start: 0.5, changes: [0.5, 3, 6], breach: 8.5 },
      { name: 'Project C', start: 1, changes: [1, 3, 6], breach: 7.5 },
      { name: 'Project D', start: 1, changes: [1, 2.5, 5], breach: 7 },
      { name: 'Project E', start: 1, changes: [1, 4], breach: 5.5 }
    ];

    let html = '';

    projects.forEach(p => {

      const min = Math.min(p.start, ...p.changes);
      const max = p.breach;
      const getLeft = v => (v / 11) * 100;

      const lineLeft = getLeft(min);
      const lineWidth = getLeft(max) - lineLeft;

      let dots = '';
      p.changes.forEach(v => {
        dots += `<div class="timeline-dot" style="left:${getLeft(v)}%"></div>`;
      });

      const breach = `<div class="timeline-dot alert" style="left:${getLeft(p.breach)}%"></div>`;

      html += `
        <div class="timeline-row">
          <div class="timeline-label">${p.name}</div>
          <div class="timeline-track">
            <div class="timeline-line" style="left:${lineLeft}%;width:${lineWidth}%"></div>
            ${dots}
            ${breach}
          </div>
        </div>
      `;
    });

    let axis = '<div class="timeline-axis">';
    months.forEach(m => axis += `<span>${m}</span>`);
    axis += '</div>';

    container.innerHTML = html + axis;
  }


  /* ---------------- SLA PROGRESS CIRCLE ---------------- */

  const canvas = document.getElementById("slaProgress");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    const percent = 96;
    const radius = 70;
    const center = 80;

    ctx.lineWidth = 12;

    ctx.strokeStyle = "#eee";
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#4c6ef5";
    ctx.beginPath();
    ctx.arc(center, center, radius, -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2 * percent) / 100);
    ctx.stroke();

    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(percent + "%", center, center);
  }

});
function viewIncident(id) {
  const incident = incidents.find(i => i.id === id);

  alert(
    `Incident Details

ID: ${incident.id}
Title: ${incident.title}
Priority: ${incident.priority}
Location: ${incident.location}`
  );
}
function openAgentsPage() {
  window.location.href = "agent.html";
}


