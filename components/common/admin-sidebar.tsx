'use client';

import { numoniLogoDark } from '@/constant/icons';
import { adminNavigationItem } from '@/data';
import { getExpandedItemsForPath, isChildItemActive, isItemActive, toggleExpandedItems } from '@/lib/sidebar-navigation-helper';
import { AdminNavigationItem, SidebarProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';



export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<string[]>(getExpandedItemsForPath(pathname, adminNavigationItem));

  // Update expanded items when pathname changes
  useEffect(() => {
    setExpandedItems(getExpandedItemsForPath(pathname, adminNavigationItem));
  }, [pathname]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => toggleExpandedItems(prev, itemName));
  };


  const renderNavigationItem = (item: AdminNavigationItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = isItemActive(item, pathname);
    const IconComponent = item.icon;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-4 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              <span className={cn(
                "mr-3",
                isActive ? "text-green-600" : "text-gray-600"
              )}>
                <IconComponent size={20} />
              </span>
              {item.name}
            </div>
            <div className={cn(
              "transition-transform duration-200",
              isExpanded ? "rotate-180" : "rotate-0"
            )}>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </button>

          {isExpanded && (
            <div className="ml-2 mt-2 space-y-1">
              {item.children!.map((child) => {
                if (!child.path) {
                  return null;
                }

                const isChildActive = isChildItemActive(child.path, pathname);
                const ChildIconComponent = child.icon;

                return (
                  <Link
                    key={child.name}
                    href={child.path!}
                    onClick={onClose}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm rounded-lg transition-colors relative",
                      isChildActive
                        ? "bg-green-50 text-green-700 font-medium border-l-2 border-green-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className={cn(
                      "mr-3",
                      isChildActive ? "text-green-600" : "text-gray-400"
                    )}>
                      <ChildIconComponent size={16} />
                    </span>
                    {child.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.path!}
        onClick={onClose}
        className={cn(
          "flex items-center justify-between px-3 py-4 text-sm font-medium rounded-lg transition-colors",
          isActive
            ? "bg-green-50 text-green-700 border-l-4 border-green-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <div className="flex items-center">
          <span className={cn(
            "mr-3",
            isActive ? "text-green-600" : "text-gray-600"
          )}>
            <IconComponent size={20} />
          </span>
          {item.name}
        </div>
        {item.badge && (
          <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white text-gray-900 z-50 border border-r",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Image src={numoniLogoDark} alt="nuMoni" width={120} height={40} priority />

          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* General Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                General
              </h3>
              <div className="space-y-1">
                {adminNavigationItem.slice(0, 2).map(renderNavigationItem)}
              </div>
              <hr className="mt-4 border-gray-200" />
            </div>

            {/* User Management Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                User Management
              </h3>
              <div className="space-y-1">
                {adminNavigationItem.slice(2, 7).map(renderNavigationItem)}
              </div>
              <hr className="mt-4 border-gray-200" />
            </div>

            {/* System Management Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                System Management
              </h3>
              <div className="space-y-1">
                {adminNavigationItem.slice(7, 10).map(renderNavigationItem)}
              </div>
              <hr className="mt-4 border-gray-200" />
            </div>

            {/* Analytics & Reports Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Analytics & Reports
              </h3>
              <div className="space-y-1">
                {adminNavigationItem.slice(11).map(renderNavigationItem)}
              </div>
              {/* <hr className="mt-4 border-gray-200" /> */}
            </div>
          </nav>

          {/* Help Section */}
          {/* <div className="p-4 border-t border-gray-200">
            <div className="bg-green-600 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <HelpCircle size={20} className="text-white" />
              </div>
              <p className="text-sm text-white mb-3">
                Need help? Please check our docs
              </p>
              <button className="bg-white text-green-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                DOCUMENTATION
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}