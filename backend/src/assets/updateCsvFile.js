const fs = require('fs');
const path = require('path');

class updateCsvFile {
    async convertToCSV(documents) {
        const header = [
            "dwell",
            "flight",
            "interkey",
            "target"
        ]
        let csvContent = header.join(',') + '\n';
        documents.forEach(doc => {
            const row = [
                doc.dwellTime,
                doc.flightTime,
                doc.interKeyTime,
                doc.target
            ];
            csvContent += row.join(',') + '\n';
        });
        return csvContent;
    }
    async overwriteCSVFile(csvContent, outputFilePath) {
        try {
            fs.writeFileSync(outputFilePath, csvContent, 'utf8');
        }
        catch (error) {
            console.error('Error writing CSV file:', error);
        }
    }

    async exportUserDataToCsv(documents) {
        this.documents = documents;
        const csvContent = await this.convertToCSV(documents);
        const outputFilePath = "C:\\Users\\Aditya Jindal\\OneDrive\\Desktop\\College Data\\Minor Project\\Neurokey\\backend\\src\\Python\\keystrokeData.csv";
        
        await this.overwriteCSVFile(csvContent, outputFilePath);
        
    }
}

module.exports = updateCsvFile;
