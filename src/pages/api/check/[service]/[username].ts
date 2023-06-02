import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const INSTANTUSERNAME_API_URL =
  process.env.INSTANTUSERNAME_API_URL || "http://localhost:3001";

interface Check {
  service: string;
  url: string;
  available: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (!method) {
    return res.status(400).json({
      error: { message: "Invalid request" },
    });
  }

  if (method !== "GET") {
    return res.status(405).json({
      error: { message: `Method ${method} Not Allowed` },
    });
  }

  const schema = z.object({
    service: z.string(),
    username: z.string(),
  });

  const response = schema.safeParse(req.query);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: { message: "Invalid request", errors },
    });
  }

  const { service, username } = response.data;

  try {
    const check = await fetch(
      `${INSTANTUSERNAME_API_URL}/check/${service.toLowerCase()}/${username}`
    ).then((res) => res.json() as Promise<Check>);

    return res.status(200).json(check);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: "Internal server error" },
    });
  }
}
