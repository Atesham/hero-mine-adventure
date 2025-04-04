
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, DollarSign, BarChart } from "lucide-react";

interface Project {
  id: string;
  name?: string;
  logo?: string;
  description?: string;
  difficulty?: string;
  timeRequired?: string;
  estimatedEarnings?: string;
  type?: string;
  guideContent?: string;  // Assuming guide content is stored in Firestore
  projectLink?: string;   // Project link (GitHub, website, etc.)
  videoUrl?: string;      // YouTube or demo video
}

const Guide = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          console.error("Project not found!");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (!project) {
    return <p className="text-center text-gray-500 mt-10">Project not found</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/earnmore">
        <Button variant="outline" className="mb-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </Link>

      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {project.logo && (
              <img src={project.logo} alt={project.name} className="w-16 h-16 rounded-lg border object-contain" />
            )}
            <div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
              <BarChart className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Difficulty</p>
                <p className="font-medium">{project.difficulty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Time Required</p>
                <p className="font-medium">{project.timeRequired}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Est. Earnings</p>
                <p className="font-medium">{project.estimatedEarnings}</p>
              </div>
            </div>
          </div>

          {project.guideContent && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">Step-by-Step Guide</h3>
              <div className="prose max-w-none">
                {project.guideContent.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {project.videoUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tutorial Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-64 rounded-lg"
                  src={project.videoUrl}
                  title="Tutorial Video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {project.projectLink && (
            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="block mt-4">
              <Button className="w-full sm:w-auto">View Full Project</Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Guide;
