
/**
 * @file menuView.js
 * @description User interface module for the travel records management application.
 *              Provides a console-based menu system for user interaction, allowing users
 *              to perform various operations such as displaying records, creating, editing,
 *              deleting records, and generating pie charts based on expense categories.
 *              Utilizes the travelController for performing these operations.
 * @author Byubjung Kang
 */
const readlineSync = require('readline-sync');
const travelController = require('../controllers/travelController');

/**
 * Opens a URL in the default web browser.
 * @param {string} url - The URL to open.
 */
async function openBrowser(url) {
    const open = (await import('open')).default;
    open(url);
}

const menuView = {
    /**
     * Displays the main menu and handles user input for menu options.
     */
    displayMenu: function () {
        console.log("\nProgram by Byubjung Kang ");
        console.log("1. Display all records");
        console.log("2. Create a new record");
        console.log("3. Edit a record");
        console.log("4. Delete a record");
        console.log("5. Generate Pie Chart");
        console.log("6. Exit");
        this.handleUserInput(readlineSync.question('Select an option: '));
    },

    /**
     * Processes user input and calls the appropriate function based on the selected menu option.
     * @param {string} option - The user-selected menu option.
     */
    handleUserInput: function (option) {
        // Switch statement to handle different menu options.
        switch (option) {
            case '1':
                travelController.display((err) => {
                    if (err) {
                        return;
                    }
                    this.displayMenu();
                });
                break;
            case '2':
                this.createRecordView();
                break;
            case '3':
                this.editRecordView();
                break;
            case '4':
                this.deleteRecordView();
                break;
            case '5':
                this.displayPieChartOptions();
                break;
            case '6':
                console.log('Goodbye!');
                process.exit();
                break;

            default:
                console.log('Invalid option. Try again.');
                this.displayMenu();
                break;
        }
    },

    /**
     * View for creating a new record.
     */
    createRecordView: function () {
        console.log("Enter new record details:");
        let recordData = {
            ref_number: readlineSync.question('Ref Number: '),
            title_en: readlineSync.question('Title (EN): '),
            purpose_en: readlineSync.question('purpose (EN): '),
            start_date: readlineSync.question('start date: '),
            end_date: readlineSync.question('end date : '),
            airfare: readlineSync.question('airfare : '),
            other_transport: readlineSync.question('other_transport: '),
            lodging: readlineSync.question('lodging: '),
            meals: readlineSync.question('meals: '),
            other_expenses: readlineSync.question('other_expenses: '),
            total: readlineSync.question('total: ')
        };

        travelController.createRecord(recordData, (err, result) => {
            if (err) {
                console.error('Error creating record:', err);
                return this.displayMenu();;

            }
            console.log('\nRecord created successfully');
            this.displayMenu();
        });
    },

    /**
     * View for editing an existing record.
     */
    editRecordView: function () {
        let ref_number = readlineSync.question('Enter Ref Number of the record to edit: ');

        travelController.displayRecord(ref_number, (err, record) => {
            if (err) {
                console.error('Error retrieving record:', err);
                return;
            }
            if (!record) {
                console.log('Record not found');
                return this.displayMenu();
            }
            console.log('Current Record Details:');
            console.log(JSON.stringify(record, null, 2));

            console.log("Enter new details for the record (press Enter to skip):");
            let updatedData = {};

            let title_en = readlineSync.question('Title (EN): ');
            if (title_en) {
                updatedData.title_en = title_en;
            }

            let purpose_en = readlineSync.question('Purpose (EN): ');
            if (purpose_en) {
                updatedData.purpose_en = purpose_en;
            }

            let start_date = readlineSync.question('Start Date (YYYY-MM-DD): ');
            if (start_date) {
                updatedData.start_date = start_date;
            }
            let end_date = readlineSync.question('End Date (YYYY-MM-DD): ');
            if (end_date) {
                updatedData.end_date = end_date;
            }

            let airfare = readlineSync.question('airfare: ');
            if (airfare) {
                updatedData.airfare = airfare;
            }
            let other_transport = readlineSync.question('other_transport: ');
            if (other_transport) {
                updatedData.other_transport = other_transport;
            }
            let lodging = readlineSync.question('lodging: ');
            if (lodging) {
                updatedData.lodging = lodging;
            }
            let meals = readlineSync.question('meals: ');
            if (meals) {
                updatedData.meals = meals;
            }
            let other_expenses = readlineSync.question('other_expenses: ');
            if (other_expenses) {
                updatedData.other_expenses = other_expenses;
            }
            let total = readlineSync.question('total: ');
            if (total) {
                updatedData.total = total;
            }

            travelController.editRecord(ref_number, updatedData, (err, result) => {
                if (err) {
                    console.error('Error updating record:', err);
                    return;
                }
                console.log('\nRecord updated successfully');
                this.displayMenu();
            });
        });
    },

    /**
     * View for deleting an existing record.
     */
    deleteRecordView: function () {
        let ref_number = readlineSync.question('Enter Ref Number of the record to delete: ');

        travelController.deleteRecord(ref_number, (err, result) => {
            if (err) {
                console.error('Error deleting record:', err);
                return;
            }
            console.log('\nRecord deleted successfully');
            this.displayMenu();
        });
    },

    /**
     * Displays options for generating a pie chart and opens the chart in a web browser.
     * The chart displays the top 10 groups based on 'title_en' for the selected expense category.
     */
    displayPieChartOptions: function () {
        console.log("\nChoose an expense category to view the pie chart:");
        console.log("The chart will display the top 10 groups based on 'title_en', for the selected expense category.");
        console.log("1. Airfare");
        console.log("2. Other Transport");
        console.log("3. Lodging");
        console.log("4. Meals");
        console.log("5. Other Expenses");
        let choice = readlineSync.question('Your choice: ');

        let category;
        switch (choice) {
            case '1':
                category = 'airfare';
                break;
            case '2':
                category = 'other_transport';
                break;
            case '3':
                category = 'lodging';
                break;
            case '4':
                category = 'meals';
                break;
            case '5':
                category = 'other_expenses';
                break;
            default:
                console.log('Invalid option.');
                this.displayMenu();
                return;
        }
        openBrowser(`http://localhost:3000/pie-chart?category=${category}`);

        setTimeout(() => {
            this.displayMenu();
        }, 2000); // 2-second delay before returning to the menu
    },

    requestChartData: function (criteria) {
        travelController.getDataForChart(criteria, (err, data) => {
            if (err) {
                console.error('Error fetching data:', err);
                return;
            }
            this.renderPieChart(data);
        });
    }
};

module.exports = menuView;
