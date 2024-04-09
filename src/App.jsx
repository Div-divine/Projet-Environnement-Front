import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer } from 'react-router-dom'
import './App.css'
import FirstHome from './components/first-page/FirstHomePage'
import SignUpPageRender from './components/sign-up-page/RegistrationPage'
import SignInPageRender from './components/sign-in-page/Login'
import { ErrorBoundary } from 'react-error-boundary'
import ChatRoom from './components/chat-page/ChatRoom'
import RenderHome from './components/home-page/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <FirstHome />,
    errorElement: <ErrorPage />,
  },
  {
    path : '/inscription',
    element : <SignUpPageRender />
  },
  {
    path : '/connexion',
    element : <SignInPageRender />
  },
  {
    path : '/accueil',
    element : <RenderHome />
  },
  {
    path : '/chat',
    element : <ChatRoom />
  }
])

function ErrorPage() {
  const error = useRouteError()
  console.log(error)
  return <div>
    <h2 className='error-page'>Something went wrong !</h2>
    <p>
      {error?.error?.toString() ?? error?.toString()}
    </p>
  </div>
}

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
