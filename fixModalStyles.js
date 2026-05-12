const fs = require('fs');

const filePath = 'c:/Projects/Gen-AI-Placement-Management-System/frontend/src/pages/hr/Dashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const startStr = 'Create New Offer</h3>';
const endStr = '<div className="flex gap-3 justify-end mt-6">';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find modal bounds");
    process.exit(1);
}

let modalContent = content.substring(startIndex, endIndex);

modalContent = modalContent.replace(/text-blue-700 dark:text-yellow-300 drop-shadow-lg/g, 'text-blue-400 dark:text-blue-300 drop-shadow-md');
modalContent = modalContent.replace(/text-blue-900 dark:text-yellow-200/g, 'text-white focus:ring-2 focus:ring-blue-500/50 outline-none');
modalContent = modalContent.replace(/placeholder-blue-400 dark:placeholder-yellow-400/g, 'placeholder-slate-400');
modalContent = modalContent.replace(/border-blue-700\/40/g, 'border-slate-700');
modalContent = modalContent.replace(/text-white placeholder-white font-extrabold drop-shadow-xl/g, 'text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 outline-none');

content = content.substring(0, startIndex) + modalContent + content.substring(endIndex);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated modal styles");
