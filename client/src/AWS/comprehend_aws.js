import { ComprehendClient, ClassifyDocumentCommand } from "@aws-sdk/client-comprehend";
import AWS from "aws-sdk"
import { SecretsManagerClient, GetSecretValueCommand} from "@aws-sdk/client-secrets-manager";

async function runComprehend(dataset) {
    // const sm = new AWS.SecretsManager({region: 'us-east-2'});

    // const getSecrets = async (SecretID) => {
    //     return await new Promise((resolve, reject) => {
    //         sm.getSecretValue({SecretID}, (err, result) => {
    //             if (err) reject(err) 
    //             else resolve(JSON.parse(result.SecretString))
    //         })
    //     }) 
    // }

    // const comprehend = getSecrets('Comprehend_Access_Keys');
    // console.log("Secret Manager retrieved", comprehend);


    // Create a new Comprehend client
    const credentials = new AWS.Credentials("ACCESS KEY HERE", "SECRET ACCESS KEY HERE");
    const client = new ComprehendClient({ region: "us-east-2", credentials });
    const det_percentage = 0.5;

    const endpointArn = "ENDPOINT ARN HERE"

    try {
        // console.log("Reached runComprehend");
        // const comprehend = getSecrets('Comprehend_Access_Keys');
        // console.log("Secret Manager retrieved", comprehend);

        await new Promise((resolve) => setTimeout(resolve, 3000));


        // Define the parameters for the classifyDocument operation
        const params = {
            Text: dataset,
            EndpointArn: endpointArn
        };

        // Call the classifyDocument operation
        const data = new ClassifyDocumentCommand(params);
        const response = await client.send(data);

        // Extract the Classes from the response
        const classes = response.Classes;

        // Check if there are classes and if the "DANGER" score is greater than 0.5
        if (classes && classes.length > 0 && classes[0].Score > det_percentage) {
            return "DANGER";
        } else {
            return "SAFE";
        }
    } catch (error) {
        console.error('Error classifying the document:', error);
        return null;
    }
}

// module.exports = classifyDocument;
export default runComprehend;

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

// Secrets Manager Import
// Create a new Comprehend client
// const secret_name = "Comprehend_Access_Keys";
// const region = "us-east-2";
// const det_percentage = 0.5;

// try {
//     // Create a new Secrets Manager client
//     const secretsManagerClient = new SecretsManagerClient({ region });

//     // Retrieve the secret value
//     const secrets_response = await secretsManagerClient.send(
//         new GetSecretValueCommand({
//             SecretId: secret_name,
//             VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
//         })
//     );

//     const secret = secrets_response.SecretString;
//     console.log("Here is the retrieved secret", secret);

//     // Parse the secret value as JSON
//     const secretValue = JSON.parse(secret);
//     console.log("Here is the parsed secret", secretValue);


//     // Create a new Comprehend client
//     const client = new ComprehendClient({ region, credentials });