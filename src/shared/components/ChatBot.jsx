import { useEffect, useRef, useState } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaTimes,
  FaRobot
} from "react-icons/fa";

const ChatBot = () => {
  const botReplies = (message) => {
    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return "Hi 👋 I'm your AI assistant for HR, CRM & HRMS. How can I help you today?";
    }

    if (text.includes("hr") || text.includes("human resource") || text.includes("employee")) {
      return "This platform covers HR: recruitment, leave, payroll, and employee management. Use the sidebar to open the section you need.";
    }

    if (text.includes("crm") || text.includes("deal") || text.includes("lead")) {
      return "CRM helps you manage deals, contacts, companies, and activities. Check the CRM menu for Deals, Contacts, and Activities.";
    }

    if (text.includes("hrms") || text.includes("leave") || text.includes("payroll") || text.includes("attendance")) {
      return "HRMS includes leave requests, payroll, attendance, and workforce management. Navigate via the HRMS / Recruiter sections.";
    }

    if (text.includes("job") || text.includes("recruit") || text.includes("candidate")) {
      return "You can post jobs, view candidates, and manage the hiring pipeline from the Jobs and Recruiter Dashboard sections.";
    }

    if (text.includes("help") || text.includes("support")) {
      return "I can help with HR, CRM, and HRMS questions. Ask about jobs, candidates, deals, contacts, leave, or payroll.";
    }

    if (text.includes("contact")) {
      return "CRM Contacts are in the CRM menu. For app support, use the contact or support options or reach out to your administrator.";
    }

    return "I'm your AI assistant for this HR, CRM & HRMS platform. Ask about jobs, recruitment, deals, contacts, leave, or HRMS features.";
  };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 I’m AI HR & CRM Assistant. Ask me about jobs, recruitment, deals, contacts, or HR features." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage = {
        from: "bot",
        text: botReplies(input)
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition z-50"
      >
        <FaComments size={22} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaRobot />
              <span className="font-semibold">AI HR & CRM Assistant</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow
                    ${msg.from === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 rounded-bl-none"}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about HR, CRM, jobs, or HRMS..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;