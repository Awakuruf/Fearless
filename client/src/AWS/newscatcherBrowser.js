// The axios library is typically used in Node.js environments for making HTTP requests, but in the browser, you would use fetch or other methods available natively.
// const axios = require('axios');
import axios from 'axios'
// console.log(axios);

async function fetchData(routeName, news) {
    var options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: { q: `${routeName} AND Toronto`, lang: 'en', sort_by: 'relevancy', page: '1', page_size: '30', countries: "CA", from: "3 day ago", to: "today" },
        headers: {
            'x-api-key': "NEWSCATCHER API KEY HERE"
        }
    };

    try {
        const response = await axios.request(options);
        // The response.data is already a JavaScript object representing JSON data
        var jsonData = response.data;

        // If the jsonData is empty, return empty array for danger level and don't proceed to the mapping nor filtering.
        // Check if the jsonData.articles array is empty
        if (jsonData.status === 'No matches for your search.' || !jsonData.articles || jsonData.articles.length === 0) {
            console.log("jsonData is empty. Added [] to list of headlines");
            news.push({ streetName: routeName, headlines: [], articles: [] });
            return news;
        }

        // // Filter the headlines so it only includes the headlines that contains the "routeName" in its summaries
        // const filteredArticles = jsonData.articles.filter(article => article.summary.includes(routeName));

        // if (!filteredArticles || filteredArticles.length === 0) {
        //     console.log("No article that contains the street name. Added [] to list of headlines");
        //     news.push({ streetName: routeName, headlines: [] });
        //     return news;
        // }

        // Extract the summaries from the articles in jsonData and add them to the news array with the corresponding streetName
        const headlines = jsonData.articles.map(article => article.summary);

        // Extract the summaries from the articles in jsonData and add them to the news array with the corresponding streetName
        const links = jsonData.articles.map(article => article.link);

        // Extract the article link into an array called article_link_array with its corresponding route name.
        const article_link_array = []
        article_link_array.push({ streetName: routeName, links: links });

        // Add the article summaries to the news array with the corresponding streetName
        news.push({ streetName: routeName, headlines: headlines, links: links});
        return news;

    } catch (error) {
        console.error(error);
        return news;
    };
}

// module.exports = fetchData;
export default fetchData;

// const filteredHeadlines = headlines.filter(item => item.summary.includes(`${routeName}`));

// route.summary -> newscatcher -> headline -> Comprehend Model -> Danger / Safe -> UI (Safe / Danger)

// newscatcher (assault / attack / robbery / gang / violence ) -> Checks for street names - if matches -> Analyze the summary using Comprehend.

// McCaul St -> Tries to filter NO DATA -> TypeError: Cannot read properties of undefined (reading 'map')
// University Street -> Filters dataset with ONE DATA (and it doesn't contain the string "University Street") -> []
// King Street ->  Filters dataset with MULTIPLE DATA (and some summaries do contain the string "University Street") -> [{summary1},{summary2},{summary3}]

// Summary passed into --- Has array of data & filters it ---> return [{summary1},{summary2},{summary3}]
//                     \                                 \
//                      \ No data to be passed            \ Empty dataset after filtering 
//                       \                                 \
//                        return [] (Empty array)           return [] (Empty array)


// await axios.request(options)
//         .then(function (response) {
//             // console.log(response);
//             // The response.data is already a JavaScript object representing JSON data
//             var jsonData = response.data;

//             // If the jsonData is empty, return empty array for danger level and don't proceed to the mapping nor filtering.
//             // Check if the jsonData.articles array is empty
//             if (jsonData.status === 'No matches for your search.') {
//                 console.log("jsonData is empty. Added [] to list of headlines");
//                 headlines.push({ streetName: routeName, headlines: [] });
//                 return headlines;
//             }

//             // Extract the 'summary' from each article and put it into a dataset (array)
//             var dataset = jsonData.articles.map(article => {
//                 return { summary: article.summary };
//             });
//             // console.log('Here is the dataset:', dataset);
//             const filteredDataset = dataset.filter(item => item.summary.includes(`${routeName}`));
//             filteredDataset.forEach(item => {
//                 item.summary = item.summary.replace(/\n/g, '');
//             });
//             // Return the dataset
//             // console.log("Here is the filteredDataset",filteredDataset);
//             headlines.push({ streetName: routeName, headlines: filteredDataset });
//             console.log(headlines);
//             return headlines;
//         })
//         .catch(function (error) {
//             console.error(error);
//             return headlines;
//         });