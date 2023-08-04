import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId:"USERPOOLID HERE",
    ClientId: "CLIENTID HERE"
}

export default new CognitoUserPool(poolData);