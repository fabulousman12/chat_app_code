import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useHistory } from "react-router-dom";

export default function AdminChat({ fetchAdminMessages, sendAdminMessage }) {
  const history = useHistory();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchAdminMessages().then(dbMessages => {
      if (!dbMessages || dbMessages.length === 0) {
        setMessages([
          {
            id: "welcome",
            sender: "admin",
            content:
              "👋 Welcome!\nOnly one developer is working on this so please use gently. And Please be patient.",
            timestamp: Date.now(),
          },  {
            id: "Info",
            sender: "admin",
            content:
              "Also if you found any bug report to developer .",
            timestamp: Date.now(),
          },
        ]);
      } else {
        setMessages(dbMessages);
      }
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, msg]);
    setInput("");
    await sendAdminMessage(input);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-gray-200">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-slate-700">
        <button onClick={() => history.goBack()}>
          <BiArrowBack size={20} />
        </button>
        <h1 className="font-semibold text-lg text-white">
          Developer Chat
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
              ${msg.sender === "admin"
                ? "bg-slate-800 text-gray-200 self-start"
                : "bg-blue-600 text-white self-end ml-auto"
              }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
        <input
        disabled={true}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-950 border border-slate-600 rounded-xl px-4 py-2 text-sm outline-none text-gray-200 placeholder-gray-400"
        />
        <button
        disabled={true}
          
          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
