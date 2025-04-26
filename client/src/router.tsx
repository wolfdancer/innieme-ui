import { createBrowserRouter } from 'react-router-dom';
import TopicPage from './pages/TopicPage';
import HomePage from './pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/topics/:topic_id',
    element: <TopicPage />,
  }
]);