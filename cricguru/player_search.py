"""
Player Search Module for Cricguru

This module provides functionality to search for cricket players by name
and returns their Cricinfo player IDs and basic information.
"""

import requests
from bs4 import BeautifulSoup
import json
import re


def search_espncricinfo_players(player_name, max_results=10):
    """
    Search for cricket players on ESPN Cricinfo by name.

    Parameters
    ----------
    player_name : str
        The name of the player to search for
    max_results : int, optional
        Maximum number of results to return (default is 10)

    Returns
    -------
    list
        List of dictionaries containing player details:
        player_id, name, country, role, and cricinfo URL
    """
    from urllib.parse import quote

    print(f"🔍 Searching for: {player_name}")

    # ESPN Cricinfo's player search is best accessed via this endpoint:
    search_url = f"https://search.espncricinfo.com/ci/content/player/search.html?search={quote(player_name)};type=player"
    print(f"📡 URL: {search_url}")

    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(search_url, headers=headers)
    print(f"📊 Response status: {response.status_code}")

    if response.status_code != 200:
        print("❌ Failed to get response")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    print(f"📄 Page title: {soup.title.string if soup.title else 'No title'}")
    print(f"📝 Page length: {len(response.text)} characters")

    results = []

    # Player links are typically in <a> tags with href containing '/ci/content/player/'
    print("🔗 Looking for player links...")
    all_links = soup.find_all("a", href=True)
    print(f"🔗 Found {len(all_links)} total links")
    
    # Let's see what kinds of links we have
    print("📋 Sample links found:")
    for i, a in enumerate(all_links[:10]):  # Show first 10 links
        href = a["href"]
        text = a.get_text(strip=True)
        print(f"  {i+1}. {href} -> '{text}'")
    
    # Look for any links that might be player-related
    player_patterns = [
        "/ci/content/player/",
        "/cricketers/",
        "/player/",
        "cricketers"
    ]
    
    print(f"\n� Checking for player patterns: {player_patterns}")
    potential_players = []
    
    for pattern in player_patterns:
        matching_links = []
        for a in all_links:
            href = a["href"]
            if pattern in href:
                matching_links.append((href, a.get_text(strip=True)))
        
        print(f"Pattern '{pattern}': {len(matching_links)} matches")
        if matching_links:
            print("  Examples:")
            for href, text in matching_links[:3]:
                print(f"    {href} -> '{text}'")
            potential_players.extend(matching_links[:5])  # Take first 5 from each pattern
    
    print(f"\n👤 Total potential players found: {len(potential_players)}")
    
    results = []
    
    for href, name in potential_players:
        # Try different ID extraction patterns
        player_id = None
        
        # Pattern 1: /player/123.html
        match = re.search(r"/player/(\d+)\.html", href)
        if match:
            player_id = match.group(1)
        
        # Pattern 2: /cricketers/name-123
        if not player_id:
            match = re.search(r"/cricketers/[^/]+-(\d+)", href)
            if match:
                player_id = match.group(1)
        
        # Pattern 3: Any number at the end
        if not player_id:
            match = re.search(r"-(\d+)$", href)
            if match:
                player_id = match.group(1)
        
        if player_id and name:
            print(f"✅ Found player: {name} (ID: {player_id})")
            
            url = (
                f"https://www.espncricinfo.com{href}"
                if href.startswith("/")
                else href
            )
            
            results.append(
                {
                    "player_id": player_id,
                    "name": name,
                    "country": "",
                    "role": "",
                    "url": url,
                }
            )
            
            if len(results) >= max_results:
                break
    
    print(f"🎯 Final results: {len(results)} players found")
    return results



for i in search_espncricinfo_players("Kohli"):
    print(i)


# class PlayerSearch:
#     """
#     A class to search for cricket players by name and return their details.

#     This class provides methods to search for cricket players using various
#     approaches and returns player information including their Cricinfo player ID
#     which can then be used with the existing Player class.

#     Attributes
#     ----------
#     known_players_db : dict
#         A database of well-known cricket players with their details

#     Methods
#     -------
#     search_players(player_name)
#         Search for players by name and return matching results
#     search_players_comprehensive(player_name)
#         Comprehensive search using multiple methods
#     get_player_suggestions(partial_name)
#         Get player name suggestions for partial matches
#     """

#     def __init__(self):
#         """Initialize the PlayerSearch with a database of known players"""
#         self.known_players_db = {}

#     def search_players(self, player_name):
#         """
#         Search for players by name using the known players database.

#         Parameters
#         ----------
#         player_name : str
#             The name of the player to search for

#         Returns
#         -------
#         list
#             List of dictionaries containing player details including
#             player_id, name, country, role, and cricinfo URL

#         Examples
#         --------
#         >>> search = PlayerSearch()
#         >>> results = search.search_players("Kohli")
#         >>> print(results[0]['name'])
#         'Virat Kohli'
#         >>> print(results[0]['player_id'])
#         '253802'
#         """
#         return self._search_known_players(player_name)

#     def search_players_comprehensive(self, player_name):
#         """
#         A comprehensive search that uses multiple methods to find players.

#         Parameters
#         ----------
#         player_name : str
#             The name of the player to search for

#         Returns
#         -------
#         list
#             List of dictionaries containing player details
#         """
#         all_results = []

#         # Method 1: Known players lookup
#         known_results = self._search_known_players(player_name)
#         all_results.extend(known_results)

#         # Remove duplicates based on player_id
#         unique_results = []
#         seen_ids = set()

#         for result in all_results:
#             if result["player_id"] and result["player_id"] not in seen_ids:
#                 unique_results.append(result)
#                 seen_ids.add(result["player_id"])

#         return unique_results

#     def get_player_suggestions(self, partial_name, max_suggestions=10):
#         """
#         Get player name suggestions for partial matches.

#         Parameters
#         ----------
#         partial_name : str
#             Partial player name to search for
#         max_suggestions : int, optional
#             Maximum number of suggestions to return (default is 10)

#         Returns
#         -------
#         list
#             List of suggested player names
#         """
#         suggestions = []
#         search_name = partial_name.lower().strip()

#         for name, data in self.known_players_db.items():
#             if search_name in name:
#                 suggestions.append(data["name"])
#                 if len(suggestions) >= max_suggestions:
#                     break

#         return suggestions
