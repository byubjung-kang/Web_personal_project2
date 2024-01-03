
/**
 * @file app.js
 * @description Entry point for the travel records management application. This file sets up the Express server 
 *              and routes, and initiates the user interface for the application. It handles server-side routing 
 *              for serving the pie chart web page and fetching the necessary data for the pie chart.
 * @author Byubjung Kang
 */
const express = require('express');
const app = express();
const travelController = require('./controllers/travelController');
const menuView = require('./views/menuView');
const path = require('path');

// Middleware to serve static files from 'views' directory
app.use(express.static('views'));

/**
 * Route to serve the pie chart webpage.
 */
app.get('/pie-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pie-chart.html'));
});

/**
 * Route to provide data for the pie chart based on the selected category.
 * It uses a query parameter to determine the category and fetches data accordingly.
 */
app.get('/pie-chart-data', (req, res) => {
    const category = req.query.category || 'total'; 
    travelController.getDataForPieChart(category, (err, data) => {
        if (err) {
            res.status(500).send('Server error');
            return;
        }
        res.json(data);
    });
});

// Start the Express server on port 3000
app.listen(3000, () => console.log(''));

// Display the console-based user interface menu
menuView.displayMenu();
