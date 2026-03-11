"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, MessageSquare } from "lucide-react";

interface Message {
    id: string;
    user_id: string;
    content: string;
    sender_type: "user" | "ai";
    created_at: string;
}

interface ChatInterfaceProps {
    userId: string;
    userName: string;
}

export function ChatInterface({ userId, userName }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Load history
    useEffect(() => {
        const loadHistory = async () => {
            const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });
            if (data) setMessages(data);
            setIsLoadingHistory(false);
        };
        loadHistory();
    }, [userId]);

    // Realtime sync
    useEffect(() => {
        const channel = supabase
            .channel("messages-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === newMessage.id)) return prev;
                        const hasTempMatch = prev.some(
                            (m) => m.id.startsWith("temp-") && m.content === newMessage.content && m.sender_type === newMessage.sender_type
                        );
                        if (hasTempMatch) {
                            return prev.map((m) =>
                                m.id.startsWith("temp-") && m.content === newMessage.content && m.sender_type === newMessage.sender_type
                                    ? newMessage
                                    : m
                            );
                        }
                        return [...prev, newMessage];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput("");
        setIsLoading(true);

        const tempUserMsg: Message = {
            id: "temp-user-" + Date.now(),
            user_id: userId,
            content: userMessage,
            sender_type: "user",
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            supabase.from("messages").insert({
                user_id: userId,
                content: userMessage,
                sender_type: "user",
            }).then(({ error }) => {
                if (error) console.error("Error saving user message:", error);
            });

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!res.ok) {
                console.error("API Error:", await res.text());
                setIsLoading(false);
                return;
            }

            const { response: aiText } = await res.json();

            const tempAiMsg: Message = {
                id: "temp-ai-" + Date.now(),
                user_id: userId,
                content: aiText,
                sender_type: "ai",
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, tempAiMsg]);

            supabase.from("messages").insert({
                user_id: userId,
                content: aiText,
                sender_type: "ai",
            }).then(({ error }) => {
                if (error) console.error("Error saving AI message:", error);
            });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderMarkdown = (text: string) => {
        // Basic markdown parser for bold, lists, and newlines since Gemini uses markdown
        return text.split('\n').map((line, i) => {
            if (line.startsWith('- ')) {
                return (
                    <li key={i} className="ml-4 list-disc marker:text-indigo-400 mb-1">
                        <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                );
            }
            return (
                <p key={i} className="mb-2 last:mb-0 min-h-[1em]" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            );
        });
    };

    const quickReplies = ["Sản phẩm hot nhất?", "ChatGPT Plus tính năng gì?", "Giúp tôi hiểu về AI", "Bạn có thể code không?"];

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <div className="flex-none px-6 py-4 bg-white border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Gemini Pro Assistant</h2>
                        <p className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Online • Sẵn sàng hỗ trợ</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                        <MessageSquare className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 scroll-smooth">
                {isLoadingHistory ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-100 to-violet-100 flex items-center justify-center mb-6 ring-8 ring-white shadow-sm">
                            <Sparkles className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-2">Xin chào, {userName}!</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Chào mừng bạn đến với <span className="font-semibold text-indigo-600">AI Workspace</span>. Trợ lý này được tích hợp trí tuệ nhân tạo Gemini Pro, sẵn sàng giải đáp mọi thắc mắc từ sản phẩm đến kiến thức tổng hợp.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {quickReplies.map((text) => (
                                <button
                                    key={text}
                                    onClick={() => setInput(text)}
                                    className="p-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 transition-all text-left flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg, index) => {
                            const isUser = msg.sender_type === "user";
                            const isConsecutive = index > 0 && messages[index - 1].sender_type === msg.sender_type;

                            return (
                                <div key={msg.id} className={`flex items-end gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>

                                    {!isConsecutive ? (
                                        <Avatar className="w-8 h-8 shrink-0 ring-2 ring-white shadow-sm">
                                            <AvatarFallback className={isUser ? "bg-slate-800" : "bg-gradient-to-tr from-indigo-500 to-violet-600"}>
                                                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-8 h-8 shrink-0"></div> // Placeholder for alignment
                                    )}

                                    <div className="flex flex-col gap-1 w-full relative group">
                                        <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${isUser
                                                ? "bg-slate-800 text-white rounded-2xl rounded-br-sm"
                                                : "bg-white text-slate-700 rounded-2xl rounded-bl-sm border border-slate-100"
                                            }`}>
                                            {isUser ? (
                                                <span className="whitespace-pre-wrap">{msg.content}</span>
                                            ) : (
                                                <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-strong:text-indigo-900 prose-li:my-0">
                                                    {renderMarkdown(msg.content)}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-medium text-slate-400 absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "right-1" : "left-1"}`}>
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex items-end gap-3 max-w-[85%] mr-auto">
                                <Avatar className="w-8 h-8 shrink-0 ring-2 ring-white shadow-sm hover:animate-spin">
                                    <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-violet-600">
                                        <Bot className="w-4 h-4 text-white" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-white px-5 py-4 border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center justify-center min-w-[60px]">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 bg-white/50 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto flex items-end gap-2 relative">
                    <div className="relative flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100/50 transition-all flex items-center pr-2">
                        <Input
                            id="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Hỏi Gemini Pro điều gì đó..."
                            disabled={isLoading}
                            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent h-14 px-5 text-[15px]"
                        />
                        <Button
                            id="chat-send-btn"
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto text-center mt-3">
                    <p className="text-[11px] text-slate-400">Gemini có thể mắc lỗi xử lý thông tin. Vui lòng kiểm tra lại thông tin quan trọng.</p>
                </div>
            </div>
        </div>
    );
}
