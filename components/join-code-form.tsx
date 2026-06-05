"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";

export function JoinCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (normalizedCode.length === 0) {
      return;
    }
    router.push(`/m/${normalizedCode}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-line bg-white p-5 shadow-soft">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">참여 코드</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="예: AB12CD"
          className="focus-ring rounded-md border border-line px-3 py-3 text-base uppercase tracking-widest"
        />
      </label>
      <button
        type="submit"
        disabled={code.trim().length === 0}
        className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/35"
      >
        <LogIn size={16} aria-hidden />
        입장
      </button>
    </form>
  );
}
