import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import CartPage from "./pages/Cart";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/Root";

import LoginPage from "./pages/LoginPage";
import CatalogoPage from "./pages/CatalogoPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";
import SignUpPage from "./pages/SignUpPage";
import ITuoiOrdini from "./pages/ITuoiOridniPage";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AuthProvider } from "./GlobalContext/AuthContext";
import { LoadingProvider } from "./GlobalContext/LoadingContext";
import ErrorPage from "./pages/ErrorPage";
import { CartProvider } from "./GlobalContext/CartContext";
import OrdinaPage from "./pages/OrdinaPage";
import ConfermaOrdinePage from "./pages/ConfermaOrdinePage";
import Ricerca from "./Components/Ricerca";
import ToastManager from "./ToastManager"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "search/:searchText", element: <Ricerca /> },
      { path: "/catalog", element: <CatalogoPage /> },
      { path: "/product/:prodotto", element: <ProductPage /> },
      { path: "admin/products", element: <AdminPage /> },
      { path: "/iTuoiOrdini", element: <ITuoiOrdini /> },
      {
        path: "/ordina",
        element: <OrdinaPage />,
        children: [
          { path: "conferma-ordine", element: <ConfermaOrdinePage /> },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <CartProvider>
          <ToastManager />
          <RouterProvider router={router} />
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
