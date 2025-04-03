
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    collection, addDoc, query, orderBy, onSnapshot,
    Timestamp, serverTimestamp, doc, setDoc,
    updateDoc
} from "firebase/firestore";
import { auth, db } from '../lib/firebase';
import {
    Send, SmilePlus, ChevronDown, Flag,
    ArrowLeft, X, Moon, Sun, Reply, MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { onAuthStateChanged, User } from "firebase/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Message = {
    id: string;
    text: string;
    uid: string;
    displayName: string;
    photoURL: string | null;
    createdAt: Timestamp;
    replyTo?: string;
    replyToMessage?: Message;
};

type OnlineUser = {
    uid: string;
    displayName: string;
    photoURL: string | null;
    email?: string;
    lastSeen: Timestamp;
    status: string;
};

const MAX_MESSAGE_PREVIEW_LENGTH = 100;
const MAX_REPLY_PREVIEW_LENGTH = 30;

const Chat = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showOnlineUsersDialog, setShowOnlineUsersDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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

    // Theme colors
    const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-[#fafafa]';
    const headerBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
    const messageBgColor = theme === 'dark' ? 'bg-[#262626]' : 'bg-white';
    const inputBgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-black';
    const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    // Auth and online status
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                navigate("/login");
                return;
            }

            const userStatusRef = doc(db, "status", user.uid);
            setDoc(userStatusRef, {
                status: "online",
                lastSeen: serverTimestamp(),
                displayName: user.displayName || "Anonymous",
                photoURL: user.photoURL,
                email: user.email || null
            }, { merge: true });
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    // Online users tracking
    useEffect(() => {
        if (!currentUser) return;

        const statusRef = collection(db, "status");
        const unsubscribeStatus = onSnapshot(statusRef, (snapshot) => {
            const now = Timestamp.now();
            const users: OnlineUser[] = [];
            
            snapshot.forEach((doc) => {
                // Skip current user
                if (doc.id === currentUser.uid) return;
                
                const data = doc.data();
                // Consider user online if status is "online" and lastSeen is within last 30 seconds
                if (data.status === "online" && data.lastSeen) {
                    const lastSeen = data.lastSeen as Timestamp;
                    if (now.seconds - lastSeen.seconds < 30) {
                        users.push({
                            uid: doc.id,
                            displayName: data.displayName || 'Anonymous',
                            photoURL: data.photoURL || null,
                            email: data.email,
                            lastSeen: lastSeen,
                            status: data.status
                        });
                    }
                }
            });
            
            setOnlineUsers(users);
        });

        return () => unsubscribeStatus();
    }, [currentUser]);

    // Update user's own status
    useEffect(() => {
        if (!currentUser) return;

        const userStatusRef = doc(db, "status", currentUser.uid);
        
        // Initial status update
        setDoc(userStatusRef, {
            status: "online",
            lastSeen: serverTimestamp(),
            displayName: currentUser.displayName || 'Anonymous',
            photoURL: currentUser.photoURL || null,
            email: currentUser.email || null
        }, { merge: true });

        // Heartbeat interval
        const heartbeatInterval = setInterval(() => {
            updateDoc(userStatusRef, {
                lastSeen: serverTimestamp()
            });
        }, 15000);

        // Handle visibility changes
        const handleVisibilityChange = () => {
            updateDoc(userStatusRef, {
                status: document.visibilityState === 'visible' ? "online" : "away",
                lastSeen: serverTimestamp()
            });
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(heartbeatInterval);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            updateDoc(userStatusRef, {
                status: "offline",
                lastSeen: serverTimestamp()
            });
        };
    }, [currentUser]);

    // Messages handling
    useEffect(() => {
        if (!currentUser) return;

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            
            const messagesWithReplies = fetchedMessages.map(msg => {
                if (msg.replyTo) {
                    const repliedMessage = fetchedMessages.find(m => m.id === msg.replyTo);
                    return {
                        ...msg,
                        replyToMessage: repliedMessage
                    };
                }
                return msg;
            });
            
            setMessages(messagesWithReplies);
        });

        return () => unsubscribeMessages();
    }, [currentUser]);

    const filteredOnlineUsers = onlineUsers.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Scroll handling
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollButton(scrollHeight - (scrollTop + clientHeight) > 100);
    }, []);

    useEffect(() => {
        if (!showScrollButton) {
            scrollToBottom('auto');
        }
    }, [messages, showScrollButton, scrollToBottom]);

    // Message functions
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentUser) return;

        try {
            await addDoc(collection(db, "messages"), {
                text: message.trim(),
                uid: currentUser.uid,
                displayName: currentUser.displayName || "Anonymous",
                photoURL: currentUser.photoURL,
                createdAt: serverTimestamp(),
                replyTo: replyingTo?.id || null,
            });

            setMessage("");
            setReplyingTo(null);
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    const toggleMessageExpansion = (messageId: string) => {
        setExpandedMessages(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const formatTime = (timestamp: Timestamp) => {
        if (!timestamp) return "";
        return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const reportMessage = (messageId: string) => {
        toast.info("Message reported to moderators");
    };

    // Render functions
    const renderMessageText = (msg: Message) => {
        const isExpanded = expandedMessages[msg.id];
        const shouldTruncate = msg.text.length > MAX_MESSAGE_PREVIEW_LENGTH && !isExpanded;
        
        return (
            <div>
                <p className="break-words whitespace-pre-wrap">
                    {shouldTruncate 
                        ? `${msg.text.substring(0, MAX_MESSAGE_PREVIEW_LENGTH)}...`
                        : msg.text}
                </p>
                {msg.text.length > MAX_MESSAGE_PREVIEW_LENGTH && (
                    <button
                        onClick={() => toggleMessageExpansion(msg.id)}
                        className={`text-xs mt-1 ${msg.uid === currentUser?.uid ? 'text-blue-200' : 'text-blue-600'}`}
                    >
                        {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
            </div>
        );
    };

    const renderReplyPreview = () => {
        if (!replyingTo) return null;

        return (
            <div className={`flex items-start justify-between mb-2 p-2 rounded-lg ${
                theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-100'
            }`}>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${
                            replyingTo.uid === currentUser?.uid 
                                ? 'text-blue-400' 
                                : theme === 'dark' 
                                    ? 'text-blue-300' 
                                    : 'text-blue-600'
                        }`}>
                            Replying to {replyingTo.displayName}
                        </span>
                        <span className={`text-xs ${secondaryTextColor}`}>
                            {formatTime(replyingTo.createdAt)}
                        </span>
                    </div>
                    <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {replyingTo.text.length > MAX_REPLY_PREVIEW_LENGTH 
                            ? `${replyingTo.text.substring(0, MAX_REPLY_PREVIEW_LENGTH)}...`
                            : replyingTo.text}
                    </p>
                </div>
                <button 
                    onClick={() => setReplyingTo(null)} 
                    className={`ml-2 ${secondaryTextColor} hover:opacity-70`}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    };

    const renderMessageActions = (msg: Message) => {
        const isCurrentUser = msg.uid === currentUser?.uid;
        
        return (
            <div className={`absolute flex items-center gap-1 ${isCurrentUser ? '-left-2' : '-right-2'} -top-2 
                bg-white dark:bg-gray-800 rounded-full shadow-md p-1 border ${borderColor} transition-all duration-200
                opacity-0 group-hover:opacity-100 group-hover:scale-100`}
                onClick={(e) => e.stopPropagation()}
            >
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => {
                        setReplyingTo(msg);
                        setMessage(`@${msg.displayName} `);
                        setTimeout(() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            input?.focus();
                        }, 100);
                    }}
                >
                  
                    <Reply className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => reportMessage(msg.id)}>
                            <Flag className="mr-2 h-4 w-4" />
                            <span>Report</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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

                    <div 
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowOnlineUsersDialog(true)}
                    >
                        <div className="relative flex items-center">
                            {onlineUsers.slice(0, 3).map((user, index) => (
                                <div 
                                    key={user.uid}
                                    className="relative"
                                    style={{
                                        marginLeft: index > 0 ? '-8px' : '0',
                                        zIndex: 3 - index
                                    }}
                                >
                                    <Avatar className="h-8 w-8 border-2 border-background">
                                        <AvatarImage src={user.photoURL || undefined} />
                                        <AvatarFallback className={textColor}>
                                            {user.displayName?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background"></span>
                                    </Avatar>
                                </div>
                            ))}
                            {onlineUsers.length > 3 && (
                                <div 
                                    className="relative flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium border-2 border-background"
                                    style={{ marginLeft: '-8px', zIndex: 0 }}
                                >
                                    +{onlineUsers.length - 3}
                                </div>
                            )}
                        </div>
                        
                        <span className="ml-2 text-sm text-muted-foreground">
                            {onlineUsers.length} {onlineUsers.length === 1 ? 'online' : 'online'}
                        </span>
                    </div>

                    <Dialog open={showOnlineUsersDialog} onOpenChange={setShowOnlineUsersDialog}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Online Users ({onlineUsers.length})</DialogTitle>
                            </DialogHeader>
                            
                            <div className="px-4">
                                <Input
                                    placeholder="Search online users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            
                            <ScrollArea className="h-64 px-4">
                                {filteredOnlineUsers.length > 0 ? (
                                    filteredOnlineUsers.map((user) => (
                                        <div key={user.uid} className="flex items-center py-3 border-b">
                                            <Avatar className="h-9 w-9 mr-3">
                                                <AvatarImage src={user.photoURL || undefined} />
                                                <AvatarFallback>
                                                    {user.displayName?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background"></span>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{user.displayName || 'Anonymous'}</p>
                                                {user.email && (
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                )}
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setMessage(`@${user.displayName || 'user'} `);
                                                    setShowOnlineUsersDialog(false);
                                                }}
                                            >
                                                Message
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-6 text-center text-muted-foreground">
                                        {searchQuery ? 'No matching users found' : 'No users online'}
                                    </div>
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
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
                        className={`flex ${msg.uid === currentUser.uid ? 'justify-end' : 'justify-start'} group`}
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
                                {msg.replyToMessage && (
                                    <div 
                                        className={`text-xs px-2 py-1 rounded-t-lg mb-1 cursor-pointer ${
                                            theme === 'dark' ? 'bg-[#2d2d2d] text-gray-300' : 'bg-gray-100 text-gray-600'
                                        }`}
                                        onClick={() => {
                                            const repliedElement = document.getElementById(`msg-${msg.replyTo}`);
                                            repliedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            
                                            repliedElement?.classList.add('ring-2', 'ring-blue-500');
                                            setTimeout(() => {
                                                repliedElement?.classList.remove('ring-2', 'ring-blue-500');
                                            }, 2000);
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Reply className="h-3 w-3" />
                                            <span className="font-medium">
                                                {msg.replyToMessage.displayName}
                                            </span>
                                        </div>
                                        <p className="truncate italic">
                                            {msg.replyToMessage.text.length > MAX_REPLY_PREVIEW_LENGTH 
                                                ? `${msg.replyToMessage.text.substring(0, MAX_REPLY_PREVIEW_LENGTH)}...`
                                                : msg.replyToMessage.text}
                                        </p>
                                    </div>
                                )}

                                <div className="relative">
                                    <div
                                        id={`msg-${msg.id}`}
                                        className={`px-3 py-2 rounded-lg ${msg.uid === currentUser.uid
                                            ? 'bg-[#3797f0] text-white rounded-tr-none'
                                            : `${messageBgColor} ${borderColor} border rounded-tl-none ${textColor}`} ${
                                            replyingTo?.id === msg.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    >
                                        {renderMessageText(msg)}
                                    </div>
                                    
                                    {renderMessageActions(msg)}
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
                    className="fixed bottom-24 right-4 bg-[#1658a1] text-white rounded-full p-3 shadow-lg w-12 h-12 flex items-center justify-center"
                >
                    <ChevronDown className="h-6 w-6" />
                </button>
            )}

            <div className={`sticky bottom-0 ${inputBgColor} ${borderColor} border-t p-3 transition-all duration-300 ${
                isInputFocused ? 'pb-8' : ''
            }`}>
                {renderReplyPreview()}

                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            input?.focus();
                        }}
                    >
                        <SmilePlus className="h-5 w-5" />
                    </Button>

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
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-[#3797f0] hover:bg-[#2a7bc8]"
                        disabled={!message.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Chat;