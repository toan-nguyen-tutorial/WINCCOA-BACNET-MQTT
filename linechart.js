
// linechart.js

// Load the Visualization API and the corechart package.
google.charts.load('current', { packages: ['corechart'] });
// Khởi tạo dữ liệu khi trang tải lần đầu
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(() => {
  console.log("Google Charts loaded successfully");
  drawChart();
  drawSecondChart();
});

let chart, data, secondChart, secondData;
const ALARM_THRESHOLD = 100; // Ngưỡng cảnh báo

function drawChart() {
  data = google.visualization.arrayToDataTable([
    ['Time', 'Temp1'],
    [new Date().toLocaleTimeString(), Math.random() * 100]
  ]);

  const options = {
    title: 'Temperature Chart',
    legend: { position: 'bottom' },
    hAxis: { title: 'Time' },
    vAxis: { title: 'Temperature', minValue: 0, maxValue: 150 }
  };

  chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
  chart.draw(data, options);

  setInterval(updateChart, 1000);
}

function updateChart() {
  const currentTime = new Date().toLocaleTimeString();
  const newValue = 101;

  if (newValue >= ALARM_THRESHOLD) {
    document.getElementById('alarm').innerHTML = `Alarm: Giá trị đã đạt ${newValue.toFixed(2)}!`;
    document.getElementById('alarm').style.color = 'red';
  } else {
    document.getElementById('alarm').innerHTML = '';
  }

  data.addRow([currentTime, newValue]);
  if (data.getNumberOfRows() > 5) data.removeRow(0);

  chart.draw(data, {
    hAxis: { title: 'Time' },
    vAxis: { title: 'Temperature', minValue: 0, maxValue: 150 },
    title: 'Temperature Chart',
    width: 700,
    height: 400
  });
}

function drawSecondChart() {
  secondData = google.visualization.arrayToDataTable([
    ['Time', 'Temp2'],
    [new Date().toLocaleTimeString(), Math.random() * 100]
  ]);

  const secondOptions = {
    title: 'Temperature Chart',
    legend: { position: 'bottom' },
    hAxis: { title: 'Time' },
    vAxis: { title: 'Humidity (%)', minValue: 0, maxValue: 100 }
  };

  secondChart = new google.visualization.LineChart(document.getElementById('second_chart'));
  secondChart.draw(secondData, secondOptions);

  setInterval(updateSecondChart, 1000);
}

function updateSecondChart() {
  const currentTime = new Date().toLocaleTimeString();
  const newHumidity = 102;
  
  secondData.addRow([currentTime, newHumidity]);
  if (secondData.getNumberOfRows() > 5) secondData.removeRow(0);

  secondChart.draw(secondData, {
    title: 'Temperature Chart',
    width: 700,
    height: 400,
    hAxis: { title: 'Time' },
    vAxis: { title: 'Temperature', minValue: 0, maxValue: 150 }
  });
}
