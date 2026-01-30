const fs = require('fs');

// Leggiamo il file passato dal workflow (es: data_327.json o data_337.json)
const inputFile = process.argv[2]; 
const FILE_DB = 'db_storico.json';

if (!inputFile || !fs.existsSync(inputFile)) {
    console.log("Utilizzo: node update_history.js [nome_file.json]");
    process.exit(1);
}

try {
    const scanData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    let db = fs.existsSync(FILE_DB) ? JSON.parse(fs.readFileSync(FILE_DB, 'utf8')) : {};
    const now = new Date().toISOString();

    scanData.forEach(p => {
        // Creiamo una chiave unica che includa il mondo per evitare sovrapposizioni di ID
        // Se il file è data_337.json, il prefisso sarà "337_"
        const mondoPrefix = inputFile.match(/\d+/)[0];
        const uniqueId = `${mondoPrefix}_${p.id}`;
        
        const current = { pts: p.points || 0, cst: p.castles ? p.castles.length : 0 };

        if (!db[uniqueId]) {
            db[uniqueId] = { nome: p.name, ultima_modifica: now, dati: current, mondo: mondoPrefix };
        } else if (db[uniqueId].dati.pts !== current.pts || db[uniqueId].dati.cst !== current.cst) {
            db[uniqueId].ultima_modifica = now;
            db[uniqueId].dati = current;
            db[uniqueId].nome = p.name;
        }
    });

    fs.writeFileSync(FILE_DB, JSON.stringify(db, null, 2));
    console.log(`Storico aggiornato per il file: ${inputFile}`);
} catch (e) { console.log("Errore:", e); }
