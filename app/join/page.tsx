import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JoinCodeForm } from "@/components/join-code-form";

export default function JoinPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-5 py-8">
      <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-ink/70 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        처음으로
      </Link>

      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-normal text-ink">모임 참가</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          공유받은 참여 코드를 입력하세요.
        </p>
        <JoinCodeForm />
      </section>
    </main>
  );
}
