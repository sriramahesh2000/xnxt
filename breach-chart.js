document.addEventListener("DOMContentLoaded", ()=>{

const ctx = document.getElementById('breachChart');

new Chart(ctx, {
  type: 'bar',

  data: {
    labels: ['July','August','September','October','November','December'],

    datasets: [

      {
        label: 'Incidents',
        data: [90,40,55,70,50,95],
        backgroundColor: '#4fa3ff',
        borderRadius: 6
      },

      {
        label: 'Breach Trend',
        data: [35,45,65,70,75,95],
        type: 'line',
        borderColor: '#c0392b',
        backgroundColor:'#c0392b',
        tension:0.3,
        pointRadius:6,
        pointBackgroundColor:'#fff',
        pointBorderColor:'#c0392b',
        pointBorderWidth:3
      }

    ]
  },

  options: {
    responsive:true,
    maintainAspectRatio:false,

    plugins:{
      legend:{display:false}
    },

    scales:{
      y:{
        beginAtZero:true
      }
    }
  }

});

});
