import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MeetingCreateForm } from "@/components/meeting-create-form";

export default function CreatePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8">
      <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-ink/70 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        처음으로
      </Link>

      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-normal text-ink">모임 생성</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          모임 기본 정보를 입력하면 친구들에게 공유할 참여 링크와 참여 코드가 생성됩니다.
        </p>
        <MeetingCreateForm />
      </section>
    </main>
  );
}
