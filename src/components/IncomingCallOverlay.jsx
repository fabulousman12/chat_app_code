import React, { useEffect, useState } from "react";

export default function IncomingCallOverlay() {
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    const handler = (e) => setIncoming(e.detail);
    window.addEventListener("incomingCall", handler);
    return () => window.removeEventListener("incomingCall", handler);
  }, []);

  const handleAccept = () => {
    if (incoming) {
      localStorage.setItem("incomingCall", JSON.stringify(incoming));
      window.dispatchEvent(new CustomEvent("acceptCall"));
      window.router.push("/videocall", { mode: "answer" });
      setIncoming(null);
    }
  };

  const handleReject = () => {
    if (incoming?.callerId) {
      socket.current?.send(JSON.stringify({
        type: "call-reject",
        targetId: incoming.callerId
      }));
    }
    setIncoming(null);
  };

  if (!incoming) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-72 text-center">
        <h2 className="text-lg font-semibold text-black">Incoming Call</h2>
        <p className="text-gray-600 mt-2">{incoming.callerId} is calling...</p>

        <div className="flex justify-around mt-6">
          <button onClick={handleReject} className="bg-red-500 text-white rounded-full p-3">❌</button>
          <button onClick={handleAccept} className="bg-green-500 text-white rounded-full p-3">📞</button>
        </div>
      </div>
    </div>
  );
}
