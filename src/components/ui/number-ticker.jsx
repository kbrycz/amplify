import React from "react";

export function NumberTicker({ value, className = "" }) {
  const stringValue = typeof value === 'number' ? value.toLocaleString() : value.toString();

  return (
    <div className={`${className} tabular-nums`}>
      {stringValue.split("").map((digit, index) => (
        <span
          key={index}
          className={`inline-block relative h-[1.1em] overflow-hidden ${digit === "," ? "mr-[0.1em]" : digit === "." ? "mr-0" : ""}`}
          style={{ width: digit === "," ? "0.1em" : digit === "." ? "0.1em" : "0.6em" }}
        >
          <span
            className="absolute inset-0 flex flex-col items-center transition-transform duration-500"
            style={{
              transform: isNaN(digit) ? "none" : `translateY(-${Number(digit) * 100}%)`,
            }}
          >
            {isNaN(digit) ? (
              <span className="flex h-[1.1em] items-center justify-center">,</span>
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span
                key={n}
                className="flex h-[1.1em] items-center justify-center"
                aria-hidden={n !== Number(digit)}
              >
                {n}
              </span>
            )))}
          </span>
          {isNaN(digit) && <span className="absolute inset-0 flex items-center justify-center">{digit}</span>}
        </span>
      ))}
    </div>
  );
}