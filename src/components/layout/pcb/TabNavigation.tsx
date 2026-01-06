// components/TabNavigation.tsx
"use client";

interface TabProps {
  activeTab: "pcb" | "assembly" | "stencil";
  setActiveTab: (tab: "pcb" | "assembly" | "stencil") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabProps) {
  const tabs = [
    { id: "pcb" as const, label: "GIA CÔNG PCB" },
    // { id: "assembly" as const, label: "LẮP RÁP PCB" },
    // { id: "stencil" as const, label: "SMT STENCIL" },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}