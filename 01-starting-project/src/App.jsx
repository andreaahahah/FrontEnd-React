import {createBrowserRouter, Link, RouterProvider} from "react-router-dom"
import HomePage from "./pages/Home";
import CartPage from "./pages/Cart";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./pages/Root";
import Cerca from "./pages/Cerca";
import LoginPage from "./pages/LoginPage";
import CatalogoPage from "./pages/CatalogoPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";
import SignUpPage from "./pages/SignUpPage";
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import { AuthProvider } from "./GlobalContext/AuthContext";
import { LoadingProvider } from "./GlobalContext/LoadingContext";

const router = createBrowserRouter([
  {
    path:"/",
    element: <RootLayout/>,
    children: [
      {path: "/", element: <HomePage/>},
      {path:"/login", element :<LoginPage/>},
      {path:"/signup", element:<SignUpPage/>},
      {path: "/cart", element: <CartPage/>},
      {path:"/profile", element: <ProfilePage/>},
      {path:"search/:searchText", element: <Cerca/>},
      {path:"/catalog", element:<CatalogoPage/>},
      {path:"/product/:prodotto", element:<ProductPage/>},
      {path:"admin/products", element:<AdminPage/>}
    ]
  }
]);
function App() {
  return (
    
    <AuthProvider>
      <LoadingProvider>
        <RouterProvider router ={router}/>
      </LoadingProvider>
    </AuthProvider>

  );
}

export default App;

