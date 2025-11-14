"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import type { MenuItem } from "../lib/menuData";
import { ArrowLeft, ChevronRight } from "lucide-react";

type Direction = "forward" | "back";

export type NestedMenuDrawerProps = {
  menu: MenuItem[];
  isOpen: boolean;
  onOpenChange: (next: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement>;
  onLeafSelect?: (item: MenuItem) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const MAX_UPWARD_DRAG = -80;
const DEFAULT_MAX_DOWNWARD_DRAG = 480;
const CLOSE_THRESHOLD_PX = 120;

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  ).filter((node) => !node.hasAttribute("data-focus-guard"));

export const NestedMenuDrawer = ({
  menu,
  isOpen,
  onOpenChange,
  triggerRef,
  onLeafSelect,
}: NestedMenuDrawerProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<MenuItem[]>([]);
  const [direction, setDirection] = useState<Direction>("forward");
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragPointerId = useRef<number | null>(null);
  const dragStartY = useRef(0);
  const dragOffsetRef = useRef(0);
  const currentItems = useMemo(() => {
    if (breadcrumbs.length === 0) return menu;
    const parent = breadcrumbs[breadcrumbs.length - 1];
    return parent.children ?? [];
  }, [breadcrumbs, menu]);

  const breadcrumbLabel =
    breadcrumbs.length === 0
      ? "Top-level navigation"
      : `${breadcrumbs.map((crumb) => crumb.title).join(" → ")}`;

  const levelKey =
    breadcrumbs.length === 0
      ? "root"
      : breadcrumbs.map((crumb) => crumb.id).join("-");

  const sheetMotionClass = isDragging
    ? "transition-none"
    : "transition-transform duration-300 ease-out";

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    const resetId = window.requestAnimationFrame(() => {
      setIsDragging(false);
      setDragOffset(0);
      dragPointerId.current = null;
    });
    return () => window.cancelAnimationFrame(resetId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;
    const raf = window.requestAnimationFrame(() => {
      const firstButton = listRef.current?.querySelector<HTMLButtonElement>(
        "[data-menu-item]"
      );
      firstButton?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [currentItems, isOpen]);

  const handleDrawerClose = useCallback(() => {
    onOpenChange(false);
    setBreadcrumbs([]);
    setDirection("forward");
  }, [onOpenChange]);

  const handleBack = useCallback(() => {
    if (breadcrumbs.length === 0) return;
    setDirection("back");
    setBreadcrumbs((prev) => prev.slice(0, -1));
  }, [breadcrumbs.length]);

  const handleItemInvoke = useCallback(
    (item: MenuItem) => {
      if (item.children?.length) {
        setDirection("forward");
        setBreadcrumbs((prev) => [...prev, item]);
        return;
      }
      onLeafSelect?.(item);
    },
    [onLeafSelect]
  );

  const handleMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLUListElement>) => {
      const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          "[data-menu-item]"
        )
      );
      if (!buttons.length) return;

      const activeElement = document.activeElement as HTMLButtonElement | null;
      const currentIndex = activeElement ? buttons.indexOf(activeElement) : -1;

      const focusButton = (nextIndex: number) => {
        buttons[nextIndex]?.focus();
      };

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = (currentIndex + 1 + buttons.length) % buttons.length;
          focusButton(nextIndex);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const nextIndex =
            (currentIndex - 1 + buttons.length) % buttons.length;
          focusButton(nextIndex);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusButton(0);
          break;
        }
        case "End": {
          event.preventDefault();
          focusButton(buttons.length - 1);
          break;
        }
        case "ArrowLeft": {
          if (breadcrumbs.length === 0) break;
          event.preventDefault();
          handleBack();
          break;
        }
        case "ArrowRight": {
          if (!activeElement) break;
          if (activeElement.dataset.hasChildren !== "true") break;
          event.preventDefault();
          const targetId = activeElement.dataset.itemId;
          const targetItem = currentItems.find((entry) => entry.id === targetId);
          if (targetItem) {
            handleItemInvoke(targetItem);
          }
          break;
        }
        default:
          break;
      }
    },
    [breadcrumbs.length, currentItems, handleBack, handleItemInvoke]
  );

  const handleDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isOpen) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      dragPointerId.current = event.pointerId;
      dragStartY.current = event.clientY - dragOffsetRef.current;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [isOpen]
  );

  const handleDragMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || dragPointerId.current !== event.pointerId) return;
      event.preventDefault();
      const maxDownward =
        typeof window === "undefined"
          ? DEFAULT_MAX_DOWNWARD_DRAG
          : window.innerHeight;
      const delta = event.clientY - dragStartY.current;
      const nextOffset = clamp(delta, MAX_UPWARD_DRAG, maxDownward);
      setDragOffset(nextOffset);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragPointerId.current !== event.pointerId) return;
      event.preventDefault();
      dragPointerId.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      const offset = dragOffsetRef.current;
      setIsDragging(false);
      setDragOffset(0);
      if (offset > CLOSE_THRESHOLD_PX) {
        handleDrawerClose();
      }
    },
    [handleDrawerClose]
  );

  const maintainFocusTrap = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = getFocusableElements(drawerRef.current);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDrawerClose();
        return;
      }
      maintainFocusTrap(event);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleDrawerClose, isOpen, maintainFocusTrap]);

  return (
    <div
      className={`fixed inset-0 z-40 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleDrawerClose}
        aria-hidden="true"
      />

      <div
        className={`absolute inset-x-0 bottom-0 flex justify-center px-4 pb-6 ${sheetMotionClass}`}
        role="presentation"
        style={{
          transform: isOpen ? `translateY(${dragOffset}px)` : "translateY(100%)",
        }}
      >
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="drawer-panel w-full max-w-md rounded-[32px] bg-white p-6 text-left shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex-1">
              {breadcrumbs.length > 0 ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  onClick={handleBack}
                  aria-label="Go back one level"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
              ) : (
                <span aria-hidden className="block h-10" />
              )}
            </div>
            <div
              className="handle-pill inline-flex h-2 w-12 shrink-0 cursor-grab select-none rounded-full bg-zinc-200/90 touch-none active:cursor-grabbing"
              aria-hidden="true"
              role="presentation"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            />
            <span className="flex-1" aria-hidden="true" />
          </div>
          <div className="max-h-[65vh] overflow-y-auto">
            <ul
              key={`${levelKey}-${direction}`}
              ref={listRef}
              role="menu"
              aria-label={breadcrumbLabel}
              className={`menu-level divide-y divide-zinc-100 ${
                direction === "forward"
                  ? "menu-level--forward"
                  : "menu-level--back"
              }`}
              onKeyDown={handleMenuKeyDown}
            >
              {currentItems.map((item) => (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    data-menu-item
                    data-item-id={item.id}
                    data-has-children={item.children ? "true" : "false"}
                    role="menuitem"
                    aria-haspopup={item.children ? "true" : undefined}
                    className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={() => handleItemInvoke(item)}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-2xl">
                      <item.icon className="h-6 w-6 text-zinc-600" />
                    </span>
                    <span className="flex-1">
                      <p className="text-base font-semibold text-zinc-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-zinc-500">{item.subtitle}</p>
                    </span>
                    {item.children ? (
                      <ChevronRight
                        className="h-5 w-5 text-zinc-300"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
