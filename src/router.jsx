import App from './App';
import { createBrowserRouter } from 'react-router-dom';
import Home from './Routes/Home';
import Details from './Routes/Details';
import Popular from './Routes/Popular';
import NowPlaying from './Routes/NowPlaying';
import ComingSoon from './Routes/ComingSoon';
import Search from './Routes/Search';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: 'details/:movieId',
            element: <Details />,
          },
        ],
      },
      {
        path: 'popular',
        element: <Popular />,
        children: [
          {
            path: 'details/:movieId',
            element: <Details />,
          },
        ],
      },
      {
        path: 'now-playing',
        element: <NowPlaying />,
        children: [
          {
            path: 'details/:movieId',
            element: <Details />,
          },
        ],
      },
      {
        path: 'coming-soon',
        element: <ComingSoon />,
        children: [
          {
            path: 'details/:movieId',
            element: <Details />,
          },
        ],
      },
      {
        path: 'search',
        element: <Search />,
      },
    ],
  },
]);
