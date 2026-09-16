const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/ticketClaims.json");

function readClaims() {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeClaims(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function setClaim(threadId, userId) {
    const claims = readClaims();
    claims[threadId] = userId;
    writeClaims(claims);
}

function getClaim(threadId) {
    const claims = readClaims();
    return claims[threadId] || null;
}

function removeClaim(threadId) {
    const claims = readClaims();
    delete claims[threadId];
    writeClaims(claims);
}

module.exports = { setClaim, getClaim, removeClaim };