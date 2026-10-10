"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ContactMessage } from "@/types";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export default function AdminMessagesPage() {
  const confirm = useConfirm();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.is_read) return;

    const res = await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: message.id, is_read: true }),
    });

    if (res.ok) {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, is_read: true } : item
        )
      );
      setSelectedMessage({ ...message, is_read: true });
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete message",
      message: "This removes the message from your inbox.",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Message deleted");
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return <div className="h-80 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />;
  }

  if (messages.length === 0) {
    return (
      <div className="admin-panel px-6 py-16 text-center text-sm text-zinc-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="admin-panel grid min-h-[32rem] grid-cols-1 overflow-hidden lg:grid-cols-[18rem_1fr]">
      <div className="max-h-[32rem] divide-y divide-zinc-100 overflow-y-auto border-b border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800 lg:max-h-none lg:border-b-0 lg:border-r">
        {messages.map((message) => {
          const selected = selectedMessage?.id === message.id;
          return (
            <button
              key={message.id}
              type="button"
              onClick={() => openMessage(message)}
              className={`block w-full px-4 py-4 text-left transition ${
                selected ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {message.name}
                </p>
                {!message.is_read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-900 dark:bg-white" />
                )}
              </div>
              <p className="mt-1 truncate text-sm text-zinc-500">{message.subject}</p>
              <p className="mt-1 text-xs text-zinc-400">{formatDate(message.created_at)}</p>
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {selectedMessage ? (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {selectedMessage.subject || "No subject"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {selectedMessage.name} · {selectedMessage.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
            <p className="mt-6 flex-1 whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
              {selectedMessage.message}
            </p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-400">{formatDate(selectedMessage.created_at)}</p>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                className="admin-btn"
              >
                Reply by email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Select a message.
          </div>
        )}
      </div>
    </div>
  );
}
