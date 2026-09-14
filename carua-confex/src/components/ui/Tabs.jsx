import * as React from "react";
import { cn } from "../../lib/utils.jsx";

// Tabs simples, controlado por value/onValueChange, sem dependência de @radix-ui.

const TabsContext = React.createContext({ value: undefined, onValueChange: () => {} });

function Tabs({ value, onValueChange, className, children, ...props }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-surface p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, children, ...props }) {
  const { value: active, onValueChange } = React.useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all",
        isActive ? "bg-background text-foreground shadow-soft" : "hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children, ...props }) {
  const { value: active } = React.useContext(TabsContext);

  if (active !== value) return null;

  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };