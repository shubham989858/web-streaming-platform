// "use client"

// import { useState, useRef } from "react"

// const LENGTH = 6

// const HomePage = () => {
//   const [otp, setOtp] = useState<string[]>(Array(LENGTH).fill(""))

//   const inputsRef = useRef<Array<HTMLInputElement | null>>([])

//   console.log(otp.join(""))

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const value = e.target.value.replace(/\D/g, "")

//     if (!value) {
//       return
//     }

//     const next = [...otp]

//     next[index] = value[0]

//     setOtp(next)

//     if (index < 5) {
//       inputsRef.current[index + 1]?.focus()

//       inputsRef.current[index + 1]?.select()
//     }
//   }

//   const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     const isDeleteKey = e.key === "Backspace" || e.key === "Delete"

//     if (!isDeleteKey) {
//       return
//     }

//     if (index === 0 && !otp[0]) {
//       return
//     }

//     if (!e.repeat) {
//       e.preventDefault()
//     }

//     const next = [...otp]

//     if (!!otp[index]) {
//       next[index] = ""

//       setOtp(next)
//     } else if (index > 0) {
//       inputsRef.current[index - 1]?.focus()

//       inputsRef.current[index - 1]?.select()

//       next[index - 1] = ""

//       setOtp(next)
//     }
//   }

//   const onPaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
//     e.preventDefault()

//     const copiedText = e.clipboardData.getData("text") || ""

//     const value = (copiedText.match(/^\d+/)?.[0] || "").slice(0, LENGTH - index)

//     if (!value) {
//       return
//     }

//     const next = [...otp]

//     value.split("").forEach((item, index) => {
//       next[index + 1] = item
//     })

//     setOtp(next)

//     const after = index + value.length

//     if (after < LENGTH) {
//       inputsRef.current[index + 1]?.focus();

//       inputsRef.current[index + 1]?.select();
//     }
//   }

//   return (
//     <div className="p-10">
//       <div className="max-w-md">
//         <div className={`grid grid-cols-${LENGTH} gap-x-2`}>

//           {otp.map((item, index) => (
//             <input className="h-10 px-3 rounded-lg border border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-center" key={index} ref={(element: HTMLInputElement | null) => {
//               inputsRef.current[index] = element
//             }} type="text" disabled={false} value={item} onChange={(e) => onChange(e, index)} onKeyDown={(e) => onKeyDown(e, index)} inputMode="numeric" pattern="\d*" maxLength={1} onPaste={(e) => onPaste(e, index)} />
//           ))}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default HomePage

"use client";

import { useState, useRef } from "react";

/* ── CONFIG ────────────────────────────────────────────── */
const LENGTH = 6;                        // change if you want 4, 8, …
const CODE_TYPE: CodeType = "numeric"; // "numeric" | "alphanumeric" | "alphanumeric-uppercase"
/* ─────────────────────────────────────────────────────── */

type CodeType = "numeric" | "alphanumeric" | "alphanumeric-uppercase";

const sanitizeText = (text: string, mode: CodeType) => {
  switch (mode) {
    case "numeric":
      return text.replace(/[^0-9]/g, "");
    case "alphanumeric":
      return text.replace(/[^A-Za-z0-9]/g, "");
    case "alphanumeric-uppercase":
      return text.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }
};

export default function OtpInputDemo() {
  const [otp, setOtp] = useState<string[]>(Array(LENGTH).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (i: number) => {
    refs.current[i]?.focus();
    refs.current[i]?.select();
  };

  /* ────── TYPE ONE CHAR ────── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = sanitizeText(e.target.value, CODE_TYPE)[0] ?? "";
    if (!char) return;

    const next = [...otp];
    next[idx] = char;
    setOtp(next);

    if (idx < LENGTH - 1) focusAt(idx + 1);
  };

  /* ────── BACKSPACE / DELETE ────── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const delKey = e.key === "Backspace" || e.key === "Delete";
    if (!delKey) return;

    if (idx === 0 && !otp[0]) return;          // native noop
    if (!e.repeat) e.preventDefault();

    const next = [...otp];

    if (otp[idx]) {
      next[idx] = "";
    } else if (idx > 0) {
      focusAt(idx - 1);
      next[idx - 1] = "";
    }
    setOtp(next);
  };

  /* ────── PASTE ────── */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();

    const raw = e.clipboardData.getData("text") || "";
    const allowed = sanitizeText(raw, CODE_TYPE)
      .slice(0, LENGTH - idx);       // never overflow
    if (!allowed) return;

    const next = [...otp];
    // clear boxes from idx onward, then drop new chars
    for (let i = idx; i < LENGTH; i++) next[i] = "";
    allowed.split("").forEach((ch, i) => {
      next[idx + i] = ch;
    });

    setOtp(next);

    const nextFocus = Math.min(idx + allowed.length, LENGTH - 1);
    focusAt(nextFocus);
  };

  /* ────── RENDER ────── */
  const inputMode = CODE_TYPE === "numeric" ? "numeric" : "text";
  const pattern = CODE_TYPE === "numeric" ? "\\d*" : "[A-Za-z0-9]*";

  return (
    <div className="p-10">
      <div className="max-w-md">
        <div className={`grid grid-cols-${LENGTH} gap-x-2`}>
          {otp.map((char, idx) => (
            <input
              key={idx}
              ref={(el) => {
                refs.current[idx] = el
              }}
              value={char}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={(e) => handlePaste(e, idx)}
              inputMode={inputMode}
              pattern={pattern}
              maxLength={1}
              className="h-10 w-10 rounded-lg border border-zinc-700 text-center tracking-widest
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
