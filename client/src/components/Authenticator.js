import { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import Mainpage from './Mainpage.js';

Amplify.configure(awsExports);

export default function App() {
    const [attributes, setAttributes] = useState('');

    async function fetchAttributes() {
        try {
            const userinfo = await Auth.currentUserInfo();
            setAttributes(userinfo);
            console.log("User attributes -", attributes);
            return attributes;
        } catch (error) {
            if (error === "AuthError") {
                console.log("Fetching user attributes failed with error", error);
            } else {
                console.log("Unexpected error:", error);
            }
        }
    }


    useEffect(() => {
        fetchAttributes(); // Fetch attributes when the component mounts
    }, []);
    
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <main>
                    <Mainpage signOut={signOut} userAttributes={attributes} />
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    );
}


// import { Amplify, Auth } from 'aws-amplify';
// import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
// import React, { useEffect, useState } from 'react';
// import '@aws-amplify/ui-react/styles.css';
// import awsExports from '../aws-exports';
// import Mainpage from './Mainpage';

// Amplify.configure(awsExports);

// export default function App() {
//     const [user, setUser] = useState(undefined);

//     const checkUser = async () => {
//         try {
//             const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
//             setUser(authUser);
//         } catch (error) {
//             setUser(null);
//         }
//     };

//     useEffect(() => {
//         checkUser();
//     }, []);

//     return (
//         <>
//             {user ? (
//                 <Mainpage />
//             ) : (
//                 <Authenticator>
//                     {({ signOut, user }) => (
//                         <main>
//                             <h1>Hello {user?.username}</h1>
//                             <button onClick={signOut}>Sign out</button>
//                         </main>
//                     )}
//                 </Authenticator>
//             )}
//         </>
//     );
// }

