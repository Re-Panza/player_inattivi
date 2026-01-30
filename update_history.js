const fs = require('fs');

const inputFile = process.argv[2]; // Prende data_327.json o data_337.json
if (!inputFile) process.exit(1);

// Estrae il numero del mondo (es. 327) e crea il nome del database (es. db_327.json)
const mondoNum = inputFile.match(/\d+/)[0];
const FILE_DB = `db_${mondoNum}.json`;

try {
    const scanData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    let db = fs.existsSync(FILE_DB) ? JSON.parse(fs.readFileSync(FILE_DB, 'utf8')) : {};
    const now = new Date().toISOString();

    scanData.forEach(p => {
        const id = p.id;
        const current = { pts: p.points || 0, cst: p.castles ? p.castles.length : 0 };

        if (!db[id]) {
            db[id] = { nome: p.name, ultima_modifica: now, dati: current };
        } else if (db[id].dati.pts !== current.pts || db[id].dati.cst !== current.cst) {
            db[id].ultima_modifica = now;
            db[id].dati = current;
            db[id].nome = p.name;
        }
    });

    fs.writeFileSync(FILE_DB, JSON.stringify(db, null, 2));
    console.log(`Aggiornato database specifico: ${FILE_DB}`);
} catch (e) { console.log("Errore:", e); }
