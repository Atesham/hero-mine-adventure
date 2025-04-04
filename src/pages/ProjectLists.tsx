
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from "lucide-react";

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

interface ProjectListProps {
  activeFilter: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ activeFilter }) => {
  // const router = useRouter(); // ✅ Initialize useRouter here

  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const fetchedProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) => p.type === activeFilter);
      setFilteredProjects(filtered);
    }
  }, [activeFilter, projects]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        [...Array(3)].map((_, index) => (
          <Card key={index} className="border rounded-lg shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div>
                  <Skeleton className="w-40 h-5 mb-2" />
                  <Skeleton className="w-64 h-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-6" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <Card key={project.id} className="border rounded-lg shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                {project.logo && (
                  <img
                    src={project.logo}
                    className="w-12 h-12 rounded-lg object-contain border"
                    alt={project.name || "Project Logo"}
                  />
                )}
                <div>
                  {project.name && (
                    <CardTitle className="flex items-center gap-2">
                      {project.name}
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
                  {project.description && <CardDescription>{project.description}</CardDescription>}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {project.timeRequired && (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{project.timeRequired}</span>
                      <span>•</span>
                    </>
                  )}
                  {project.estimatedEarnings && (
                    <span className="font-medium text-green-600">{project.estimatedEarnings}</span>
                  )}
                </div> 
                <Button variant="outline" size="sm" onClick={() => console.log(`View project ${project.id}`)}>
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

export default ProjectList;
