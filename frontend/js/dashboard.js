// Cricket Dashboard Frontend JavaScript
// Main application logic and API communication

// Configuration
const API_BASE_URL = "http://localhost:5000/api";

// Global State
let currentFormat = "test";
let playerData = {};
let charts = {};
let dataTable = null;

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	initializeEventListeners();
	console.log("Cricket Dashboard initialized");
});

// Event Listeners Setup
function initializeEventListeners() {
	// Enter key support for search input
	const playerInput = document.getElementById("playerIdInput");
	playerInput.addEventListener("keypress", function (e) {
		if (e.key === "Enter") {
			searchPlayer();
		}
	});

	// Input validation
	playerInput.addEventListener("input", function (e) {
		const value = e.target.value;
		if (value && (value < 1 || value > 999999)) {
			e.target.setCustomValidity(
				"Player ID must be between 1 and 999999"
			);
		} else {
			e.target.setCustomValidity("");
		}
	});
}

// Example player loading
function loadExample(playerId) {
	document.getElementById("playerIdInput").value = playerId;
	searchPlayer();
}

// Main search function
async function searchPlayer() {
	const playerIdInput = document.getElementById("playerIdInput");
	const playerId = playerIdInput.value.trim();

	// Validation
	if (!playerId) {
		showError("Please enter a player ID");
		playerIdInput.focus();
		return;
	}

	if (playerId < 1 || playerId > 999999) {
		showError("Player ID must be between 1 and 999999");
		playerIdInput.focus();
		return;
	}

	showLoading();

	try {
		const response = await fetch(`${API_BASE_URL}/player/${playerId}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		hideLoading();

		if (data.status === "error") {
			showError(data.message || "Error loading player data");
			return;
		}

		playerData = data;
		displayPlayerData();
	} catch (error) {
		hideLoading();
		console.error("Search error:", error);

		if (error.name === "TypeError" && error.message.includes("fetch")) {
			showError(
				"Cannot connect to server. Please ensure the backend is running."
			);
		} else {
			showError(`Network error: ${error.message}`);
		}
	}
}

// UI State Management
function showLoading() {
	document.getElementById("loading").style.display = "block";
	document.getElementById("error").style.display = "none";
	document.getElementById("dashboardContent").style.display = "none";
}

function hideLoading() {
	document.getElementById("loading").style.display = "none";
}

function showError(message) {
	document.getElementById("errorMessage").textContent = message;
	document.getElementById("error").style.display = "block";
	document.getElementById("dashboardContent").style.display = "none";
}

function hideError() {
	document.getElementById("error").style.display = "none";
}

// Display player data
function displayPlayerData() {
	try {
		// Update player info
		document.getElementById("playerId").textContent = playerData.player_id;
		document.getElementById("playerInfo").style.display = "block";
		document.getElementById("dashboardContent").style.display = "block";
		hideError();

		// Load initial format data
		loadFormatData("test");
		createCharts();
		initializeDataTable();

		// Smooth scroll to results
		document.getElementById("dashboardContent").scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	} catch (error) {
		console.error("Display error:", error);
		showError("Error displaying player data");
	}
}

// Format switching
function switchFormat(format) {
	currentFormat = format;

	// Update tab buttons
	document.querySelectorAll(".tab-button").forEach((tab) => {
		tab.classList.remove("active");
	});
	document.getElementById(format + "Tab").classList.add("active");

	// Load data for selected format
	loadFormatData(format);
	updateCharts();
}

// Load data for specific format
function loadFormatData(format) {
	const data = playerData.formats[format];
	if (!data) {
		console.warn(`No data available for format: ${format}`);
		return;
	}

	const overview = data.overview;

	// Update statistics cards with animations
	updateStatCard("totalMatches", overview.total_matches);
	updateStatCard("totalRuns", overview.total_runs);
	updateStatCard("highestScore", overview.highest_score);
	updateStatCard("battingAverage", overview.batting_average);
	updateStatCard("centuries", overview.centuries);
	updateStatCard("catches", overview.catches);
	updateStatCard("wickets", overview.wickets);

	// Update data table
	updateDataTable(data.teams);
}

// Animated stat card update
function updateStatCard(elementId, value) {
	const element = document.getElementById(elementId);
	const formattedValue =
		typeof value === "number" && value > 999
			? value.toLocaleString()
			: value;

	// Add animation class
	element.style.transform = "scale(1.1)";
	element.style.transition = "transform 0.3s ease";

	setTimeout(() => {
		element.textContent = formattedValue;
		element.style.transform = "scale(1)";
	}, 150);
}

// Chart Management
function createCharts() {
	try {
		createTeamsChart();
		createRunsChart();
		createAverageChart();
		createCenturiesChart();
	} catch (error) {
		console.error("Chart creation error:", error);
	}
}

function updateCharts() {
	// Destroy existing charts
	Object.values(charts).forEach((chart) => {
		if (chart) chart.destroy();
	});
	charts = {};

	// Create new charts
	createCharts();
}

// Individual Chart Creation Functions
function createTeamsChart() {
	const ctx = document.getElementById("teamsChart");
	if (!ctx) return;

	const data = playerData.formats[currentFormat]?.teams || [];

	charts.teams = new Chart(ctx, {
		type: "bar",
		data: {
			labels: data.map((team) => team.team),
			datasets: [
				{
					label: "Runs",
					data: data.map((team) => team.runs),
					backgroundColor: "rgba(102, 126, 234, 0.8)",
					borderColor: "rgba(102, 126, 234, 1)",
					borderWidth: 2,
					borderRadius: 5,
					borderSkipped: false,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: 2,
			layout: {
				padding: 10,
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					titleColor: "#fff",
					bodyColor: "#fff",
					borderColor: "rgba(102, 126, 234, 1)",
					borderWidth: 1,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: { color: "rgba(0, 0, 0, 0.05)" },
					ticks: {
						color: "#666",
						maxTicksLimit: 8,
					},
				},
				x: {
					ticks: {
						maxRotation: 45,
						color: "#666",
					},
					grid: { display: false },
				},
			},
			animation: {
				duration: 1000,
				easing: "easeOutQuart",
			},
		},
	});
}

function createRunsChart() {
	const ctx = document.getElementById("runsChart");
	if (!ctx) return;

	const data = playerData.formats[currentFormat]?.teams || [];

	charts.runs = new Chart(ctx, {
		type: "doughnut",
		data: {
			labels: data.map((team) => team.team),
			datasets: [
				{
					data: data.map((team) => team.runs),
					backgroundColor: [
						"rgba(255, 99, 132, 0.8)",
						"rgba(54, 162, 235, 0.8)",
						"rgba(255, 205, 86, 0.8)",
						"rgba(75, 192, 192, 0.8)",
						"rgba(153, 102, 255, 0.8)",
						"rgba(255, 159, 64, 0.8)",
						"rgba(201, 203, 207, 0.8)",
						"rgba(255, 99, 132, 0.6)",
						"rgba(54, 162, 235, 0.6)",
						"rgba(255, 205, 86, 0.6)",
					],
					borderWidth: 2,
					borderColor: "#fff",
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: 1.2,
			layout: {
				padding: 10,
			},
			plugins: {
				legend: {
					position: "bottom",
					labels: {
						padding: 20,
						usePointStyle: true,
						font: { size: 12 },
					},
				},
				tooltip: {
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					titleColor: "#fff",
					bodyColor: "#fff",
				},
			},
			animation: {
				duration: 1500,
				easing: "easeOutQuart",
			},
		},
	});
}

function createAverageChart() {
	const ctx = document.getElementById("averageChart");
	if (!ctx) return;

	const data = playerData.formats[currentFormat]?.teams || [];

	charts.average = new Chart(ctx, {
		type: "line",
		data: {
			labels: data.map((team) => team.team),
			datasets: [
				{
					label: "Batting Average",
					data: data.map((team) => team.batting_average),
					borderColor: "rgba(118, 75, 162, 1)",
					backgroundColor: "rgba(118, 75, 162, 0.1)",
					borderWidth: 3,
					fill: true,
					tension: 0.4,
					pointBackgroundColor: "rgba(118, 75, 162, 1)",
					pointBorderColor: "#fff",
					pointBorderWidth: 2,
					pointRadius: 6,
					pointHoverRadius: 8,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: 2,
			layout: {
				padding: 10,
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					titleColor: "#fff",
					bodyColor: "#fff",
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: { color: "rgba(0, 0, 0, 0.05)" },
					ticks: {
						color: "#666",
						maxTicksLimit: 8,
					},
				},
				x: {
					ticks: {
						maxRotation: 45,
						color: "#666",
					},
					grid: { display: false },
				},
			},
			animation: {
				duration: 1200,
				easing: "easeOutQuart",
			},
		},
	});
}

function createCenturiesChart() {
	const ctx = document.getElementById("centuriesChart");
	if (!ctx) return;

	const data = playerData.formats[currentFormat]?.teams || [];

	charts.centuries = new Chart(ctx, {
		type: "bar",
		data: {
			labels: data.map((team) => team.team),
			datasets: [
				{
					label: "Centuries",
					data: data.map((team) => team.centuries),
					backgroundColor: "rgba(255, 193, 7, 0.8)",
					borderColor: "rgba(255, 193, 7, 1)",
					borderWidth: 2,
					borderRadius: 5,
					borderSkipped: false,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: 2,
			layout: {
				padding: 10,
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					titleColor: "#fff",
					bodyColor: "#fff",
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						stepSize: 1,
						color: "#666",
					},
					grid: { color: "rgba(0, 0, 0, 0.05)" },
				},
				x: {
					ticks: {
						maxRotation: 45,
						color: "#666",
					},
					grid: { display: false },
				},
			},
			animation: {
				duration: 1000,
				easing: "easeOutQuart",
			},
		},
	});
}

// Data Table Management
function initializeDataTable() {
	if (dataTable) {
		dataTable.destroy();
	}

	dataTable = $("#statsTable").DataTable({
		responsive: true,
		pageLength: 10,
		order: [[2, "desc"]], // Sort by runs descending
		dom: '<"top"f>rt<"bottom"lp>',
		language: {
			search: "Search teams:",
			lengthMenu: "Show _MENU_ teams per page",
			info: "Showing _START_ to _END_ of _TOTAL_ teams",
			emptyTable: "No team statistics available",
		},
		columnDefs: [
			{ targets: [1, 2, 3, 4, 5, 6, 7, 8], className: "text-center" },
		],
	});
}

function updateDataTable(teams) {
	if (!teams || teams.length === 0) {
		console.warn("No team data to display");
		return;
	}

	const tableBody = document.getElementById("tableBody");
	tableBody.innerHTML = teams
		.map(
			(team) => `
        <tr>
            <td><strong>${team.team}</strong></td>
            <td>${team.matches}</td>
            <td>${team.runs.toLocaleString()}</td>
            <td>${team.batting_average}</td>
            <td>${team.highest_score}</td>
            <td>${team.centuries}</td>
            <td>${team.wickets}</td>
            <td>${team.bowling_average || "-"}</td>
            <td>${team.catches}</td>
        </tr>
    `
		)
		.join("");

	// Update DataTable
	if (dataTable) {
		dataTable.clear();
		dataTable.rows.add($(tableBody).find("tr"));
		dataTable.draw();
	}
}

// Utility Functions
function formatNumber(num) {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
}

// Error handling for charts
Chart.defaults.plugins.tooltip.filter = function (tooltipItem) {
	return !isNaN(tooltipItem.parsed.y);
};

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		searchPlayer,
		loadExample,
		switchFormat,
		formatNumber,
	};
}
