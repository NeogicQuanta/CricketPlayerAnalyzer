# Cricket Dashboard Project

A modern, responsive web application for visualizing cricket player statistics with interactive charts and comprehensive data analysis.

## 🏗️ Project Structure

```
Project/
├── cricguru/                     # Core cricket data module
│   ├── __init__.py
│   ├── player.py                 # Player statistics extraction
│   ├── player_search.py          # Player search functionality
│   ├── scraper.py                # Web scraping utilities
│   ├── team.py                   # Team-related functions
│   ├── app.py                    # Standalone Flask app (optional)
│   ├── README.md                 # Module documentation
│   └── LICENSE.md                # License information
│
├── backend/                      # Flask API server
│   ├── app.py                    # Main Flask application
│   └── requirements.txt          # Python dependencies
│
└── frontend/                     # Web interface
    ├── index.html                # Main HTML page
    ├── css/
    │   └── dashboard.css          # Styling and responsive design
    └── js/
        └── dashboard.js           # Frontend logic and API communication
```

## 🚀 Features

### Frontend (HTML/CSS/JavaScript)

-   **Responsive Design**: Works on desktop, tablet, and mobile devices
-   **Interactive Charts**: Bar charts, doughnut charts, line graphs using Chart.js
-   **Real-time Search**: Dynamic player lookup with live API calls
-   **Format Switching**: Toggle between Test, ODI, and T20I statistics
-   **Data Tables**: Sortable, searchable team-wise statistics
-   **Modern UI**: Gradient backgrounds, animations, and smooth transitions

### Backend (Python/Flask)

-   **REST API**: Clean JSON endpoints for data retrieval
-   **Data Processing**: Statistical calculations and data aggregation
-   **Error Handling**: Comprehensive error responses and validation
-   **CORS Support**: Cross-origin resource sharing for frontend integration
-   **Cricket Module Integration**: Uses cricguru package for ESPN Cricinfo data

### Core Module (cricguru)

-   **Web Scraping**: Extracts data from ESPN Cricinfo
-   **Player Statistics**: Comprehensive batting, bowling, and fielding stats
-   **Multi-format Support**: Test, ODI, and T20I cricket data
-   **Data Validation**: Safe data conversion and error handling

## 📊 API Endpoints

### Backend Server (Port 5000)

| Endpoint           | Method | Description                |
| ------------------ | ------ | -------------------------- |
| `/api/health`      | GET    | Health check               |
| `/api/player/{id}` | GET    | Get player statistics      |
| `/`                | GET    | Serve frontend application |

### Example API Response

```json
{
	"player_id": 253802,
	"status": "success",
	"formats": {
		"test": {
			"overview": {
				"total_matches": 113,
				"total_runs": 8848,
				"highest_score": 254,
				"batting_average": 49.15,
				"centuries": 29,
				"catches": 130,
				"wickets": 8
			},
			"teams": [
				{
					"team": "Australia",
					"matches": 30,
					"runs": 2232,
					"batting_average": 43.76,
					"centuries": 8,
					"wickets": 2,
					"catches": 28
				}
			]
		}
	}
}
```

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Frontend Access

-   Open `frontend/index.html` in a web browser
-   Or access via backend server at `http://localhost:5000`

### 3. Example Player IDs

-   **253802** - Virat Kohli
-   **28081** - MS Dhoni
-   **35320** - Rohit Sharma
-   **290630** - Babar Azam

## 🎯 Usage

1. **Start Backend**: Run the Flask server
2. **Open Frontend**: Access the web interface
3. **Search Player**: Enter a player ID and click search
4. **Explore Data**: Switch between formats and view charts
5. **Analyze Statistics**: Use interactive tables and visualizations

## 🔧 Technology Stack

### Frontend

-   **HTML5**: Semantic markup and structure
-   **CSS3**: Modern styling with flexbox and grid
-   **JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
-   **Chart.js**: Interactive data visualizations
-   **DataTables**: Enhanced table functionality

### Backend

-   **Python 3.8+**: Core programming language
-   **Flask**: Web framework and API server
-   **Flask-CORS**: Cross-origin resource sharing
-   **Pandas**: Data manipulation and analysis
-   **BeautifulSoup4**: HTML parsing for web scraping

### Data Source

-   **ESPN Cricinfo**: Official cricket statistics database
-   **cricguru Package**: Custom scraping and data extraction

## 📱 Responsive Design

The application is fully responsive and optimized for:

-   **Desktop**: Full-featured dashboard with multiple charts
-   **Tablet**: Responsive grid layout with touch-friendly controls
-   **Mobile**: Stacked layout with simplified navigation

## 🎨 UI/UX Features

-   **Loading States**: Animated spinners during data fetch
-   **Error Handling**: User-friendly error messages
-   **Smooth Animations**: CSS transitions and Chart.js animations
-   **Interactive Elements**: Hover effects and click feedback
-   **Accessibility**: Keyboard navigation and screen reader support

## 🔮 Future Enhancements

-   Player name lookup and autocomplete
-   Historical performance trends
-   Team comparison features
-   Match-by-match statistics
-   Export functionality for data
-   Real-time score updates
-   Social sharing capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:

-   Check the documentation
-   Review API response formats
-   Ensure backend server is running
-   Verify player IDs are valid ESPN Cricinfo IDs
