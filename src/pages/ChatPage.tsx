import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Badge } from '@/components/ui/badge';
import { MessageReactions } from '@/components/MessageReactions';
import { EmojiPicker } from '@/components/EmojiPicker';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatThemeSelector } from '@/components/ChatThemeSelector';
import { GlobalHeader } from '@/components/GlobalHeader';
import { useMessageStatus } from '@/hooks/useMessageStatus';
import { usePresence } from '@/hooks/usePresence';
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Eye, 
  EyeOff, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Heart,
  Image as ImageIcon,
  File,
  Play,
  Pause
} from 'lucide-react';
import { useMutualReveal } from '@/hooks/useMutualReveal';
import mysticalAvatar from '@/assets/mystical-avatar.png';
import profile1 from '@/assets/profiles/profile1.jpg';
import profile2 from '@/assets/profiles/profile2.jpg';
import profile3 from '@/assets/profiles/profile3.jpg';

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isRevealed: boolean;
  revealRequested: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  text?: string;
  type: 'text' | 'voice' | 'image' | 'file';
  sender: 'me' | 'them';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    url: string;
    name: string;
    size?: number;
    duration?: number; // for voice messages
  };
  reactions?: {
    upvotes: number;
    downvotes: number;
    userReaction?: 'up' | 'down' | null;
  };
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [showRevealBanner, setShowRevealBanner] = useState(false);
  const [chatDuration, setChatDuration] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTheme, setChatTheme] = useState<string>('default');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { revealStates, requestReveal, simulatePartnerRequest, getRevealState } = useMutualReveal();
  const { simulateMessageDelivery, getMessageStatus } = useMessageStatus();
  const { isUserOnline } = usePresence();

  const [chats] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'Luna',
      avatar: profile1,
      isRevealed: false,
      revealRequested: false,
      lastMessage: 'That\'s such an interesting perspective!',
      timestamp: '2 min ago',
      unread: 2
    },
    {
      id: '2',
      name: 'Phoenix',
      avatar: profile2,
      isRevealed: true,
      revealRequested: false,
      lastMessage: 'Would love to continue this conversation over coffee ☕',
      timestamp: '1 hour ago',
      unread: 0
    },
    {
      id: '3',
      name: 'Sage',
      avatar: profile3,
      isRevealed: false,
      revealRequested: true,
      lastMessage: 'I feel like we have so much in common',
      timestamp: '3 hours ago',
      unread: 1
    },
  ]);

  // Initialize messages
  useEffect(() => {
    const now = new Date();
    setMessages([
      {
        id: '1',
        text: 'Hi there! I loved reading your answers in the questionnaire. Your perspective on life is really refreshing!',
        type: 'text',
        sender: 'them',
        timestamp: new Date(now.getTime() - 600000), // 10 min ago
        status: 'read',
        reactions: { upvotes: 1, downvotes: 0, userReaction: 'up' }
      },
      {
        id: '2',
        text: 'Thank you so much! I was really drawn to your answers too. You seem like someone who values deep conversations.',
        type: 'text',
        sender: 'me',
        timestamp: new Date(now.getTime() - 480000), // 8 min ago
        status: 'read',
        reactions: { upvotes: 0, downvotes: 0, userReaction: null }
      },
      {
        id: '3',
        text: 'Absolutely! I believe meaningful connections start with understanding each other\'s thoughts and values first.',
        type: 'text',
        sender: 'them',
        timestamp: new Date(now.getTime() - 300000), // 5 min ago
        status: 'read',
        reactions: { upvotes: 2, downvotes: 0, userReaction: null }
      },
      {
        id: '4',
        text: 'I couldn\'t agree more. What\'s something you\'re passionate about that might surprise people?',
        type: 'text',
        sender: 'me',
        timestamp: new Date(now.getTime() - 180000), // 3 min ago
        status: 'read',
        reactions: { upvotes: 1, downvotes: 0, userReaction: null }
      },
      {
        id: '5',
        text: 'That\'s such an interesting perspective!',
        type: 'text',
        sender: 'them',
        timestamp: new Date(now.getTime() - 120000), // 2 min ago
        status: 'delivered',
        reactions: { upvotes: 0, downvotes: 0, userReaction: null }
      }
    ]);
  }, []);

  useEffect(() => {
    // Simulate chat duration for the mystical prompt
    const timer = setInterval(() => {
      setChatDuration(prev => prev + 1);
      
      // Show mystical prompt after 76 hours (simulated as 10 seconds for demo)
      if (chatDuration > 10 && !showRevealBanner) {
        setShowRevealBanner(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [chatDuration, showRevealBanner]);

  const currentChat = chats.find(chat => chat.id === activeChat);
  const currentRevealState = currentChat ? getRevealState(currentChat.id) : null;

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageId = Date.now().toString();
      const newMessage: Message = {
        id: messageId,
        text: message,
        type: 'text',
        sender: 'me',
        timestamp: new Date(),
        status: 'sent',
        reactions: { upvotes: 0, downvotes: 0, userReaction: null }
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate message delivery
      simulateMessageDelivery(messageId);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          sender: 'me',
          timestamp: new Date(),
          status: 'sent',
          attachment: {
            url: result,
            name: file.name,
            size: file.size
          },
          reactions: { upvotes: 0, downvotes: 0, userReaction: null }
        };
        setMessages(prev => [...prev, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceNote = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'voice',
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
      attachment: {
        url: audioUrl,
        name: 'Voice Note',
        duration: 0 // Would be calculated from recording
      },
      reactions: { upvotes: 0, downvotes: 0, userReaction: null }
    };
    setMessages(prev => [...prev, newMessage]);
    setShowVoiceRecorder(false);
  };

  const handleReaction = (messageId: string, reaction: 'up' | 'down') => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const currentReaction = msg.reactions?.userReaction;
          const upvotes = msg.reactions?.upvotes || 0;
          const downvotes = msg.reactions?.downvotes || 0;

          let newUpvotes = upvotes;
          let newDownvotes = downvotes;
          let newUserReaction: 'up' | 'down' | null = reaction;

          if (currentReaction === reaction) {
            // Remove reaction
            newUserReaction = null;
            if (reaction === 'up') newUpvotes--;
            else newDownvotes--;
          } else {
            // Change or add reaction
            if (reaction === 'up') {
              newUpvotes++;
              if (currentReaction === 'down') newDownvotes--;
            } else {
              newDownvotes++;
              if (currentReaction === 'up') newUpvotes--;
            }
          }

          return {
            ...msg,
            reactions: {
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userReaction: newUserReaction
            }
          };
        }
        return msg;
      })
    );
  };

  const handleRevealRequest = () => {
    if (currentChat) {
      requestReveal(currentChat.id);
      // Simulate partner accepting after a delay for demo purposes
      setTimeout(() => simulatePartnerRequest(currentChat.id), 2000);
    }
  };

  const handleRevealResponse = (accept: boolean) => {
    setShowRevealBanner(false);
    if (accept) {
      // Handle accept reveal
      console.log('Reveal accepted');
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-primary">✓✓</span>;
    }
  };

  return (
    <div className="min-h-screen bg-mystical flex">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-mystical-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-heading font-bold">Chats</h1>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full p-4 border-b border-border text-left hover:bg-secondary/30 transition-colors ${
                activeChat === chat.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ProfilePicture
                    src={chat.avatar}
                    alt={chat.name}
                    fallback={chat.name[0]}
                    isRevealed={getRevealState(chat.id).isRevealed}
                    size="md"
                  />
                  {getRevealState(chat.id).isRevealed && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-accent-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    <div className="flex items-center space-x-2">
                      {chat.unread > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {chat.timestamp}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                  
                  {getRevealState(chat.id).partnerRequested && !getRevealState(chat.id).isRevealed && (
                    <div className="flex items-center mt-2">
                      <Star className="w-3 h-3 text-accent mr-1" />
                      <span className="text-xs text-accent">Reveal requested</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-mystical-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ProfilePicture
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    fallback={currentChat.name[0]}
                    isRevealed={currentRevealState?.isRevealed || false}
                    size="md"
                  />
                  <div>
                    <h2 className="font-semibold">{currentChat.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {currentRevealState?.isRevealed ? 'Identity revealed' : 'Anonymous'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Chat Theme Selector - only show after reveal */}
                  {currentRevealState?.isRevealed && (
                    <ChatThemeSelector
                      currentTheme={chatTheme}
                      onThemeChange={setChatTheme}
                    />
                  )}
                  
                  <Button
                    onClick={handleRevealRequest}
                    variant={currentRevealState?.userRequested ? "secondary" : "outline"}
                    size="sm"
                    className={currentRevealState?.userRequested ? 'btn-secondary-mystical' : ''}
                    disabled={currentRevealState?.isRevealed}
                  >
                    {currentRevealState?.isRevealed ? (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Revealed
                      </>
                    ) : currentRevealState?.userRequested ? (
                      currentRevealState?.partnerRequested ? 'Both Requested!' : 'Waiting for them...'
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Reveal Identity
                      </>
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reveal Request Banner */}
            {showRevealBanner && (
              <div className="bg-accent/20 border-b border-accent/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-accent" />
                    <span className="font-medium">
                      The stars are aligning! You two have been talking for a while. Maybe it's time to reveal?
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <MessageBubble
                    message={msg.text || ''}
                    isOwn={msg.sender === 'me'}
                    timestamp={msg.timestamp}
                    status={getMessageStatus(msg.id)}
                    senderName={currentChat?.name}
                    isOnline={currentChat ? isUserOnline(currentChat.id) : false}
                  />
                  
                  {/* Enhanced content for non-text messages */}
                  {msg.type !== 'text' && (
                    <div className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mt-2`}>
                      <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'ml-12' : 'mr-12'}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {/* Image Message */}
                          {msg.type === 'image' && msg.attachment && (
                            <div>
                              <img 
                                src={msg.attachment.url} 
                                alt="Shared image"
                                className="max-w-full h-auto rounded-lg mb-2"
                              />
                              <p className="text-xs opacity-70">{msg.attachment.name}</p>
                            </div>
                          )}
                          
                          {/* File Message */}
                          {msg.type === 'file' && msg.attachment && (
                            <div className="flex items-center space-x-3">
                              <File className="w-8 h-8 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{msg.attachment.name}</p>
                                <p className="text-xs opacity-70">
                                  {msg.attachment.size && (msg.attachment.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Voice Message */}
                          {msg.type === 'voice' && msg.attachment && (
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-inherit"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <div className="flex-1">
                                <div className="w-full bg-secondary/30 h-1 rounded">
                                  <div className="bg-current h-1 rounded w-1/3"></div>
                                </div>
                                <p className="text-xs opacity-70 mt-1">Voice message</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Message Reactions */}
                  <MessageReactions
                    messageId={msg.id}
                    reactions={msg.reactions}
                    onReact={handleReaction}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-mystical-card border-t border-border p-4">
              {showVoiceRecorder ? (
                <VoiceRecorder onVoiceNote={handleVoiceNote} />
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="input-mystical pr-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <EmojiPicker onEmojiSelect={handleEmojiSelect}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </EmojiPicker>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowVoiceRecorder(true)}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    className="btn-mystical"
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-heading font-semibold mb-2">
                Select a chat to start
              </h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to begin chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;