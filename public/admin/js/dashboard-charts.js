const { topSongs, topSingers, topTopics, stats } = window.dashboardData;

// Top Songs Chart
new Chart(document.getElementById('topSongsChart'), {
    type: 'bar',
    data: {
        labels: topSongs.map(s => s.title),
        datasets: [{
            label: 'Views',
            data: topSongs.map(s => s.views),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});

// Top Singers Chart
new Chart(document.getElementById('topSingersChart'), {
    type: 'bar',
    data: {
        labels: topSingers.map(s => s.fullName),
        datasets: [{
            label: 'Lượt đăng ký',
            data: topSingers.map(s => s.registrationNumber),
            backgroundColor: 'rgba(255, 159, 64, 0.6)'
        }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});

// Top Topics Chart
new Chart(document.getElementById('topTopicsChart'), {
    type: 'bar',
    data: {
        labels: topTopics.map(t => t.title),
        datasets: [{
            label: 'Chủ đề',
            data: topTopics.map((_, i) => i + 1),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});

// Likes & Views Chart
new Chart(document.getElementById('likesViewsChart'), {
    type: 'bar',
    data: {
        labels: ['Likes', 'Views'],
        datasets: [{
            label: 'Tổng',
            data: [stats.totalLikes, stats.totalViews],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)']
        }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});
