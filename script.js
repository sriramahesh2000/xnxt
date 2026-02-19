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

    return new Chart(ctx2, {
      type: 'bubble',
      data: {
        datasets: [{
          data: [
            { x: 1, y: 45, r: 15 },
            { x: 2, y: 30, r: 10 },
            { x: 3, y: 25, r: 12 },
            { x: 4, y: 15, r: 8 },
            { x: 5, y: 20, r: 10 }
          ],
          backgroundColor: '#4318FF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        onClick: (evt, elements) => {
          if (!elements.length) return;

          const index = elements[0].index;
          const location = locationLabels[index];

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
            type: 'linear',
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              callback: v => locationLabels[v - 1] || ''
            },
            grid: { display: false }
          },
          y: {
            min: 10,
            max: 50,
            title: {
              display: true,
              text: 'Number of Incidents'
            }
          }
        },
        plugins: { legend: { display: false } }
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
        const priority = ['P1','P2','P3','P4'][index];

        showIncidentList(
          incidents
            .filter(i => i.priority === priority)
            .sort((a,b)=> a.id - b.id),
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
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const projects = [
      { name:'Project A', start:1, changes:[1,3,7], breach:8 },
      { name:'Project B', start:0.5, changes:[0.5,3,6], breach:8.5 },
      { name:'Project C', start:1, changes:[1,3,6], breach:7.5 },
      { name:'Project D', start:1, changes:[1,2.5,5], breach:7 },
      { name:'Project E', start:1, changes:[1,4], breach:5.5 }
    ];

    let html='';

    projects.forEach(p=>{

      const min=Math.min(p.start,...p.changes);
      const max=p.breach;
      const getLeft=v=>(v/11)*100;

      const lineLeft=getLeft(min);
      const lineWidth=getLeft(max)-lineLeft;

      let dots='';
      p.changes.forEach(v=>{
        dots+=`<div class="timeline-dot" style="left:${getLeft(v)}%"></div>`;
      });

      const breach=`<div class="timeline-dot alert" style="left:${getLeft(p.breach)}%"></div>`;

      html+=`
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

    let axis='<div class="timeline-axis">';
    months.forEach(m=>axis+=`<span>${m}</span>`);
    axis+='</div>';

    container.innerHTML=html+axis;
  }


  /* ---------------- SLA PROGRESS CIRCLE ---------------- */

  const canvas = document.getElementById("slaProgress");
  if(canvas){
    const ctx = canvas.getContext("2d");

    const percent = 96;
    const radius = 70;
    const center = 80;

    ctx.lineWidth = 12;

    ctx.strokeStyle = "#eee";
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI*2);
    ctx.stroke();

    ctx.strokeStyle = "#4c6ef5";
    ctx.beginPath();
    ctx.arc(center, center, radius, -Math.PI/2,
      -Math.PI/2 + (Math.PI*2*percent)/100);
    ctx.stroke();

    ctx.font="24px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(percent+"%",center,center);
  }

});
function viewIncident(id){
  const incident = incidents.find(i=>i.id===id);

  alert(
`Incident Details

ID: ${incident.id}
Title: ${incident.title}
Priority: ${incident.priority}
Location: ${incident.location}`
  );
}
function openAgentsPage(){
   window.location.href = "agent.html";
}


const rcDataStore = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    total: [12, 18, 9, 14, 20, 16],
    breached: [3, 5, 2, 4, 6, 5]
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    total: [5, 7, 3, 6, 8, 4, 5],
    breached: [1, 2, 0, 2, 3, 1, 1]
  }
};

const rcCtx = document.getElementById('rc-incidentChart').getContext('2d');

let rcCurrentView = 'monthly';

function rcBuildChart(view) {
  const total = rcDataStore[view].total;
  const breached = rcDataStore[view].breached;
  const nonBreached = total.map((t, i) => t - breached[i]);

  return {
    labels: rcDataStore[view].labels,
    datasets: [
      {
        label: 'Non-Breached Incidents',
        data: nonBreached,
        backgroundColor: '#3b82f6',
        stack: 'combined',
        borderRadius: { bottomLeft: 6, bottomRight: 6 }
      },
      {
        label: 'Breached Incidents',
        data: breached,
        backgroundColor: '#ef4444',
        stack: 'combined',
        borderRadius: { topLeft: 6, topRight: 6 }
      }
    ]
  };
}

const rcChart = new Chart(rcCtx, {
  type: 'bar',
  data: rcBuildChart(rcCurrentView),
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const total = rcDataStore[rcCurrentView].total[index];
            const breached = rcDataStore[rcCurrentView].breached[index];
            const nonBreached = total - breached;

            return [
              'Total Incidents: ' + total,
              'Breached: ' + breached,
              'Non-Breached: ' + nonBreached
            ];
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Incidents'
        },
        grid: {
          color: '#e2e8f0'
        }
      }
    }
  }
});


// Controller
document.getElementById('rc-viewSelector').addEventListener('change', function () {
  rcCurrentView = this.value;
  rcChart.data = rcBuildChart(rcCurrentView);
  rcChart.update();
});

