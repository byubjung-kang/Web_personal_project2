
/**
 * @file travelModel.js
 * @description Defines the TravelRecord class and the travelModel object for 
 * interacting with the travel_records database table.
 * @author Byubjung Kang
 */
const mysql = require('mysql');

// Create a MySQL pool connection.
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'test1'
});

/**
 * Class representing a travel record.
 */
class TravelRecord {
    /**
     * Create a TravelRecord.
     * @param {Object} data - Data for the travel record.
     */
    constructor(data) {
        // Initialize the travel record with data.
        this.ref_number = data.ref_number;
        this.title_en = data.title_en;
        this.purpose_en = data.purpose_en;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.airfare = data.airfare;
        this.other_transport = data.other_transport;
        this.lodging = data.lodging;
        this.meals = data.meals;
        this.other_expenses = data.other_expenses;
        this.total = data.total;
    }

    /**
     * Save this record to the database.
     * @param {Function} callback - Callback function to execute after saving.
     */
    save(callback) {
        const query = 'INSERT INTO travel_records SET ?';
        pool.query(query, this, callback);
    }
    /**
     * Update this record in the database.
     * @param {Function} callback - Callback function to execute after updating.
     */
    update(callback) {
        const query = 'UPDATE travel_records SET ? WHERE ref_number = ?';
        pool.query(query, [this, this.ref_number], callback);
    }

    /**
     * Delete a record from the database by its reference number.
     * @param {string} ref_number - Reference number of the record to delete.
     * @param {Function} callback - Callback function to execute after deletion.
     */
    static delete(ref_number, callback) {
        const query = 'DELETE FROM travel_records WHERE ref_number = ?';
        pool.query(query, ref_number, callback);
    }

   
}

/**
 * Object containing functions to interact with the travel_records database.
 */
const travelModel = {

    /**
     * Get all travel records from the database.
     * @param {Function} callback - Callback function to execute after retrieval.
     */
    getAllRecords: (callback) => {
        pool.query('SELECT * FROM travel_records', (error, results) => {
            if (error) return callback(error, null);
    
            const records = results.map(row => new TravelRecord(row));
            callback(null, records);
        });
    },

    /**
     * Find a travel record by its reference number.
     * @param {string} ref_number - Reference number of the record to find.
     * @param {Function} callback - Callback function to execute after finding the record.
     */
    findRecordByRefNumber: (ref_number, callback) => {
        const query = 'SELECT * FROM travel_records WHERE ref_number = ?';
        pool.query(query, [ref_number], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            const record = new TravelRecord(results[0]);
            callback(null, record);
        });
    }
};

module.exports = { TravelRecord, travelModel, pool };