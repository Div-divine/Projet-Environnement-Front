import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
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
import AdminRenderAllUsers from './components/admin/display-all-users-info-page/DisplayUsers';
import RenderAllUsers from './components/all-users-page/DisplayUsers';
import FriendsPage from './components/friends-page/Friends';

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
  { path: '/:name/:id', element: <RenderSinglePostPage /> },
  { path: '/chat', element: <ChatRoom /> },
  { path: '/utilisateurs', element: <RenderAllUsers /> },
  { path: '/amis', element: <FriendsPage/> },
  { path: '/admin/utilisateurs', element: <AdminRenderAllUsers /> }

])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
