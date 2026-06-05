import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5">
      <h1 className="text-3xl font-bold text-ink">모임을 찾을 수 없습니다.</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">
        참여 코드가 잘못되었거나 삭제된 모임입니다.
      </p>
      <Link
        href="/"
        className="focus-ring mt-8 inline-flex w-fit rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        처음으로
      </Link>
    </main>
  );
}
