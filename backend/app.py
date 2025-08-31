#!/usr/bin/env python3
"""
Cricket Dashboard Backend API
Flask server for cricket statistics data processing and API endpoints
"""

from pdb import main
import sys
import os

# Add the parent directory to the path so we can import cricguru as a package
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import pandas as pd
from cricguru.player import Player
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests


def safe_convert(value, convert_type=int, default=0):
    """Safely convert values handling various data types"""
    try:
        if pd.isna(value) or value == "" or value == "-":
            return default
        if convert_type == int:
            return int(float(str(value).replace("*", "").replace("+", "")))
        elif convert_type == float:
            return float(str(value).replace("*", "").replace("+", ""))
        else:
            return str(value)
    except:
        return default


def extract_player_data(player_id):
    """Extract cricket data for a player and return as JSON"""
    try:
        player = Player(player_id)

        formats_data = {}
        player_info = {"player_id": player_id, "status": "success"}

        # Format configurations
        formats = {
            "test": {"class": "1", "name": "Test Cricket"},
            "odi": {"class": "2", "name": "ODI Cricket"},
            "t20": {"class": "3", "name": "T20I Cricket"},
        }

        for format_key, format_info in formats.items():
            try:
                # Get career summary data
                career_data = player.career_summary(
                    query_params={"class": format_info["class"], "type": "allround"}
                )

                if career_data is not None and not career_data.empty:
                    format_data = process_format_data(career_data)
                    formats_data[format_key] = format_data
                    print(f"✓ {format_info['name']}: {len(career_data)} records")
                else:
                    formats_data[format_key] = create_empty_format_data()
                    print(f"✗ No data for {format_info['name']}")

            except Exception as e:
                print(f"✗ Error in {format_info['name']}: {str(e)}")
                formats_data[format_key] = create_empty_format_data()

        player_info["formats"] = formats_data
        return player_info

    except Exception as e:
        return {
            "player_id": player_id,
            "status": "error",
            "message": str(e),
            "formats": {},
        }


def process_format_data(df):
    """Process cricket dataframe for dashboard"""

    # Calculate totals
    total_matches = 0
    total_runs = 0
    highest_score = 0
    total_centuries = 0
    total_catches = 0
    total_wickets = 0

    # Process team-wise data
    teams = []

    for _, row in df.iterrows():
        grouping = str(row.get("Grouping", "")).strip()

        # Skip empty or summary rows
        if grouping in ["", "Career", "Overall", "Total"] or pd.isna(grouping):
            continue

        matches = safe_convert(row.get("Mat", 0))
        runs = safe_convert(row.get("Runs", 0))
        hs = safe_convert(row.get("HS", 0))
        avg = safe_convert(row.get("Bat Av", 0), float)
        centuries = safe_convert(row.get("100", 0))
        catches = safe_convert(row.get("Ct", 0))
        wickets = safe_convert(row.get("Wkts", 0))
        bowl_avg = safe_convert(row.get("Bowl Av", 0), float)

        # Add to totals
        total_matches += matches
        total_runs += runs
        total_centuries += centuries
        total_catches += catches
        total_wickets += wickets
        if hs > highest_score:
            highest_score = hs

        # Create team data
        team_data = {
            "team": grouping,
            "matches": matches,
            "runs": runs,
            "batting_average": avg,
            "highest_score": hs,
            "centuries": centuries,
            "wickets": wickets,
            "bowling_average": bowl_avg,
            "catches": catches,
        }
        teams.append(team_data)

    # Calculate overall batting average
    batting_average = round(total_runs / total_matches, 2) if total_matches > 0 else 0

    # Sort teams by runs and limit to top performers
    teams = sorted(teams, key=lambda x: x["runs"], reverse=True)[:10]

    overview = {
        "total_matches": total_matches,
        "total_runs": total_runs,
        "highest_score": highest_score,
        "batting_average": batting_average,
        "centuries": total_centuries,
        "catches": total_catches,
        "wickets": total_wickets,
    }

    return {"overview": overview, "teams": teams}


def create_empty_format_data():
    """Create empty data structure for formats with no data"""
    return {
        "overview": {
            "total_matches": 0,
            "total_runs": 0,
            "highest_score": 0,
            "batting_average": 0,
            "centuries": 0,
            "catches": 0,
            "wickets": 0,
        },
        "teams": [],
    }


# API Routes
@app.route("/api/player/<int:player_id>")
def get_player_data(player_id):
    """API endpoint to get player data as JSON"""
    try:
        data = extract_player_data(player_id)
        return jsonify(data)
    except Exception as e:
        return (
            jsonify(
                {
                    "player_id": player_id,
                    "status": "error",
                    "message": str(e),
                    "formats": {},
                }
            ),
            500,
        )


@app.route("/api/health")
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "cricket-dashboard-api"})


# Serve frontend files (for development)
@app.route("/")
def serve_frontend():
    """Serve the frontend index.html"""
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    return send_from_directory(frontend_path, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Serve static frontend files"""
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    return send_from_directory(frontend_path, filename)


if __name__ == "__main__":
    print("🏏 Cricket Dashboard Backend API")
    print("=" * 50)
    print("📊 API Server starting at: http://localhost:5000")
    print("🔍 Cricket statistics data processing service")
    print("\nAPI Endpoints:")
    print("  • GET  /api/health         - Health check")
    print("  • GET  /api/player/{id}    - Get player statistics")
    print("\nExample Player IDs:")
    print("  • 253802 - Virat Kohli")
    print("  • 28081  - MS Dhoni")
    print("  • 35320  - Rohit Sharma")
    print("  • 290630 - Babar Azam")
    print("\n" + "=" * 50)

    app.run(debug=True, host="0.0.0.0", port=5000)
