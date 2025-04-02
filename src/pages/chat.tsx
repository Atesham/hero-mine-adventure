// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Separator } from "../components/ui/separator";
// import {
//     collection, addDoc, query, orderBy, onSnapshot,
//     Timestamp, serverTimestamp, doc, setDoc
// } from "firebase/firestore";
// import app, { auth, db, storage } from '../lib/firebase';

// import {
//     Send, AlertCircle, SmilePlus, Paperclip,
//     ThumbsUp, MessageSquare, Mic
// } from "lucide-react";
// import { toast } from "sonner";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import EmojiPicker from "emoji-picker-react";
// import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
// import { Badge } from "../components/ui/badge";
// import { Skeleton } from "../components/ui/skeleton";

// type Message = {
//     id: string;
//     text: string;
//     uid: string;
//     displayName: string;
//     photoURL: string | null;
//     createdAt: Timestamp;
//     reactions?: Record<string, string[]>; // { "👍": ["user1", "user2"] }
//     replyTo?: string; // ID of the message being replied to
//     attachmentURL?: string;
//     attachmentType?: 'image' | 'video' | 'file';
// };

// type OnlineUser = {
//     uid: string;
//     lastSeen: Timestamp;
//     displayName: string;
//     photoURL: string | null;
// };

// const Chat = () => {
//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const navigate = useNavigate();
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//     const [attachment, setAttachment] = useState<File | null>(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const endOfMessagesRef = useRef<HTMLDivElement>(null);
//     const messagesContainerRef = useRef<HTMLDivElement>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     //   const isMobile = useMediaQuery("(max-width: 768px)");

//     // Get current user
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user);
//             if (!user) {
//                 toast.error("Please log in to access the chat feature");
//                 navigate("/login");
//             } else {
//                 // Update user's online status
//                 const userStatusRef = doc(db, "status", user.uid);
//                 setDoc(userStatusRef, {
//                     status: "online",
//                     lastSeen: serverTimestamp(),
//                     displayName: user.displayName || "Anonymous",
//                     photoURL: user.photoURL
//                 }, { merge: true });
//             }
//         });
//         return () => unsubscribe();
//     }, [navigate]);

//     // Track online users
//     useEffect(() => {
//         if (!currentUser) return;

//         const statusRef = collection(db, "status");
//         const q = query(statusRef);

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const users: OnlineUser[] = [];
//             snapshot.forEach((doc) => {
//                 const data = doc.data();
//                 if (data.status === "online") {
//                     users.push({
//                         uid: doc.id,
//                         lastSeen: data.lastSeen,
//                         displayName: data.displayName,
//                         photoURL: data.photoURL
//                     });
//                 }
//             });
//             setOnlineUsers(users);
//         });

//         return () => unsubscribe();
//     }, [currentUser]);

//     // Fetch messages
//     useEffect(() => {
//         if (!currentUser) return;

//         setLoading(true);
//         const messagesRef = collection(db, "messages");
//         const q = query(messagesRef, orderBy("createdAt", "asc"));

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetchedMessages = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             })) as Message[];

//             setMessages(fetchedMessages);
//             setLoading(false);
//             scrollToBottom();
//         });

//         return () => unsubscribe();
//     }, [currentUser]);

//     const scrollToBottom = useCallback(() => {
//         endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, []);

//     const handleScroll = () => {
//         if (messagesContainerRef.current) {
//             const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
//             const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
//             if (isNearBottom) {
//                 scrollToBottom();
//             }
//         }
//     };

//     const sendMessage = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if ((!message.trim() && !attachment) || !currentUser) return;

//         try {
//             let attachmentURL = '';
//             let attachmentType: 'image' | 'video' | 'file' | undefined = undefined;

//             // Upload attachment if exists
//             if (attachment) {
//                 const storageRef = ref(storage, `attachments/${currentUser.uid}/${Date.now()}_${attachment.name}`);
//                 await uploadBytes(storageRef, attachment);
//                 attachmentURL = await getDownloadURL(storageRef);

//                 if (attachment.type.startsWith('image/')) {
//                     attachmentType = 'image';
//                 } else if (attachment.type.startsWith('video/')) {
//                     attachmentType = 'video';
//                 } else {
//                     attachmentType = 'file';
//                 }
//             }

//             const messagesRef = collection(db, "messages");
//             await addDoc(messagesRef, {
//                 text: message.trim(),
//                 uid: currentUser.uid,
//                 displayName: currentUser.displayName || "Anonymous User",
//                 photoURL: currentUser.photoURL,
//                 createdAt: serverTimestamp(),
//                 replyTo: replyingTo?.id || null,
//                 ...(attachmentURL && { attachmentURL, attachmentType }),
//             });

//             setMessage("");
//             setReplyingTo(null);
//             setAttachment(null);
//             scrollToBottom();
//         } catch (error) {
//             console.error("Error sending message:", error);
//             toast.error("Failed to send message. Please try again.");
//         }
//     };

//     const addReaction = async (messageId: string, reaction: string) => {
//         if (!currentUser) return;

//         try {
//             const messageRef = doc(db, "messages", messageId);
//             const reactionKey = `reactions.${reaction}`;

//             await setDoc(messageRef, {
//                 [reactionKey]: [...(messages.find(m => m.id === messageId)?.reactions?.[reaction] || []), currentUser.uid]
//             }, { merge: true });
//         } catch (error) {
//             console.error("Error adding reaction:", error);
//             toast.error("Failed to add reaction");
//         }
//     };

//     const formatTime = (timestamp: Timestamp) => {
//         if (!timestamp) return "";

//         const date = timestamp.toDate();
//         return new Intl.DateTimeFormat('en-US', {
//             hour: '2-digit',
//             minute: '2-digit',
//         }).format(date);
//     };

//     const formatDate = (timestamp: Timestamp) => {
//         if (!timestamp) return "";

//         const date = timestamp.toDate();
//         return new Intl.DateTimeFormat('en-US', {
//             weekday: 'long',
//             month: 'short',
//             day: 'numeric',
//         }).format(date);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setAttachment(e.target.files[0]);
//         }
//     };

//     const startRecording = () => {
//         // Implement voice recording logic
//         setIsRecording(true);
//         toast.info("Voice recording started");
//     };

//     const stopRecording = () => {
//         setIsRecording(false);
//         toast.info("Voice recording stopped");
//         // Implement sending voice message
//     };

//     const renderAttachmentPreview = () => {
//         if (!attachment) return null;

//         if (attachment.type.startsWith('image/')) {
//             return (
//                 <div className="relative mb-2 max-w-[200px]">
//                     <img
//                         src={URL.createObjectURL(attachment)}
//                         alt="Attachment preview"
//                         className="rounded-lg border"
//                     />
//                     <button
//                         onClick={() => setAttachment(null)}
//                         className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
//                     >
//                         ×
//                     </button>
//                 </div>
//             );
//         }

//         return (
//             <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded-lg">
//                 <Paperclip className="h-4 w-4" />
//                 <span className="truncate max-w-[150px]">{attachment.name}</span>
//                 <button
//                     onClick={() => setAttachment(null)}
//                     className="ml-auto text-destructive"
//                 >
//                     ×
//                 </button>
//             </div>
//         );
//     };

//     if (!currentUser) {
//         return (
//             <div className="flex flex-col items-center justify-center h-[80vh] p-4">
//                 <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
//                 <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
//                 <p className="text-center mb-4">Please log in to access the chat feature</p>
//                 <Button onClick={() => navigate("/login")}>Go to Login</Button>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-4xl mx-auto px-4 pb-20">
//             <div className="flex items-center justify-between py-4">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold">Community Chat</h1>
//                     <p className="text-sm text-muted-foreground">
//                         {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} online
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     {onlineUsers.slice(0, 3).map(user => (
//                         <Avatar key={user.uid} className="h-8 w-8 border-2 border-green-500">
//                             <AvatarImage src={user.photoURL || undefined} />
//                             <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
//                         </Avatar>
//                     ))}
//                     {onlineUsers.length > 3 && (
//                         <Badge variant="outline" className="rounded-full">
//                             +{onlineUsers.length - 3}
//                         </Badge>
//                     )}
//                 </div>
//             </div>

//             <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-[70vh] flex flex-col">
//                 {/* Messages container */}
//                 <div
//                     ref={messagesContainerRef}
//                     onScroll={handleScroll}
//                     className="flex-1 overflow-y-auto p-4 space-y-4"
//                 >
//                     {loading ? (
//                         <div className="space-y-4">
//                             {[...Array(5)].map((_, i) => (
//                                 <div key={i} className="flex items-start gap-3">
//                                     <Skeleton className="h-8 w-8 rounded-full" />
//                                     <div className="space-y-2">
//                                         <Skeleton className="h-4 w-[100px]" />
//                                         <Skeleton className="h-12 w-[200px]" />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : messages.length === 0 ? (
//                         <div className="flex justify-center items-center h-full text-center text-muted-foreground">
//                             <div>
//                                 <p className="mb-2">No messages yet</p>
//                                 <p>Be the first to start the conversation!</p>
//                             </div>
//                         </div>
//                     ) : (
//                         messages.map((msg, index) => {
//                             // Check if we should show date separator
//                             const showDateSeparator = index === 0 ||
//                                 !messages[index - 1].createdAt ||
//                                 !msg.createdAt ||
//                                 messages[index - 1].createdAt.toDate().getDate() !== msg.createdAt.toDate().getDate();

//                             return (
//                                 <React.Fragment key={msg.id}>
//                                     {showDateSeparator && (
//                                         <div className="flex items-center my-4">
//                                             <Separator className="flex-1" />
//                                             <span className="px-3 text-xs text-muted-foreground">
//                                                 {formatDate(msg.createdAt)}
//                                             </span>
//                                             <Separator className="flex-1" />
//                                         </div>
//                                     )}

//                                     <div className={`flex gap-2 ${msg.uid === currentUser.uid ? 'justify-end' : 'justify-start'}`}>

//                                         {msg.uid !== currentUser.uid && (
//                                             <Avatar className="h-8 w-8">
//                                                 <AvatarImage src={msg.photoURL || undefined} />
//                                                 <AvatarFallback>{msg.displayName?.charAt(0) || 'U'}</AvatarFallback>
//                                             </Avatar>
//                                         )}

//                                         <div className={`max-w-[85%] flex flex-col ${msg.uid === currentUser.uid ? 'items-end' : 'items-start'}`}>
//                                             {msg.replyTo && (
//                                                 <div className="text-xs text-muted-foreground mb-1 px-2 py-1 bg-muted rounded w-full">
//                                                     Replying to: {messages.find(m => m.id === msg.replyTo)?.text || 'deleted message'}
//                                                 </div>
//                                             )}

//                                             <div
//                                                 className={`${msg.uid === currentUser.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'} px-3 py-2 rounded-lg`}
//                                             >
//                                                 {msg.uid !== currentUser.uid && (
//                                                     <p className="text-xs font-medium">{msg.displayName}</p>
//                                                 )}

//                                                 {msg.text && <p className="break-words">{msg.text}</p>}

//                                                 {msg.attachmentURL && (
//                                                     <div className="mt-2">
//                                                         {msg.attachmentType === 'image' ? (
//                                                             <img
//                                                                 src={msg.attachmentURL}
//                                                                 alt="Attachment"
//                                                                 className="max-w-[200px] max-h-[200px] rounded-lg border"
//                                                             />
//                                                         ) : msg.attachmentType === 'video' ? (
//                                                             <video controls className="max-w-[200px]">
//                                                                 <source src={msg.attachmentURL} type="video/mp4" />
//                                                             </video>
//                                                         ) : (
//                                                             <a
//                                                                 href={msg.attachmentURL}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="flex items-center gap-2 p-2 bg-background rounded-lg"
//                                                             >
//                                                                 <Paperclip className="h-4 w-4" />
//                                                                 <span>Download file</span>
//                                                             </a>
//                                                         )}
//                                                     </div>
//                                                 )}

//                                                 <div className="flex items-center justify-between mt-1">
//                                                     <p className="text-xs opacity-70">
//                                                         {formatTime(msg.createdAt)}
//                                                     </p>

//                                                     <div className="flex gap-1 ml-2">
//                                                         {msg.reactions && Object.entries(msg.reactions).map(([reaction, users]) => (
//                                                             <button
//                                                                 key={reaction}
//                                                                 onClick={() => addReaction(msg.id, reaction)}
//                                                                 className={`text-xs px-1 rounded ${users.includes(currentUser.uid) ? 'bg-primary/20' : 'bg-muted'}`}
//                                                             >
//                                                                 {reaction} {users.length > 1 ? users.length : ''}
//                                                             </button>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex gap-1 mt-1">
//                                                 <button
//                                                     onClick={() => addReaction(msg.id, "👍")}
//                                                     className="text-xs p-1 rounded-full hover:bg-muted"
//                                                 >
//                                                     <ThumbsUp className="h-3 w-3" />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setReplyingTo(msg)}
//                                                     className="text-xs p-1 rounded-full hover:bg-muted"
//                                                 >
//                                                     <MessageSquare className="h-3 w-3" />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {msg.uid === currentUser.uid && (
//                                             <Avatar className="h-8 w-8">
//                                                 <AvatarImage src={msg.photoURL || undefined} />
//                                                 <AvatarFallback>{msg.displayName?.charAt(0) || 'U'}</AvatarFallback>
//                                             </Avatar>
//                                         )}
//                                     </div>
//                                 </React.Fragment>
//                             );
//                         })
//                     )}
//                     <div ref={endOfMessagesRef} />
//                 </div>

//                 <Separator />

//                 {/* Reply preview */}
//                 {replyingTo && (
//                     <div className="flex items-center justify-between px-4 py-2 bg-muted">
//                         <div className="text-sm text-muted-foreground">
//                             Replying to: {replyingTo.text.substring(0, 30)}{replyingTo.text.length > 30 ? '...' : ''}
//                         </div>
//                         <button
//                             onClick={() => setReplyingTo(null)}
//                             className="text-destructive"
//                         >
//                             ×
//                         </button>
//                     </div>
//                 )}

//                 {/* Attachment preview */}
//                 {attachment && renderAttachmentPreview()}

//                 {/* Message input */}
//                 <form onSubmit={sendMessage} className="p-4">
//                     <div className="flex gap-2">
//                         <input
//                             placeholder="Upload a file..."
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             className="hidden"
//                             accept="image/*,video/*,.pdf,.doc,.docx"
//                         />

//                         <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//                             <PopoverTrigger asChild>
//                                 <Button type="button" variant="ghost" size="icon">
//                                     <SmilePlus className="h-4 w-4" />
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0">
//                                 <EmojiPicker
//                                     onEmojiClick={(emojiData) => {
//                                         setMessage(prev => prev + emojiData.emoji);
//                                         setShowEmojiPicker(false);
//                                     }}
//                                     //   width={isMobile ? 300 : 350}
//                                     height={350}
//                                 />
//                             </PopoverContent>
//                         </Popover>

//                         <Button
//                             type="button"
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => fileInputRef.current?.click()}
//                         >
//                             <Paperclip className="h-4 w-4" />
//                         </Button>

//                         <Input
//                             type="text"
//                             placeholder="Type your message..."
//                             value={message}
//                             onChange={(e) => setMessage(e.target.value)}
//                             className="flex-1"
//                         />

//                         {isRecording ? (
//                             <Button
//                                 type="button"
//                                 variant="destructive"
//                                 onClick={stopRecording}
//                             >
//                                 <Mic className="h-4 w-4 animate-pulse" />
//                             </Button>
//                         ) : (
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={startRecording}
//                             >
//                                 <Mic className="h-4 w-4" />
//                             </Button>
//                         )}

//                         <Button type="submit" disabled={!message.trim() && !attachment}>
//                             <Send className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Chat;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Theme as EmojiTheme } from 'emoji-picker-react';

import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    collection, addDoc, query, orderBy, onSnapshot,
    Timestamp, serverTimestamp, doc, setDoc
} from "firebase/firestore";
import { auth, db, storage } from '../lib/firebase';
import {
    Send, SmilePlus, Paperclip, Mic, ChevronDown,
    ArrowLeft, X, Image, Video, File, Moon, Sun
} from "lucide-react";
import { toast } from "sonner";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Badge } from "../components/ui/badge";


type Message = {
    id: string;
    text: string;
    uid: string;
    displayName: string;
    photoURL: string | null;
    createdAt: Timestamp;
    reactions?: Record<string, string[]>;
    replyTo?: string;
    attachmentURL?: string;
    attachmentType?: 'image' | 'video' | 'file';
};

type OnlineUser = {
    uid: string;
    displayName: string;
    photoURL: string | null;
};

const Chat = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Add this useEffect to handle keyboard events
useEffect(() => {
    const handleFocus = () => {
      document.body.classList.add('keyboard-open');
      scrollToBottom('auto');
    };
  
    const handleBlur = () => {
      document.body.classList.remove('keyboard-open');
    };
  
    const input = document.querySelector('input[type="text"]');
    input?.addEventListener('focus', handleFocus);
    input?.addEventListener('blur', handleBlur);
  
    return () => {
      input?.removeEventListener('focus', handleFocus);
      input?.removeEventListener('blur', handleBlur);
    };
  }, []);

    // Set theme on component mount and when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Determine background colors based on theme
    const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-[#fafafa]';
    const headerBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
    const messageBgColor = theme === 'dark' ? 'bg-[#262626]' : 'bg-white';
    const inputBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-black';
    const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    // Auth state and online status
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                navigate("/login");
                return;
            }

            // Update online status
            const userStatusRef = doc(db, "status", user.uid);
            setDoc(userStatusRef, {
                status: "online",
                lastSeen: serverTimestamp(),
                displayName: user.displayName || "Anonymous",
                photoURL: user.photoURL
            }, { merge: true });
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    // Track online users
    useEffect(() => {
        if (!currentUser) return;

        const statusRef = collection(db, "status");
        const unsubscribeStatus = onSnapshot(statusRef, (snapshot) => {
            const users: OnlineUser[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === "online") {
                    users.push({
                        uid: doc.id,
                        displayName: data.displayName,
                        photoURL: data.photoURL
                    });
                }
            });
            setOnlineUsers(users);
        });

        return () => unsubscribeStatus();
    }, [currentUser]);

    // Fetch messages
    useEffect(() => {
        if (!currentUser) return;

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            setMessages(fetchedMessages);
        });

        return () => unsubscribeMessages();
    }, [currentUser]);

    // Scroll handling
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
        setShowScrollButton(!isNearBottom);
    }, []);

    // Auto-scroll to bottom on new messages if near bottom
    useEffect(() => {
        if (!showScrollButton) {
            scrollToBottom('auto');
        }
    }, [messages, showScrollButton, scrollToBottom]);

    // Send message
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!message.trim() && !attachment) || !currentUser) return;

        try {
            let attachmentURL = '';
            let attachmentType: 'image' | 'video' | 'file' | undefined;

            if (attachment) {
                const storageRef = ref(storage, `attachments/${currentUser.uid}/${Date.now()}_${attachment.name}`);
                await uploadBytes(storageRef, attachment);
                attachmentURL = await getDownloadURL(storageRef);

                if (attachment.type.startsWith('image/')) {
                    attachmentType = 'image';
                } else if (attachment.type.startsWith('video/')) {
                    attachmentType = 'video';
                } else {
                    attachmentType = 'file';
                }
            }

            await addDoc(collection(db, "messages"), {
                text: message.trim(),
                uid: currentUser.uid,
                displayName: currentUser.displayName || "Anonymous",
                photoURL: currentUser.photoURL,
                createdAt: serverTimestamp(),
                replyTo: replyingTo?.id || null,
                ...(attachmentURL && { attachmentURL, attachmentType }),
            });

            setMessage("");
            setReplyingTo(null);
            setAttachment(null);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    // Add reaction to message
    const addReaction = async (messageId: string, reaction: string) => {
        if (!currentUser) return;

        try {
            const messageRef = doc(db, "messages", messageId);
            const reactionKey = `reactions.${reaction}`;

            await setDoc(messageRef, {
                [reactionKey]: [...(messages.find(m => m.id === messageId)?.reactions?.[reaction] || []), currentUser.uid]
            }, { merge: true });
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    // Format message time
    const formatTime = (timestamp: Timestamp) => {
        if (!timestamp) return "";
        return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Render attachment preview
    const renderAttachmentPreview = () => {
        if (!attachment) return null;

        const previewBgColor = theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white';
        const previewTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';

        return (
            <div className={`relative mb-2 max-w-[80%] mx-auto ${previewBgColor} rounded-lg ${borderColor} border p-2`}>
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${previewTextColor}`}>
                        {attachment.type.startsWith('image/') ? (
                            <Image className="h-4 w-4" />
                        ) : attachment.type.startsWith('video/') ? (
                            <Video className="h-4 w-4" />
                        ) : (
                            <File className="h-4 w-4" />
                        )}
                        <span className="text-sm truncate">{attachment.name}</span>
                    </div>
                    <button
                        onClick={() => setAttachment(null)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };

    if (!currentUser) {
        return (
            <div className={`flex items-center justify-center h-screen ${bgColor}`}>
                <div className={`text-center p-4 ${textColor}`}>
                    <p>Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-screen ${bgColor}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 ${headerBgColor} ${borderColor} border-b px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className={`font-semibold ${textColor}`}>Community Chat</h1>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Theme Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {onlineUsers.slice(0, 3).map(user => (
                        <Avatar key={user.uid} className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback className={textColor}>
                                {user.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            </div>

            {/* Messages container */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className={`flex-1 overflow-y-auto p-4 space-y-3 ${bgColor}`}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.uid === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] flex ${msg.uid === currentUser.uid ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                            {msg.uid !== currentUser.uid && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.photoURL || undefined} />
                                    <AvatarFallback className={textColor}>
                                        {msg.displayName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div className="flex flex-col space-y-1">
                                {msg.replyTo && (
                                    <div className={`text-xs ${secondaryTextColor} px-2`}>
                                        Replying to: {messages.find(m => m.id === msg.replyTo)?.text || 'deleted message'}
                                    </div>
                                )}

                                <div
                                    className={`px-3 py-2 rounded-lg ${msg.uid === currentUser.uid
                                        ? 'bg-[#3797f0] text-white rounded-tr-none'
                                        : `${messageBgColor} ${borderColor} border rounded-tl-none ${textColor}`}`}
                                >
                                    {msg.text && <p className="break-words">{msg.text}</p>}

                                    {msg.attachmentURL && (
                                        <div className="mt-2">
                                            {msg.attachmentType === 'image' ? (
                                                <img
                                                    src={msg.attachmentURL}
                                                    alt="Attachment"
                                                    className="max-w-full rounded-lg"
                                                />
                                            ) : msg.attachmentType === 'video' ? (
                                                <video controls className="max-w-full rounded-lg">
                                                    <source src={msg.attachmentURL} />
                                                </video>
                                            ) : (
                                                <a
                                                    href={msg.attachmentURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 p-2 ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-100'
                                                        } rounded-lg ${textColor}`}
                                                >
                                                    <File className="h-4 w-4" />
                                                    <span>Download file</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={`flex items-center ${msg.uid === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
                                    <span className={`text-xs ${secondaryTextColor}`}>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom()}
                    className="fixed bottom-24 right-4 bg-[#1658a1] text-white rounded-full p-3 shadow-lg w-12 h-12 md:w-16 md:h-16 lg:w-16 lg:h-16 flex items-center justify-center"
                >
                    <ChevronDown className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10" />
                </button>


            )}

            {/* Input area
            <div className={`sticky bottom-0 ${inputBgColor} ${borderColor} border-t p-3`}>
                {replyingTo && (
                    <div className={`flex items-center justify-between mb-2 px-2 py-1 ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-100'
                        } rounded`}>
                        <p className={`text-sm truncate ${textColor}`}>
                            Replying to: {replyingTo.text.substring(0, 30)}{replyingTo.text.length > 30 ? '...' : ''}
                        </p>
                        <button onClick={() => setReplyingTo(null)} className={secondaryTextColor}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {attachment && renderAttachmentPreview()}

                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <input
                        placeholder="Upload a file..."
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full"
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="rounded-full">
                                <SmilePlus className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
                                height={350}
                                width={300}
                                theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                            />
                        </PopoverContent>

                    </Popover>

                    <Input
                        type="text"
                        placeholder="Message..."
                        
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`flex-1 rounded-full ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-100 border-gray-200'
                            } border-none ${textColor}`}
                    />

                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-[#3797f0] hover:bg-[#2a7bc8]"
                        disabled={!message.trim() && !attachment}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div> */}
        
        
<div className={`sticky bottom-0 ${inputBgColor} ${borderColor} border-t p-3 transition-all duration-300 ${
  isInputFocused ? 'pb-8' : '' // Extra padding when keyboard is open
}`}>
  {replyingTo && (
    <div className={`flex items-center justify-between mb-2 px-2 py-1 ${
      theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-100'
    } rounded`}>
      <p className={`text-sm truncate ${textColor}`}>
        Replying to: {replyingTo.text.substring(0, 30)}{replyingTo.text.length > 30 ? '...' : ''}
      </p>
      <button onClick={() => setReplyingTo(null)} className={secondaryTextColor}>
        <X className="h-4 w-4" />
      </button>
    </div>
  )}

  {attachment && renderAttachmentPreview()}

  <form onSubmit={sendMessage} className="flex items-center gap-2">
    <input
        placeholder="Upload a file..."
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
      accept="image/*,video/*,.pdf,.doc,.docx"
    />
    
    {!isInputFocused && (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <SmilePlus className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0 shadow-lg">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessage(prev => prev + emojiData.emoji);
                // Auto-focus input after emoji selection
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                input?.focus();
              }}
              height={350}
              width={300}
              theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
            />
          </PopoverContent>
        </Popover>
      </>
    )}

    <Input
      type="text"
      placeholder="Message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onFocus={() => setIsInputFocused(true)}
      onBlur={() => setIsInputFocused(false)}
      className={`flex-1 rounded-full ${
        theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-100 border-gray-200'
      } border-none ${textColor}`}
    />

    <Button
      type="submit"
      size="icon"
      className={`rounded-full bg-[#3797f0] hover:bg-[#2a7bc8] ${
        isInputFocused ? 'ml-2' : ''
      }`}
      disabled={!message.trim() && !attachment}
    >
      <Send className="h-5 w-5" />
    </Button>
  </form>
</div>
        
        </div>
    );
};

export default Chat;