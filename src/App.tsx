import {
  PocketBaseProvider,
  usePbAuthRefresh,
  usePbAuthStore,
} from "use-pocketbase";
import { AuthPage } from "./pages/Auth";
import {
  BrowserRouter,
  HashRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { DockLayout } from "./layouts/DockLayout";
import { useEffect } from "react";
import { HomePage } from "./pages/Home";
import { ListView } from "./pages/List";

export function App() {
  return (
    <PocketBaseProvider baseUrl="https://yata-db.vanvoorden.dev/">
      <AuthedRoute />
    </PocketBaseProvider>
  );
}

function AuthedRoute() {
  const { isValid } = usePbAuthStore();
  usePbAuthRefresh("users");

  if (!isValid) {
    return <AuthPage />;
  }

  return <Router />;
}

function Router() {
  const authStore = usePbAuthStore();
  return (
    <HashRouter>
      <Routes>
        <Route element={<DockLayout />}>
          <Route
            element={
              <h1>
                Welcome, {authStore.model?.username} <Outlet />!
              </h1>
            }
          >
            <Route
              path="/shared"
              element={<div>Your todos will be here.</div>}
            />
          </Route>
          <Route path="/home" element={<HomePage />} />
          <Route path="/templates" element={<div>Templates page</div>} />

          <Route path="/lists/:listId" element={<ListView />} />
        </Route>

        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="*"
          element={
            <div>
              Page not found. <Link to="/">Go home</Link>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, [navigate]);

  return null;
}
