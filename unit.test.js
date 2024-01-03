
/**
 * @file travelModel.test.js
 * @description Unit tests for the travelModel module.
 *              Tests the functionality of the getAllRecords method in the travelModel.
 * @requires models/travelModel
 */
const { travelModel } = require('./models/travelModel');

/**
 * Simple test suite for travelModel.
 */
describe('travelModel', () => {
    console.log("Test by Byubjung Kang");

    /**
     * Test whether getAllRecords method successfully retrieves records from the database.
     */
    test('getAllRecords retrieves records from the database', async () => {

        // Convert the callback-based getAllRecords method to a promise to use with async/await.     
        const result = await new Promise((resolve, reject) => {
            travelModel.getAllRecords((err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });
        // Check if the result is an array.
        expect(Array.isArray(result)).toBeTruthy();

        // Ensure that the array is not empty, indicating records were retrieved.
        expect(result.length).toBeGreaterThan(0);
    });
});
