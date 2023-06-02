import type { NextApiRequest, NextApiResponse } from "next";

const INSTANTUSERNAME_API_URL =
  process.env.INSTANTUSERNAME_API_URL || "http://localhost:3001";

interface Service {
  service: string;
  endpoint: string;
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

  try {
    const services = await fetch(
      `${INSTANTUSERNAME_API_URL}/services.json`
    ).then((res) => res.json() as Promise<Service[]>);

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { message: "Internal server error" },
    });
  }
}
