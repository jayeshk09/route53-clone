"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}

interface ActionMenuProps {
  items: MenuItem[];
}

const MENU_WIDTH = 150;

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const gap = 4;
    const viewportH = window.innerHeight;

    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    let top: number;
    if (spaceBelow >= menuHeight + gap || spaceBelow >= spaceAbove) {
      top = rect.bottom + gap;
    } else {
      top = rect.top - menuHeight - gap;
    }

    let left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8);
    if (left < 8) left = 8;

    setPosition({ top, left });
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(!open);
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              minWidth: `${MENU_WIDTH}px`,
            }}
          >
            {items.map((item, i) => {
              const classes = `block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                item.danger ? "text-red-600" : "text-gray-700"
              }`;

              if (item.href) {
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={classes}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={i}
                  className={classes}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}