import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-lg">
        <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <h1 className="text-3xl font-headline font-bold text-center">Search</h1>
        </header>
        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies or shows..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Search results will appear here.</p>
        </div>
      </div>
    </div>
  );
}
