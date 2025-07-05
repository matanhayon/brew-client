// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import Layout from "./components/ui/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import PagePlaceholder from "./components/PagePlaceholder"; // generic fallback
import ProtectedRoute from "./Authentication/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
import DashboardAddRecipe from "./pages/Dashboard/DashboardAddRecipe";
import MyRecipesPage from "./pages/Dashboard/MyRecipesPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/community/recipes" element={<RecipesPage />} />
            <Route path="/community/recipes/:id" element={<RecipeDetail />} />

            <Route
              path="/dashboard/build-recipe/"
              element={
                <ProtectedRoute>
                  <DashboardAddRecipe />
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
              path="/brew/timer"
              element={<PagePlaceholder title="Brew Timer" />}
            />
            <Route
              path="/history/my-brews"
              element={<PagePlaceholder title="My Brews" />}
            />
            <Route
              path="/history/notes"
              element={<PagePlaceholder title="Tasting Notes" />}
            />
            <Route
              path="/community/forums"
              element={<PagePlaceholder title="Forums" />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
