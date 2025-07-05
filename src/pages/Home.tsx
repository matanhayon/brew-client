import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Share2, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* Hero Section */}
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Brew to the Future
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Discover, share, and brew your favorite beers - all in one futuristic
          hub.
        </p>
      </header>

      {/* Menu Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Browse Recipes */}
        <Card className="flex flex-col items-center p-10 text-center space-y-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <BookOpen className="text-primary" size={48} />
          <h2 className="text-2xl font-semibold">Browse Recipes</h2>
          <p className="text-muted-foreground max-w-sm flex-grow">
            Explore a curated collection of beer recipes shared by brewers
            worldwide.
          </p>
          <Link to="/community/recipes" className="w-full max-w-xs">
            <Button className="w-full h-12">Explore Recipes</Button>
          </Link>
        </Card>

        {/* Share Recipe */}
        <Card className="flex flex-col items-center p-10 text-center space-y-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Share2 className="text-primary" size={48} />
          <h2 className="text-2xl font-semibold">Share Your Recipe</h2>
          <p className="text-muted-foreground max-w-sm flex-grow">
            Have a unique brew? Share your recipe and inspire the community.
          </p>
          <Link to="/dashboard/build-recipe" className="w-full max-w-xs">
            <Button className="w-full h-12">Build Recipe</Button>
          </Link>
        </Card>

        {/* Brew Embedded */}
        <Card className="flex flex-col items-center p-10 text-center space-y-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Settings className="text-primary" size={48} />
          <h2 className="text-2xl font-semibold">Brew (Embedded)</h2>
          <p className="text-muted-foreground max-w-sm flex-grow">
            Track your brewing progress step-by-step with built-in tools.
          </p>
          <Link to="/dashboard" className="w-full max-w-xs">
            <Button className="w-full h-12">Start Brewing</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default Home;
