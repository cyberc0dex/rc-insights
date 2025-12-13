// matchHistory.js - Match History tab logic (read-only for system-insights)

function loadMatchHistory() {
    populateDateDropdown();
    
    // Setup date filter event listener
    const dateFilter = document.getElementById('date-filter');
    dateFilter.addEventListener('change', filterMatchesByDate);
    
    // Auto-select the latest date and display matches
    const dates = getMatchDates();
    if (dates.length > 0) {
        dateFilter.value = dates[0]; // dates[0] is the newest date (already sorted)
        filterMatchesByDate(); // Trigger filter to display matches
    }
}

function populateDateDropdown() {
    const dateFilter = document.getElementById('date-filter');
    const dates = getMatchDates();

    // Clear existing options except the default
    dateFilter.innerHTML = '<option value="">-- Select a date --</option>';

    // Add date options (already sorted newest to oldest from storage)
    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDate(date);
        dateFilter.appendChild(option);
    });
}

function filterMatchesByDate() {
    const dateFilter = document.getElementById('date-filter');
    const selectedDate = dateFilter.value;
    const tableBody = document.getElementById('match-table-body');

    // Clear table
    tableBody.innerHTML = '';

    if (!selectedDate) {
        // No date selected, show empty table
        clearScoreboard();
        return;
    }

    // Get all matches and filter by selected date
    const allMatches = getDecryptedData();
    
    if (!allMatches) {
        clearScoreboard();
        return;
    }
    
    const filteredMatches = allMatches.filter(match => match.date === selectedDate);

    // Display matches in same order as JSON (pre-sorted)
    filteredMatches.forEach(match => {
        const row = document.createElement('tr');

        // Duration column
        const durationCell = document.createElement('td');
        durationCell.textContent = match.duration;
        row.appendChild(durationCell);

        // Team A column
        const teamACell = document.createElement('td');
        teamACell.textContent = match.teams.A.join(' & ');
        row.appendChild(teamACell);

        // Team B column
        const teamBCell = document.createElement('td');
        teamBCell.textContent = match.teams.B.join(' & ');
        row.appendChild(teamBCell);

        // Score column
        const scoreCell = document.createElement('td');
        scoreCell.textContent = `${match.score.A} - ${match.score.B}`;
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });

    // If no matches found for the date
    if (filteredMatches.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No matches found for this date';
        cell.style.textAlign = 'center';
        cell.style.color = 'var(--text-secondary)';
        row.appendChild(cell);
        tableBody.appendChild(row);
        clearScoreboard();
    } else {
        // Update scoreboard with filtered matches
        updateScoreboard(filteredMatches);
    }
}

function updateScoreboard(matches) {
    const tbody = document.getElementById('scoreboard-table-body');
    tbody.innerHTML = '';

    // Calculate stats for each player
    const stats = {};

    matches.forEach(match => {
        const teamAPlayers = match.teams.A;
        const teamBPlayers = match.teams.B;
        const winner = match.winner;

        // Process Team A players
        teamAPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = { win: 0, loss: 0 };
            }
            if (winner === 'A') {
                stats[player].win++;
            } else {
                stats[player].loss++;
            }
        });

        // Process Team B players
        teamBPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = { win: 0, loss: 0 };
            }
            if (winner === 'B') {
                stats[player].win++;
            } else {
                stats[player].loss++;
            }
        });
    });

    // Convert to array and sort
    const players = Object.keys(stats);
    const sortedPlayers = players.sort((a, b) => {
        const statA = stats[a];
        const statB = stats[b];

        if (statB.win !== statA.win) {
            return statB.win - statA.win; // More wins first
        }

        if (statA.loss !== statB.loss) {
            return statA.loss - statB.loss; // Fewer losses next
        }

        return a.localeCompare(b); // alphabetical order
    });

    // Populate scoreboard table
    sortedPlayers.forEach(player => {
        const s = stats[player];
        const total = s.win + s.loss;
        const wr = total ? ((s.win / total) * 100).toFixed(1) : '0.0';

        const row = document.createElement('tr');

        // Player name
        const playerCell = document.createElement('td');
        playerCell.textContent = player;
        row.appendChild(playerCell);

        // Wins
        const winCell = document.createElement('td');
        winCell.textContent = s.win;
        row.appendChild(winCell);

        // Losses
        const lossCell = document.createElement('td');
        lossCell.textContent = s.loss;
        row.appendChild(lossCell);

        // Total
        const totalCell = document.createElement('td');
        totalCell.textContent = total;
        row.appendChild(totalCell);

        // Win Rate
        const wrCell = document.createElement('td');
        wrCell.textContent = `${wr}%`;
        row.appendChild(wrCell);

        tbody.appendChild(row);
    });

    // If no players (shouldn't happen if matches exist)
    if (sortedPlayers.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = 'No scoreboard data available';
        cell.style.textAlign = 'center';
        cell.style.color = 'var(--text-secondary)';
        row.appendChild(cell);
        tbody.appendChild(row);
    }
}

function clearScoreboard() {
    const tbody = document.getElementById('scoreboard-table-body');
    tbody.innerHTML = '';
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}