'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  placeholder: string;
  onSelect?: (value: string) => void;
  onEmpty?: () => void;
  defaultValue?: string;
}

export default function Search({ placeholder, onSelect, onEmpty, defaultValue = '' }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await fetch(`/api/customers?keyword=${encodeURIComponent(value)}`);
      const data = await res.json();
      const names: string[] = data.map((c: any) => c.name).slice(0, 10);
      setSuggestions(names);
    }, 300);
    return () => clearTimeout(timer.current);
  }, [value]);

  function handleSelect(name: string) {
    setValue(name);
    setShow(false);
    onSelect?.(name);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          setShow(true);
          if (val.trim() === '') {
            setSuggestions([]);
            onEmpty?.();
          }
        }}
        onFocus={() => value && setShow(true)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

      {show && suggestions.length > 0 && (
        <ul className="absolute z-20 top-full mt-1 w-full bg-white border rounded-md shadow text-sm max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => handleSelect(s)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
