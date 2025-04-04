"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 13+
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton";

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

const GuidePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
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
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back to Projects
      </Button>

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
          <div className="mb-4">
            <strong>Difficulty:</strong> {project.difficulty} <br />
            <strong>Estimated Time:</strong> {project.timeRequired} <br />
            <strong>Estimated Earnings:</strong> {project.estimatedEarnings} <br />
          </div>

          {project.guideContent && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Step-by-Step Guide</h3>
              <p>{project.guideContent}</p>
            </div>
          )}

          {project.videoUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tutorial Video</h3>
              <iframe
                className="w-full h-64 rounded-lg"
                src={project.videoUrl}
                title="Tutorial Video"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {project.projectLink && (
            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="block mt-4">
              <Button>View Full Project</Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidePage;
