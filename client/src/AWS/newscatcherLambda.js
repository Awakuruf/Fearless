// IGNORE THIS FILE

async function fetchData(routeName) {
    var url = new URL('https://api.newscatcherapi.com/v2/search');
    url.searchParams.append('q', `"${routeName}" AND Toronto`);
    url.searchParams.append('lang', 'en');
    url.searchParams.append('sort_by', 'relevancy');
    url.searchParams.append('page', '1');
    url.searchParams.append('page_size', '30');
    url.searchParams.append('countries', 'CA');
    url.searchParams.append('from', '3 days ago');
    url.searchParams.append('to', 'today');

    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': 'NEWSCATCHER API KEY HERE' 
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        const dataset = jsonData.articles.map(article => {
            return { summary: article.summary };
        });
        const filteredDataset = dataset.filter(item => item.summary.includes(`${routeName}`));
        filteredDataset.forEach(item => {
            item.summary = item.summary.replace(/\n/g, '');
        });

        // Return the dataset
        console.log(filteredDataset);
        return filteredDataset;
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = fetchData;

