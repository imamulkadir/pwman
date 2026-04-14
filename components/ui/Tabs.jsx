import React from "react";

const TabsContext = React.createContext({
  activeTab: null,
  setActiveTab: () => {},
});

export const Tabs = ({ defaultValue, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleChange = (value) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div
      className={`flex rounded-xl p-1 bg-gray-100/50 backdrop-blur-sm ${className || ""}`}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      type="button"
      onClick={() => setActiveTab?.(value)}
      className={`px-4 py-2.5 font-medium text-sm rounded-lg transition-all duration-200 ${
        activeTab === value
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
      } ${className || ""}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  const { activeTab } = React.useContext(TabsContext);
  return activeTab === value ? (
    <div className={className}>{children}</div>
  ) : null;
};
