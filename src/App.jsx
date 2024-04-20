import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import FirstHome from './components/first-page/FirstPage';
import SignUpPageRender from './components/sign-up-page/RegistrationPage';
import SignInPageRender from './components/sign-in-page/Login';
import { ErrorBoundary } from 'react-error-boundary';
import ChatRoom from './components/chat-page/ChatRoom';
import RenderHome from './components/home-page/HomePage';
import ErrorPage from './components/Error-page/RouterError';
import FirstMenu from './components/Menus/FirstPageMenu';
import RenderSinglePostPage from './components/single-group-page/GroupPage';
import RenderAllUsers from './components/display-all-users-info-page/DisplayUsers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FirstMenu />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <FirstHome /> },
      { path: 'inscription', element: <SignUpPageRender /> },
      { path: 'connexion', element: <SignInPageRender /> },
    ]
  },
  { path: '/accueil', element: <RenderHome /> },
  {path: '/:name/:id', element: <RenderSinglePostPage />},
  { path: '/chat', element: <ChatRoom /> },
  {path: '/utilisateurs', element: <RenderAllUsers />}

])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
