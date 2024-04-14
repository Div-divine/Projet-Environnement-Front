import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer } from 'react-router-dom'
import './App.css'
import FirstHome from './components/first-page/FirstPage'
import SignUpPageRender from './components/sign-up-page/RegistrationPage'
import SignInPageRender from './components/sign-in-page/Login'
import { ErrorBoundary } from 'react-error-boundary'
import ChatRoom from './components/chat-page/ChatRoom'
import RenderHome from './components/home-page/HomePage'
import ErrorPage from './components/Error-page/RouterError'
import FirstMenu from './components/Menus/FirstPageMenu'

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
  { path: '/chat', element: <ChatRoom /> }

])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
