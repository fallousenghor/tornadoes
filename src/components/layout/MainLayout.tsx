// Main Layout Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, Spacing, Transitions, Layout } from '../../constants/theme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavSection, NavItem } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
  navSections: NavSection[];
  collapsedSections: Record<string, boolean>;
  onToggleSection: (label: string) => void;
  headerTitle: string;
  headerSubtitle?: string;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isSidebarOpen,
  onSidebarToggle,
  activeNav,
  onNavChange,
  navSections,
  collapsedSections,
  onToggleSection,
  headerTitle,
  headerSubtitle,
  activeView,
  onViewChange,
}) => {
  // Find active nav item for title
  const flatNav = navSections.flatMap(s => s.items);
  const activeItem = flatNav.find(i => i.id === activeNav);
  const title = activeItem?.label || headerTitle;

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Georgia',serif",
    background: Colors.bg,
    height: '100vh',
    color: Colors.text,
    display: 'flex',
    overflow: 'hidden',
    position: 'fixed',
    inset: 0,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: Spacing.xxl,
  };

  return (
    <div style={containerStyle}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
        activeNav={activeNav}
        onNavChange={onNavChange}
        navSections={navSections}
        collapsedSections={collapsedSections}
        onToggleSection={onToggleSection}
      />
      <div style={mainStyle}>
        <Header
          title={title}
          subtitle={headerSubtitle}
          activeView={activeView}
          onViewChange={onViewChange}
        />
        <main style={contentStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

