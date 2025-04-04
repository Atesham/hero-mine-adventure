import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { Clock } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: string;
  name?: string;
  logo?: string;
  description?: string;
  difficulty?: string;
  timeRequired?: string;
  estimatedEarnings?: string;
  type?: string; 
}

// ✅ Define the props type
interface ProjectListProps {
  activeFilter: string;
}

// ✅ Use ProjectListProps for type safety
const ProjectList: React.FC<ProjectListProps> = ({ activeFilter }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ✅ Loading state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects from Firestore...");
        const querySnapshot = await getDocs(collection(db, "projects"));
        const fetchedProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        
        console.log("Fetched projects:", fetchedProjects);
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false); // ✅ Stop loading after fetching
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    console.log(`Filtering projects by: ${activeFilter}`);
    if (activeFilter === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) => p.type === activeFilter);
      console.log("Filtered projects:", filtered);
      setFilteredProjects(filtered);
    }
  }, [activeFilter, projects]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        // ✅ Show skeleton loaders while loading
        [...Array(3)].map((_, index) => (
          <Card key={index} className="border rounded-lg shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" /> {/* Placeholder for logo */}
                <div>
                  <Skeleton className="w-40 h-5 mb-2" /> {/* Placeholder for name */}
                  <Skeleton className="w-64 h-4" /> {/* Placeholder for description */}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-4" /> {/* Placeholder for timeRequired */}
                <Skeleton className="w-24 h-6" /> {/* Placeholder for button */}
              </div>
            </CardContent>
          </Card>
        ))
      ) : filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <Card key={project.id} className="border rounded-lg shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                {/* ✅ Show logo if available */}
                {project.logo && (
                  <img
                    src={project.logo}
                    className="w-12 h-12 rounded-lg object-contain border"
                    alt={project.name || "Project Logo"}
                  />
                )}
                <div>
                  {/* ✅ Show name if available */}
                  {project.name && (
                    <CardTitle className="flex items-center gap-2">
                      {project.name}
                      {/* ✅ Show difficulty if available */}
                      {project.difficulty && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : project.difficulty === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {project.difficulty}
                        </span>
                      )}
                    </CardTitle>
                  )}
                  {/* ✅ Show description if available */}
                  {project.description && <CardDescription>{project.description}</CardDescription>}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* ✅ Show timeRequired if available */}
                  {project.timeRequired && (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{project.timeRequired}</span>
                      <span>•</span>
                    </>
                  )}
                  {/* ✅ Show estimatedEarnings if available */}
                  {project.estimatedEarnings && (
                    <span className="font-medium text-green-600">{project.estimatedEarnings}</span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => console.log(`View project: ${project.id}`)}>
                  View Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects available</p>
        </div>
      )}
    </div>
  );
};

// ✅ Ensure ProjectList is exported correctly
export default ProjectList;
