import Upload from "@/components/upload";
import Chat from "@/components/chat";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Simple RAG Chatbot
      </h1>

      <div className="space-y-6">
        <Upload />
        <Chat />
      </div>
    </main>
  );
}