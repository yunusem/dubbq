import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Root from './pages/Root';

function App() {
  return (
    // <NotificationsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
        {/* <NotificationsContainer /> */}
      </Router>
    // </NotificationsProvider>
  );
}

export default App;