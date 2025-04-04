// import { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { 
//   ArrowLeft, 
//   Clock, 
//   DollarSign, 
//   BarChart, 
//   ExternalLink,
//   Youtube,
//   Calendar,
//   AlertCircle,
//   Link as LinkIcon,
//   Zap,
//   Copy,
//   ChevronRight,
//   Sun,
//   Moon
// } from "lucide-react";
// import { toast } from "sonner";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

// interface Project {
//   id: string;
//   name?: string;
//   logo?: string;
//   description?: string;
//   difficulty?: string;
//   timeRequired?: string;
//   estimatedEarnings?: string;
//   type?: string;
//   guideContent?: string;
//   projectLink?: string;
//   videoUrl?: string;
//   sections?: string[];
//   duration?: string;
//   expiryDate?: string;
//   investmentRequired?: boolean;
//   investmentAmount?: string;
//   earningCapacity?: string;
//   timeConsuming?: string;
// }

// const Guide = () => {
//   const { id } = useParams<{ id: string }>();
//   const [project, setProject] = useState<Project | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//     const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

//   const projectData = useMemo(() => project, [project]);

//   useEffect(() => {
//     if (!id) return;
    
//     const fetchProject = async () => {
//       try {
//         setIsLoading(true);
//         const docRef = doc(db, "projects", id);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           // Ensure sections is always an array
//           const formattedData = {
//             ...data,
//             sections: Array.isArray(data.sections) ? data.sections : [],
//             guideContent: data.guideContent || ""
//           };
//           setProject({ id: docSnap.id, ...formattedData } as Project);
//         } else {
//           toast.error("Project guide not found");
//         }
//       } catch (error) {
//         toast.error("Error loading guide");
//         console.error("Error fetching project:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   useEffect(() => {
//     const previousPath = sessionStorage.getItem("previousPath") || "/earnmore";
//     sessionStorage.setItem("currentPath", location.pathname);
    
//     if (location.pathname !== previousPath) {
//       sessionStorage.setItem("previousPath", previousPath);
//     }

//     return () => {
//       sessionStorage.setItem(`scrollPosition-${location.pathname}`, window.scrollY.toString());
//     };
//   }, [location]);

//   const handleGoBack = () => {
//     const previousPath = sessionStorage.getItem("previousPath") || "/earnmore";
//     navigate(previousPath);

//     setTimeout(() => {
//       const savedPosition = sessionStorage.getItem(`scrollPosition-${previousPath}`);
//       if (savedPosition) {
//         window.scrollTo(0, parseInt(savedPosition));
//       }
//     }, 100);
//   };

//   // Theme handling
//     useEffect(() => {
//         if (theme === 'dark') {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//         localStorage.setItem('theme', theme);
//     }, [theme]);

//     const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

//     // Theme colors
//     const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-[#fafafa]';
//     const headerBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
//     const messageBgColor = theme === 'dark' ? 'bg-[#262626]' : 'bg-white';
//     const inputBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
//     const textColor = theme === 'dark' ? 'text-white' : 'text-black';
//     const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
//     const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';




//   const handleProjectLinkClick = () => {
//     if (!projectData?.projectLink) {
//       toast.error("Project link not available");
//       return;
//     }
    
//     try {
//       let url = projectData.projectLink.trim();
//       if (!url.startsWith('http://') && !url.startsWith('https://')) {
//         url = 'https://' + url;
//       }
//       new URL(url); // Validate URL
//       window.open(url, '_blank', 'noopener,noreferrer');
//     } catch (error) {
//       toast.error("Invalid project URL");
//       console.error("Invalid URL:", error);
//     }
//   };

//   const formatTextContent = (text: string = "") => {
//     // First split by double newlines to preserve paragraphs
//     const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim() !== '');
    
//     return paragraphs.map((paragraph, i) => {
//       // Check for markdown-style headers
//       if (paragraph.startsWith('# ')) {
//         return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{paragraph.substring(2).trim()}</h2>;
//       } 
//       else if (paragraph.startsWith('## ')) {
//         return <h3 key={i} className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">{paragraph.substring(3).trim()}</h3>;
//       }
      
//       // Handle bullet points (either - or *)
//       if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
//         const items = paragraph.split('\n').filter(item => item.trim() !== '');
//         return (
//           <ul key={i} className="ml-6 mb-4 space-y-2">
//             {items.map((item, idx) => (
//               <li key={idx} className="flex items-start">
//                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-2 flex-shrink-0"></span>
//                 <span className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{item.substring(2).trim()}</span>
//               </li>
//             ))}
//           </ul>
//         );
//       }
      
//       // Regular paragraph with preserved line breaks
//       return (
//         <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
//           {paragraph.trim()}
//         </p>
//       );
//     });
//   };

//   const renderSections = () => {
//     if (!projectData?.sections || projectData.sections.length === 0) {
//       return projectData?.guideContent ? (
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold dark:text-white">Step-by-Step Guide</h3>
//           <div className="prose max-w-none dark:prose-invert">
//             {formatTextContent(projectData.guideContent)}
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-8 rounded-lg bg-gray-50 dark:bg-gray-800/50">
//           <p className="text-gray-500 dark:text-gray-400">No guide content available</p>
//         </div>
//       );
//     }

//     return (


//       <div className="space-y-8">
//         {projectData.sections.map((item, index) => {
//           if (index % 2 === 0) {
//             const content = projectData.sections?.[index + 1] || "";
//             return (
//               <div key={index} className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-0.5"></div>
//                   <h3 className="text-lg font-semibold dark:text-white whitespace-pre-line">
//                     {item.trim()}
//                   </h3>
//                 </div>
//                 {content && (
//                   <div className="pl-5 prose max-w-none dark:prose-invert">
//                     {formatTextContent(content)}
//                   </div>
//                 )}
//               </div>
//             );
//           }
//           return null;
//         })}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <Skeleton className="h-10 w-32 mb-8" />
//         <div className="space-y-6">
//           <div className="flex gap-6">
//             <Skeleton className="h-24 w-24 rounded-xl" />
//             <div className="space-y-3 flex-1">
//               <Skeleton className="h-8 w-3/4" />
//               <Skeleton className="h-5 w-full" />
//               <Skeleton className="h-5 w-1/2" />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <Skeleton key={i} className="h-20 rounded-lg" />
//             ))}
//           </div>
//           <Skeleton className="h-96 w-full rounded-xl" />
//         </div>
//       </div>
//     );
//   }

//   if (!projectData) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <Button 
//           variant="ghost" 
//           className="mb-6 flex items-center gap-2 px-0 hover:bg-transparent" 
//           onClick={handleGoBack}
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Projects
//         </Button>
//         <Card className="text-center p-8 border-0 shadow-none bg-transparent">
//           <CardContent>
//             <div className="my-10 space-y-4">
//               <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
//               <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Project Not Available</h2>
//               <p className="text-gray-500 dark:text-gray-400">
//                 This project may have been removed or is currently unavailable.
//               </p>
//               <Button 
//                 variant="outline" 
//                 className="mt-4"
//                 onClick={handleGoBack}
//               >
//                 Return to Projects
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
    
//     <div className={`flex flex-col h-screen ${bgColor}`}>
//             <div className={`sticky top-0 z-10 ${headerBgColor} ${borderColor} border-b px-4 py-3 flex items-center justify-between`}>
// <div className="flex items-center space-x-4">
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => navigate(-1)}
//                         className="rounded-full"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>
//                     <h1 className={`font-semibold ${textColor}`}>Back</h1>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="rounded-full"
//                         onClick={toggleTheme}
//                         aria-label="Toggle theme"
//                     >
//                         {theme === 'light' ? (
//                             <Moon className="h-5 w-5" />
//                         ) : (
//                             <Sun className="h-5 w-5" />
//                         )}
//                     </Button>
// </div>
// </div>
      

//       <Card className="border-0 shadow-none bg-transparent">
//         <CardHeader className="pb-6 px-0">
//           <div className="flex flex-col sm:flex-row gap-6">
//             {projectData.logo && (
//               <div className="flex-shrink-0">
//                 <div className="w-24 h-24 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-2 flex items-center justify-center shadow-sm">
//                   <img 
//                     src={projectData.logo} 
//                     alt={projectData.name} 
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                       const parent = e.currentTarget.parentElement;
//                       if (parent) {
//                         parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400">No Logo</div>';
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 flex-wrap">
//                 <CardTitle className="dark:text-white text-2xl font-bold tracking-tight">
//                   {projectData.name || "Unnamed Project"}
//                 </CardTitle>
//                 {projectData.type && (
//                   <Badge variant="secondary" className="dark:border-gray-700 dark:text-gray-300">
//                     {projectData.type}
//                   </Badge>
//                 )}
//               </div>
//               <CardDescription className="dark:text-gray-400 text-base whitespace-pre-line">
//                 {projectData.description || "No description available"}
//               </CardDescription>
              
//               <div className="flex flex-wrap gap-3">
//                 {projectData.difficulty && (
//                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
//                     <BarChart className="w-4 h-4 text-primary" />
//                     <span>{projectData.difficulty}</span>
//                   </div>
//                 )}
//                 {projectData.timeRequired && (
//                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
//                     <Clock className="w-4 h-4 text-primary" />
//                     <span>{projectData.timeRequired}</span>
//                   </div>
//                 )}
//                 {projectData.estimatedEarnings && (
//                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
//                     <DollarSign className="w-4 h-4 text-primary" />
//                     <span>{projectData.estimatedEarnings}</span>
//                   </div>
//                 )}
//                 {projectData.expiryDate && (
//                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
//                     <Calendar className="w-4 h-4 text-primary" />
//                     <span>{projectData.expiryDate}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <Separator className="my-8 dark:bg-gray-700" />

//         <CardContent className="px-0">
//           {renderSections()}

//           {projectData.videoUrl && (
//             <div className="mt-12 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold flex items-center gap-3 dark:text-white">
//                   <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
//                   <span>Video Tutorial</span>
//                 </h3>
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={() => {
//                     navigator.clipboard.writeText(projectData.videoUrl || '');
//                     toast.success("Video link copied to clipboard");
//                   }}
//                   className="flex items-center gap-2 text-muted-foreground"
//                 >
//                   <Copy className="w-4 h-4" />
//                   Copy Link
//                 </Button>
//               </div>
//               <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-xl border dark:border-gray-700 shadow-sm">
//                 <VideoPlayer url={projectData.videoUrl} title={projectData.name || "Project Tutorial"} />
//               </div>
//             </div>
//           )}

//           {projectData.projectLink && (
//             <div className="mt-12">
//               <Button 
//                 onClick={handleProjectLinkClick}
//                 className="flex items-center gap-2 px-6 py-5 w-full sm:w-auto justify-between sm:justify-start"
//                 size="lg"
//               >
//                 <div className="flex items-center gap-3">
//                   <LinkIcon className="w-5 h-5" />
//                   <span>Visit Project Website</span>
//                 </div>
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// const VideoPlayer = ({ url, title }: { url: string; title: string }) => {
//   const [error, setError] = useState<string | null>(null);
  
//   const getYouTubeId = (url: string) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const videoId = getYouTubeId(url);
//   if (!videoId) {
//     return (
//       <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
//         <AlertCircle className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
//         <p className="text-gray-700 dark:text-gray-300 mb-3">
//           Video unavailable
//         </p>
//         <a 
//           href={url} 
//           target="_blank" 
//           rel="noopener noreferrer" 
//           className="text-primary hover:underline inline-flex items-center gap-1"
//         >
//           <ExternalLink className="w-4 h-4" /> Open in new tab
//         </a>
//       </div>
//     );
//   }

//   const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`;

//   return (
//     <iframe
//       className="w-full h-full min-h-[400px] rounded-lg"
//       src={embedUrl}
//       title={`${title} Tutorial`}
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen
//       onError={() => setError("Failed to load video. Please try the direct link.")}
//     />
//   );
// };

// export default Guide;







import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  BarChart, 
  ExternalLink,
  Youtube,
  Calendar,
  AlertCircle,
  Link as LinkIcon,
  Zap,
  Copy,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name?: string;
  logo?: string;
  description?: string;
  difficulty?: string;
  timeRequired?: string;
  estimatedEarnings?: string;
  type?: string;
  guideContent?: string;
  projectLink?: string;
  videoUrl?: string;
  sections?: string[];
  duration?: string;
  expiryDate?: string;
  investmentRequired?: boolean;
  investmentAmount?: string;
  earningCapacity?: string;
  timeConsuming?: string;
}

const Guide = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const projectData = useMemo(() => project, [project]);
  const navigate = useNavigate();
  const location = useLocation();

  // Store scroll position when` leaving the page
  useEffect(() => {
    return () => {
      sessionStorage.setItem(`scrollPosition-${location.pathname}`, window.scrollY.toString());
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formattedData = {
            ...data,
            sections: Array.isArray(data.sections) ? data.sections : [],
            guideContent: data.guideContent || ""
          };
          setProject({ id: docSnap.id, ...formattedData } as Project);
        } else {
          toast.error("Project guide not found");
        }
      } catch (error) {
        toast.error("Error loading guide");
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const previousPath = sessionStorage.getItem("previousPath") || "/earnmore";
    sessionStorage.setItem("currentPath", location.pathname);
    
    if (location.pathname !== previousPath) {
      sessionStorage.setItem("previousPath", previousPath);
    }

    return () => {
      sessionStorage.setItem(`scrollPosition-${location.pathname}`, window.scrollY.toString());
    };
  }, [location]);

  // Theme handling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Fixed back button handler
  const handleGoBack = () => {
    const previousPath = sessionStorage.getItem("previousPath") || "/earnmore";
    const scrollPosition = sessionStorage.getItem(`scrollPosition-${previousPath}`) || 0;
    
    navigate(previousPath, {
      state: { from: location.pathname }, // Pass current location as state
    });

    // Restore scroll position after navigation
    setTimeout(() => {
      window.scrollTo(0, parseInt(scrollPosition.toString()));
    }, 50);
  };

  // Update previous path when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = sessionStorage.getItem("currentPath") || "/earnmore";
    
    if (currentPath !== previousPath) {
      sessionStorage.setItem("previousPath", previousPath);
      sessionStorage.setItem("currentPath", currentPath);
    }
  }, [location]);
  

  const handleProjectLinkClick = () => {
    if (!projectData?.projectLink) {
      toast.error("Project link not available");
      return;
    }
    
    try {
      let url = projectData.projectLink.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      new URL(url); // Validate URL
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error("Invalid project URL");
      console.error("Invalid URL:", error);
    }
  };

  const formatTextContent = (text: string = "") => {
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim() !== '');
    
    return paragraphs.map((paragraph, i) => {
      if (paragraph.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{paragraph.substring(2).trim()}</h2>;
      } 
      else if (paragraph.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">{paragraph.substring(3).trim()}</h3>;
      }
      
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        const items = paragraph.split('\n').filter(item => item.trim() !== '');
        return (
          <ul key={i} className="ml-6 mb-4 space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-2 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{item.substring(2).trim()}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      return (
        <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {paragraph.trim()}
        </p>
      );
    });
  };

  const renderSections = () => {
    if (!projectData?.sections || projectData.sections.length === 0) {
      return projectData?.guideContent ? (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Step-by-Step Guide</h3>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none dark:prose-invert">
              {formatTextContent(projectData.guideContent)}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No guide content available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-8">
            {projectData.sections.map((item, index) => {
              if (index % 2 === 0) {
                const content = projectData.sections?.[index + 1] || "";
                return (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-0.5"></div>
                      <h3 className="text-lg font-semibold dark:text-white whitespace-pre-line">
                        {item.trim()}
                      </h3>
                    </div>
                    {content && (
                      <div className="pl-5 prose max-w-none dark:prose-invert">
                        {formatTextContent(content)}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    const stats = [
      { icon: <BarChart className="w-4 h-4" />, value: projectData?.difficulty, label: "Difficulty" },
      { icon: <Clock className="w-4 h-4" />, value: projectData?.timeRequired, label: "Time Required" },
      { icon: <DollarSign className="w-4 h-4" />, value: projectData?.estimatedEarnings, label: "Estimated Earnings" },
      { icon: <Calendar className="w-4 h-4" />, value: projectData?.expiryDate, label: "Expiry Date" },
    ].filter(stat => stat.value);

    if (stats.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                {stat.icon}
              </div>
              <p className="font-medium">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="space-y-6">
          <div className="flex gap-6">
            <Skeleton className="h-24 w-24 rounded-xl" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 px-0 hover:bg-transparent" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
        <Card className="text-center">
          <CardContent className="py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Project Not Available</h2>
            <p className="text-muted-foreground mb-6">
              This project may have been removed or is currently unavailable.
            </p>
            <Button onClick={handleGoBack}>Return to Projects</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Project Guide</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row gap-6">
            {projectData.logo && (
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-2 flex items-center justify-center shadow-sm">
                  <img 
                    src={projectData.logo} 
                    alt={projectData.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400">No Logo</div>';
                      }
                    }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {projectData.name || "Unnamed Project"}
                </CardTitle>
                {projectData.type && (
                  <Badge variant="secondary">
                    {projectData.type}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base whitespace-pre-line">
                {projectData.description || "No description available"}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {renderStats()}
        {renderSections()}

        {projectData.videoUrl && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span>Video Tutorial</span>
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(projectData.videoUrl || '');
                    toast.success("Video link copied to clipboard");
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
                <VideoPlayer url={projectData.videoUrl} title={projectData.name || "Project Tutorial"} />
              </div>
            </CardContent>
          </Card>
        )}

        {projectData.projectLink && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <Button 
                onClick={handleProjectLinkClick}
                className="w-full"
                size="lg"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Visit Project Website
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

const VideoPlayer = ({ url, title }: { url: string; title: string }) => {
  const [error, setError] = useState<string | null>(null);
  
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  if (!videoId) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
        <AlertCircle className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Video unavailable
        </p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" /> Open in new tab
        </a>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`;

  return (
    <iframe
      className="w-full h-full min-h-[400px] rounded-lg"
      src={embedUrl}
      title={`${title} Tutorial`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      onError={() => setError("Failed to load video. Please try the direct link.")}
    />
  );
};

export default Guide;