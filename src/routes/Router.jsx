import { createBrowserRouter } from "react-router-dom";
import FirstHome from '../components/first-page/FirstPage';
import SignUpPageRender from '../components/sign-up-page/RegistrationPage';
import SignInPageRender from '../components/sign-in-page/Login';
import { ErrorBoundary } from 'react-error-boundary';
import ChatRoom from '../components/chat-page/ChatRoom';
import RenderHome from '../components/home-page/HomePage';
import ErrorPage from '../components/Error-page/RouterError';
import FirstMenu from '../components/Menus/FirstPageMenu';
import RenderSinglePostPage from '../components/single-group-page/GroupPage';
import AdminRenderAllUsers from '../components/admin/display-all-users-info-page/DisplayUsers';
import RenderAllUsers from '../components/all-users-page/DisplayUsers';
import FriendsPage from '../components/friends-page/Friends';
import DisplayUnreadMsgUsers from '../components/unread-msg-page/UnreadMsgAndUsers';
import UserSettings from "../components/user-setting-page/Settings";
import FileUploadForm from "../components/upload-image-page/HandleImgUpload";
import AdminDashboard from "../components/admin/homepage/Dashboard";
import DisplayUserProfile from "../components/admin/user-profile/AdminUserProfilePage";
import AdminSignInPageRender from "../components/admin/login-page/AdminLogin";
import AdminRoute from "./AdminAuthentificationRoute";

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
  { path: '/accueil', element: <RenderHome />, errorElement: <ErrorPage /> },
  { path: '/:name/:id', element: <RenderSinglePostPage />, errorElement: <ErrorPage /> },
  { path: '/chat', element: <ChatRoom />, errorElement: <ErrorPage /> },
  { path: '/utilisateurs', element: <RenderAllUsers />, errorElement: <ErrorPage /> },
  { path: '/amis', element: <FriendsPage />, errorElement: <ErrorPage /> },
  { path: '/messages-non-lus', element: <DisplayUnreadMsgUsers />, errorElement: <ErrorPage /> },
  { path: '/parametre', element: <UserSettings />, errorElement: <ErrorPage /> },
  { path: '/parametre/photo-de-profile', element: <FileUploadForm />, errorElement: <ErrorPage /> },
  {
    path: '/admin',
    errorElement: <ErrorPage />,
    element: <AdminRoute />, // Use the custom AdminRoute component to protect all routes under /admin
    children: [
      { path: 'connexion', element: <AdminSignInPageRender /> },
      { path: 'accueil', element: <AdminDashboard /> },
      { path: 'utilisateurs', element: <AdminRenderAllUsers /> },
      { path: 'profile-utilisateur/:id', element: <DisplayUserProfile /> },
    ]
  },
])

export default router;
