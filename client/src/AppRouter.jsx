import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Lobby />,
    },
    {
      path: "/startGame",
      element: <GameBoard />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
