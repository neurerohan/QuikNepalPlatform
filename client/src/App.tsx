import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Import existing pages
import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import DateConverter from "@/pages/DateConverter";
import Vegetables from "@/pages/Vegetables";
import Metals from "@/pages/Metals";
import Rashifal from "@/pages/Rashifal";
import Forex from "@/pages/Forex";

// Import new Sanity CMS pages
import News from "@/pages/News";
import Article from "@/pages/Article";
import Category from "@/pages/Category";
import Author from "@/pages/Author";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Calendar routes */}
      <Route path="/nepali-calendar/:year/:month" component={Calendar} />
      <Route path="/nepali-calendar" component={Calendar} />
      <Route path="/calendar/:year/:month" component={Calendar} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/nepalicalendar/:year/:month" component={Calendar} />
      <Route path="/nepalicalendar" component={Calendar} />
      
      {/* Main feature URLs */}
      <Route path="/nepali-date-converter" component={DateConverter} />
      <Route path="/kalimati-vegetable-price" component={Vegetables} />
      <Route path="/gold-and-silver-in-nepal" component={Metals} />
      <Route path="/nepali-rashifal" component={Rashifal} />
      <Route path="/foreign-currency-exchange" component={Forex} />
      
      {/* Sanity CMS blog routes */}
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={Article} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/author/:slug" component={Author} />
      
      {/* Legacy URLs for backward compatibility */}
      <Route path="/date-converter" component={DateConverter} />
      <Route path="/vegetables" component={Vegetables} />
      <Route path="/metals" component={Metals} />
      <Route path="/rashifal" component={Rashifal} />
      <Route path="/forex" component={Forex} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
