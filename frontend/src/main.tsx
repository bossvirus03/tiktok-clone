import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Upload from "./pages/Upload.tsx";
import Post from "./pages/Post.tsx";
import Profile from "./pages/Profile.tsx";
import Feed from "./pages/Feed.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/apolloClient.ts";
import MainLayout from "./layouts/MainLayout.tsx";
import UploadLayout from "./layouts/UploadLayout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Feed />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoutes>
        <UploadLayout>
          <Upload />
        </UploadLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/post/:id",
    element: <Post />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
