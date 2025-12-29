// playerStats.js - Player Stats tab logic

function loadPlayerStats() {
    const matchHistory = getDecryptedData();
    
    if (!matchHistory || matchHistory.length === 0) {
        displayEmptyPlayerStats();
        return;
    }

    // Compute player stats from match history
    const stats = computePlayerStats(matchHistory);

    // Update summary cards
    updateSummaryCards(stats, matchHistory);

    // Populate player cards
    populatePlayerCards(stats);
}

function computePlayerStats(matches) {
    const stats = {};

    matches.forEach(match => {
        const teamAPlayers = match.teams.A;
        const teamBPlayers = match.teams.B;
        const winner = match.winner;

        // Process Team A players
        teamAPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = {
                    matches: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0
                };
            }
            stats[player].matches++;
            if (winner === 'A') {
                stats[player].wins++;
            } else {
                stats[player].losses++;
            }
        });

        // Process Team B players
        teamBPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = {
                    matches: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0
                };
            }
            stats[player].matches++;
            if (winner === 'B') {
                stats[player].wins++;
            } else {
                stats[player].losses++;
            }
        });
    });

    // Calculate win rates
    Object.keys(stats).forEach(player => {
        const playerStats = stats[player];
        playerStats.winRate = playerStats.matches > 0 
            ? Math.round((playerStats.wins / playerStats.matches) * 100) 
            : 0;
    });

    return stats;
}

function updateSummaryCards(stats, matches) {
    const totalPlayersEl = document.getElementById('total-players');
    const totalMatchesEl = document.getElementById('total-matches');

    const totalPlayers = Object.keys(stats).length;
    const totalMatches = matches.length;

    totalPlayersEl.textContent = totalPlayers;
    totalMatchesEl.textContent = totalMatches;
}

function populatePlayerCards(stats) {
    const container = document.getElementById('player-cards-container');
    container.innerHTML = '';

    // Convert stats object to array for sorting
    const statsArray = Object.entries(stats).map(([playerName, playerStats]) => ({
        name: playerName,
        ...playerStats
    }));

    // Sort by matches played (descending), then by win rate (descending)
    statsArray.sort((a, b) => {
        if (b.matches !== a.matches) {
            return b.matches - a.matches;
        }
        return b.winRate - a.winRate;
    });

    // Create player cards
    statsArray.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';

        // Player Name
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;
        card.appendChild(name);

        // Matches
        const matches = document.createElement('div');
        matches.className = 'player-stat';
        matches.innerHTML = `<span class="player-stat-label">Matches</span><span class="player-stat-value">${player.matches}</span>`;
        card.appendChild(matches);

        // Wins
        const wins = document.createElement('div');
        wins.className = 'player-stat';
        wins.innerHTML = `<span class="player-stat-label">Wins</span><span class="player-stat-value">${player.wins}</span>`;
        card.appendChild(wins);

        // Losses
        const losses = document.createElement('div');
        losses.className = 'player-stat';
        losses.innerHTML = `<span class="player-stat-label">Losses</span><span class="player-stat-value">${player.losses}</span>`;
        card.appendChild(losses);

        // Win Rate
        const winRate = document.createElement('div');
        winRate.className = 'player-stat';
        winRate.innerHTML = `<span class="player-stat-label">Win Rate</span><span class="player-stat-value">${player.winRate}%</span>`;
        card.appendChild(winRate);

        container.appendChild(card);
    });

    // If no players found
    if (statsArray.length === 0) {
        displayEmptyPlayerStats();
    }
}

function displayEmptyPlayerStats() {
    const totalPlayersEl = document.getElementById('total-players');
    const totalMatchesEl = document.getElementById('total-matches');
    const container = document.getElementById('player-cards-container');

    totalPlayersEl.textContent = '0';
    totalMatchesEl.textContent = '0';

    container.innerHTML = '';
    const message = document.createElement('div');
    message.style.gridColumn = '1 / -1';
    message.style.textAlign = 'center';
    message.style.color = 'var(--text-secondary)';
    message.style.padding = '40px 20px';
    message.textContent = 'No player statistics available';
    container.appendChild(message);
}