import { z } from "zod";

export const createMeetingSchema = z
  .object({
    title: z.string().trim().min(1, "모임명을 입력하세요.").max(80, "모임명은 80자 이하로 입력하세요."),
    expectedCount: z.coerce.number().int().min(1, "모임 인원은 1명 이상이어야 합니다.").max(100, "모임 인원은 100명 이하로 입력하세요."),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "시작일을 선택하세요."),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "종료일을 선택하세요.")
  })
  .refine((value) => value.startDate <= value.endDate, {
    message: "종료일은 시작일과 같거나 뒤여야 합니다.",
    path: ["endDate"]
  })
  .refine((value) => {
    const start = new Date(`${value.startDate}T00:00:00`);
    const end = new Date(`${value.endDate}T00:00:00`);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff <= 90;
  }, {
    message: "선택 가능 기간은 최대 90일입니다.",
    path: ["endDate"]
  });
