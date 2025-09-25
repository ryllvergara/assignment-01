import express from 'express';
import cors from 'cors'; 

let cachedUsers = []; 
const MAX_RESULTS = 1000;

const app = express();
const PORT = 3000;

app.use(cors()); // Allow all cross-origin requests

app.get('/', (req, res) => {
    let requestedCount = parseInt(req.query.results, 10);

    let count;
    if (isNaN(requestedCount) || requestedCount < 1) {
        count = 1;
    } else {
        count = Math.min(requestedCount, cachedUsers.length);
    }

    const usersToReturn = cachedUsers.slice(0, count);

    res.json({
        results: usersToReturn,
        info: {
            seed: "static-cache",
            results: usersToReturn.length,
            page: 1,
            version: "1.0"
        }
    });
});

async function initializeServer() {
    console.log(`Fetching ${MAX_RESULTS} users from Random User API...`);
    
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${MAX_RESULTS}`);
        const data = await response.json();
        
        cachedUsers = data.results; 
        console.log(`Successfully cached ${cachedUsers.length} users.`);
    } catch (error) {
        console.error("Failed to fetch initial data:", error.message);
    }
    
    app.listen(PORT, () => {
        console.log(`Mock API running at http://localhost:${PORT}`);
    });
}

initializeServer();