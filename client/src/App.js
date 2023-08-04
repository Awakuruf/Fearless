import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/Mainpage';
import Loading from './components/LoadingComponent';
import SignUp from './components/Cognito/CognitoUI-signup';
import LogIn from './components/Cognito/CognitoUI-login';
import Authenticator from './components/Authenticator';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authenticator />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
