"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id: string;
  name?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  labelledBy: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
}

export function CustomSelect({
  id,
  name,
  value,
  options,
  onChange,
  labelledBy,
  placeholder = "Choose an option",
  required = false,
  invalid = false,
  disabled = false,
  triggerClassName = "",
}: CustomSelectProps) {
  const generatedId = useId();
  const listId = `${generatedId}-options`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function openMenu(index = selectedIndex >= 0 ? selectedIndex : 0) {
    if (!options.length || disabled) return;
    setActiveIndex(index);
    setOpen(true);
  }

  function moveActive(direction: -1 | 1) {
    if (!options.length) return;
    setActiveIndex((current) => (current + direction + options.length) % options.length);
  }

  function chooseOption(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (open) moveActive(1);
      else openMenu();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (open) moveActive(-1);
      else openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      chooseOption(activeIndex);
    } else if ((event.key === "Enter" || event.key === " ") && !open) {
      event.preventDefault();
      openMenu();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="custom-select" ref={rootRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`custom-select__trigger ${triggerClassName}`.trim()}
        role="combobox"
        aria-labelledby={labelledBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled || options.length === 0}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="custom-select__value">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`custom-select__chevron${open ? " is-open" : ""}`} size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="custom-select__menu" id={listId} role="listbox" aria-labelledby={labelledBy}>
          {options.map((option, index) => (
            <div
              className="custom-select__option"
              id={`${listId}-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              data-active={index === activeIndex || undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseOption(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={16} aria-hidden="true" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
