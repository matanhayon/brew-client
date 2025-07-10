// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import Layout from "./components/ui/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import ProtectedRoute from "./Authentication/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
// import DashboardAddRecipe from "./pages/Dashboard/DashboardAddRecipe";
import MyRecipesPage from "./pages/Dashboard/MyRecipesPage";
import DashboardAddBrewery from "./pages/Dashboard/DashboardAddBrewery";
import BreweriesPage from "./pages/BreweriesPage";
import BreweryDetail from "./pages/BreweryDetail";
import { ActiveBreweryProvider } from "@/context/ActiveBreweryContext";
import BreweryMembersRecipesPage from "./pages/Dashboard/BreweryMembersRecipesPage";
import AuthPage from "./pages/AuthPage";
import BuildRecipePage from "./pages/Dashboard/BuildRecipe";
import DeviceManager from "./pages/SettingsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ActiveBreweryProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/community/recipes" element={<RecipesPage />} />
              <Route path="/community/recipes/:id" element={<RecipeDetail />} />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DeviceManager />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/community/breweries"
                element={
                  <ProtectedRoute>
                    <BreweriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/breweries/:id"
                element={<BreweryDetail />}
              />

              <Route
                path="/dashboard/build-brewery/"
                element={
                  <ProtectedRoute>
                    <DashboardAddBrewery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/build-recipe/"
                element={
                  <ProtectedRoute>
                    {/* <DashboardAddRecipe /> */}
                    <BuildRecipePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/my-recipes/"
                element={
                  <ProtectedRoute>
                    <MyRecipesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/brewery-recipes/"
                element={
                  <ProtectedRoute>
                    <BreweryMembersRecipesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ActiveBreweryProvider>
    </ThemeProvider>
  );
}

export default App;
