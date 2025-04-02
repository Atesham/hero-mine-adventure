import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Theme as EmojiTheme } from 'emoji-picker-react';

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    collection, addDoc, query, orderBy, onSnapshot,
    Timestamp, serverTimestamp, doc, setDoc,
    updateDoc
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

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    email: any;
    uid: string;
    displayName: string;
    photoURL: string | null;
    lastSeen: Timestamp;  // Add this line

    
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
// Add these states to your component
const [showOnlineUsersDialog, setShowOnlineUsersDialog] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const filteredOnlineUsers = onlineUsers.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

  // Track online users (excluding current user)
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
      // Verify lastSeen exists and is within 30 seconds
      if (data.status === "online" && data.lastSeen) {
        const lastSeen = data.lastSeen as Timestamp;
        if (now.seconds - lastSeen.seconds < 30) {
          users.push({
            uid: doc.id,
            displayName: data.displayName || 'Anonymous',
            photoURL: data.photoURL || null,
            email: data.email || undefined,
            lastSeen: lastSeen  // Include the timestamp
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

// Update your online users tracking useEffect
useEffect(() => {
  if (!currentUser) return;

  const statusRef = collection(db, "status");
  const unsubscribeStatus = onSnapshot(statusRef, (snapshot) => {
    const now = Timestamp.now();
    const users: OnlineUser[] = [];
    
    snapshot.forEach((doc) => {
      // Skip the current user's document
      if (doc.id === currentUser.uid) return;
      
      const data = doc.data();
      // Consider user online if status is "online" and lastSeen is within last 30 seconds
      if (data.status === "online" && data.lastSeen && 
          now.seconds - data.lastSeen.seconds < 30) {
        users.push({
          uid: doc.id,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL,
          email: data.email,
          lastSeen: data.lastSeen
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

                    {/* {onlineUsers.slice(0, 3).map(user => (
                        <Avatar key={user.uid} className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback className={textColor}>
                                {user.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    ))} */}




<div 
  className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
  onClick={() => setShowOnlineUsersDialog(true)}
>
  {/* Circular avatars (same as before) */}
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

{/* Online Users Dialog */}
<Dialog open={showOnlineUsersDialog} onOpenChange={setShowOnlineUsersDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Online Users ({onlineUsers.length})</DialogTitle>
    </DialogHeader>
    
    {/* Search input */}
    <div className="px-4">
      <Input
        placeholder="Search online users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />
    </div>
    
    {/* Users list */}
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
                // Start a chat with this user
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
      type="file"
      placeholder="Upload a file..."
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
      // Prevent autofill suggestions
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
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
</div>

        </div>
    );
};

export default Chat;