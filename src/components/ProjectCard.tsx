// components/ProjectCard.tsx
import { ChevronRight, Clock } from "lucide-react";
import { Button } from "./ui/button";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-card rounded-xl border p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <img 
          src={project.logo} 
          className="w-12 h-12 rounded-lg object-contain border"
          alt={project.name}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{project.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.difficulty === 'Easy' 
                ? 'bg-green-100 text-green-800' 
                : project.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {project.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {project.timeRequired}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View Guide <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}