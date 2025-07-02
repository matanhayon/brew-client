// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import Layout from "./components/ui/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/page";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import PagePlaceholder from "./components/PagePlaceholder"; // generic fallback
import ProtectedRoute from "./Authentication/ProtectedRoute";
import SignInPage from "./pages/SignInPage";

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
              path="/recipes/add"
              element={<PagePlaceholder title="Add Recipe" />}
            />
            <Route
              path="/recipes/styles"
              element={<PagePlaceholder title="Recipes by Style" />}
            />
            <Route
              path="/recipes/difficulty"
              element={<PagePlaceholder title="Recipes by Difficulty" />}
            />
            <Route
              path="/brew/start"
              element={<PagePlaceholder title="Start a Brew" />}
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
            <Route
              path="/community/events"
              element={<PagePlaceholder title="Events" />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
