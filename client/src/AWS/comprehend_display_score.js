import { ComprehendClient, ClassifyDocumentCommand } from "@aws-sdk/client-comprehend";
import AWS from "aws-sdk"

async function analyzeHeadline(dataset) {
    // Create a new Comprehend client
    const credentials = new AWS.Credentials("ACCESS KEY HERE", "SECRET ACCESS KEY HERE");
    const client = new ComprehendClient({ region: "us-east-2", credentials});

    const endpointArn = "ENDPOINT ARN HERE"

    // Test text 
    // const text = "This advertisement has not loaded yet, but your article continues below. Hundreds of tenants and community members marched down Weston Road to protest rent increases at 33 King St. and 22 John St. in Toronto on July 15. Photo by YSW Tenant Union / Twitter Hundreds of renters have gone on strike in Toronto and are refusing to pay their landlords. This advertisement has not loaded yet, but your article continues below. On June 1, hundreds of tenants went on rent strike at 33 King Street, claiming their landlords failed to comply with rent control regulations."


    // Define the parameters for the classifyDocument operation
    const params = {
        Text: dataset,
        EndpointArn: endpointArn
    };

    try {
        // Call the classifyDocument operation
        const data = new ClassifyDocumentCommand(params);
        const response = await client.send(data);

        // Extract the Classes from the response
        const classes = response.Classes;
        console.log("Comprehend Output:", classes);
        return classes;
    } catch (error) {
        console.error('Error classifying the document:', error);
        return null;
    }
}

// module.exports = classifyDocument;
export default analyzeHeadline;

// // Import the AWS SDK
// const { ComprehendClient, BatchDetectDominantLanguageCommand } = require("@aws-sdk/client-comprehend");
// const dataset = require('./newscatcher'); // Assuming newscatcher.js is in the same directory.


// // Create a new Comprehend client
// const client = new AWS.Comprehend();

// // Replace 'your_endpoint_arn' with the actual ARN of your Comprehend endpoint

// // Define the parameters for the classifyDocument operation
// const params = {
//     Text: dataset,
//     EndpointArn: endpointArn
// };

// // Call the classifyDocument operation
// client.classifyDocument(params, (err, data) => {
//     if (err) {
//         console.error('Error:', err);
//     } else {
//         // Extract the labels from the response
//         const labels = data.Labels;

//         // Format the output as an array of objects
//         const formattedOutput = labels.map(label => ({
//             Name: label.Name,
//             Score: label.Score
//         }));

//         // Print the formatted output
//         console.log(formattedOutput);
//     }
// });
