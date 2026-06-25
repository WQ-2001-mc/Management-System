import { z } from "zod";

export const customerInput = z.object({
  name: z.string().trim().min(2, "客户名称至少需要 2 个字符").max(100),
  industry: z.string().trim().max(60).default("其他"),
  region: z.string().trim().max(30).default("华东"),
  level: z.enum(["A", "B", "C"]).default("B"),
  owner: z.string().trim().max(40).default("李明远"),
  contact: z.string().trim().max(40).optional(),
  phone: z.string().trim().max(30).optional(),
  value: z.number().nonnegative().default(0),
});

export type CustomerInput = z.infer<typeof customerInput>;

