import React, { useState, useRef, useCallback, useId } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTabId, onChange }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id || '');
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabListRef = useRef<HTMLDivElement>(null);
  const generatedIds = useRef<Map<string, string>>(new Map());

  const getTabId = useCallback((tabId: string) => {
    if (!generatedIds.current.has(tabId)) {
      generatedIds.current.set(tabId, `tab-${tabId}`);
    }
    return generatedIds.current.get(tabId)!;
  }, []);

  const getPanelId = useCallback((tabId: string) => {
    if (!generatedIds.current.has(`panel-${tabId}`)) {
      generatedIds.current.set(`panel-${tabId}`, `tabpanel-${tabId}`);
    }
    return generatedIds.current.get(`panel-${tabId}`)!;
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  }, [onChange]);

  const focusTab = useCallback((tabId: string) => {
    const tabElement = tabRefs.current.get(tabId);
    if (tabElement) {
      tabElement.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const newTabId = tabs[newIndex].id;
    handleTabChange(newTabId);
    focusTab(newTabId);
  }, [tabs, handleTabChange, focusTab]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div>
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        style={{
          display: 'flex',
          borderBottom: '1px solid #ccc',
          marginBottom: '16px',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              role="tab"
              id={getTabId(tab.id)}
              aria-selected={isSelected}
              aria-controls={getPanelId(tab.id)}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: isSelected ? '2px solid #000' : '2px solid transparent',
                background: isSelected ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : 'normal',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={getPanelId(activeTab.id)}
          aria-labelledby={getTabId(activeTab.id)}
          tabIndex={0}
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
