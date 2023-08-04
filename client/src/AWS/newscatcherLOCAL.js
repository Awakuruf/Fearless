const fs = require('fs');
const axios = require("axios").default;

const street = "York St"

function fetchDataAndSaveToFile() {
    var options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: { q: `${street} AND Toronto`, lang: 'en', sort_by: 'relevancy', page: '1', page_size: '30', countries: "CA", from: "3 day ago", to: "today" },
        headers: {
            'x-api-key': 'NEWSCATCHER API KEY HERE'
        }
    };

    axios.request(options)
        .then(function (response) {
            // The response.data is already a JavaScript object representing JSON data
            var jsonData = response.data;

            // If the jsonData is empty, return empty array for danger level and don't proceed to the mapping nor filtering.
            // Check if the jsonData.articles array is empty
            if (jsonData.status === 'No matches for your search.') {
                console.log("jsonData is empty. Returning empty array for danger level.");

                // Convert the empty array to JSON string
                const jsonString = JSON.stringify([]);

                // Save the JSON data to a file
                fs.writeFile(`./data/output.json[${street}]`, jsonString, 'utf8', function (err) {
                    if (err) {
                        console.error('Error writing JSON file:', err);
                    } else {
                        console.log('JSON file created successfully!');
                    }
                });

                return [];
            }

            // Extract the 'summary' from each article and put it into a dataset (array)
            var dataset = jsonData.articles.map(article => {
                return { summary: article.summary };
            });

            // Convert the dataset array to a JSON string
            var jsonString = JSON.stringify(dataset, null, 2);

            // Save the JSON data to a file
            fs.writeFile(`./data/output.json[${street}]`, jsonString, 'utf8', function (err) {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log('JSON file created successfully!');
                }
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

fetchDataAndSaveToFile();

module.exports = fetchDataAndSaveToFile;

// route.summary -> newscatcher -> headline -> Comprehend Model -> Danger / Safe -> UI (Safe / Danger)

// newscatcher (assault / attack / robbery / gang / violence ) -> Checks for street names - if matches -> Analyze the summary using Comprehend.

// McCaul St -> Tries to filter NO DATA -> TypeError: Cannot read properties of undefined (reading 'map')
// University Street -> Filters dataset with ONE DATA (and it doesn't contain the string "University Street") -> []
// King Street ->  Filters dataset with MULTIPLE DATA (and some summaries do contain the string "University Street") -> [{summary1},{summary2},{summary3}]