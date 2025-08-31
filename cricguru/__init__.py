"""Cricguru

This package contains functions for retrieving data from the Statsguru data query on ESPN Cricinfo. The main
classes cover teams and players data. The results are returned as a Pandas dataframe in order to facilitate
data analysis on cricket data.

New Features:
- PlayerSearch: Search for cricket players by name and get their Cricinfo player IDs
- Enhanced Player class integration with search functionality

"""

from .player import Player
from .team import Team
from .scraper import Scraper

# from .player_search import PlayerSearch

__all__ = ["Player", "Team", "Scraper"]
