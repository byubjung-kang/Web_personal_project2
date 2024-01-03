
/**
 * @file travelController.js
 * @description Controller module for handling travel record operations.
 *              This module interacts with the travelModel to perform CRUD operations 
 *              and data retrieval for generating pie charts.
 * @author Byubjung Kang
 */
const { TravelRecord, travelModel, pool } = require('../models/travelModel');

const travelController = {

    /**
     * Display all travel records.
     * @param {Function} callback - Callback function to execute after retrieval.
     */
    display: (callback) => {
        travelModel.getAllRecords((error, records) => {
            if (error) {
                console.error(error);
                callback(error);
                return;
            }

            records.forEach(record => {
                console.log(JSON.stringify(record, null, 2));
            });

            callback(null);
        });
    },

    /**
     * Create a new travel record.
     * @param {Object} recordData - Data for the new travel record.
     * @param {Function} callback - Callback function to execute after creation.
     */
    createRecord: (recordData, callback) => {
        const newRecord = new TravelRecord(recordData);
        newRecord.save(callback);
    },

    /**
     * Edit an existing travel record.
     * @param {string} ref_number - Reference number of the record to edit.
     * @param {Object} updatedData - Updated data for the travel record.
     * @param {Function} callback - Callback function to execute after editing.
     */
    editRecord: (ref_number, updatedData, callback) => {
        travelModel.findRecordByRefNumber(ref_number, (err, record) => {
            if (err) {
                return callback(err);
            }
            if (!record) {
                return callback(new Error('Record not found'));
            }


            for (let key in updatedData) {
                if (record.hasOwnProperty(key)) {
                    record[key] = updatedData[key];
                }
            }

            record.update(callback);
        });
    },

    /**
     * Delete a travel record.
     * @param {string} ref_number - Reference number of the record to delete.
     * @param {Function} callback - Callback function to execute after deletion.
     */
    deleteRecord: (ref_number, callback) => {
        TravelRecord.delete(ref_number, callback);
    },

    /**
     * Display a single travel record.
     * @param {string} ref_number - Reference number of the record to display.
     * @param {Function} callback - Callback function to execute after retrieval.
     */
    displayRecord: (ref_number, callback) => {
        travelModel.findRecordByRefNumber(ref_number, callback);
    },

    /**
     * Retrieve data for generating a pie chart based on a specified category.
     * @param {string} category - The expense category to group the data by.
     * @param {Function} callback - Callback function to execute after data retrieval.
     */
    getDataForPieChart: (category, callback) => {
        let query = `
            SELECT title_en,
            SUM(${category}) AS total
            FROM travel_records
            GROUP BY title_en
            ORDER BY SUM(${category}) DESC
            LIMIT 10`;
    
        pool.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }
};

module.exports = travelController;