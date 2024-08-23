import { prisma } from "@/db/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

type responseType = {
  success: boolean;
  message: string;
  statusCode: number;
  messages?: object[];
};

const inputTypeValidation = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters long"),
    voting_choice: z.boolean(),
    casted_at: z.string().datetime(),
  })
  .strict();
type inputType = z.infer<typeof inputTypeValidation>;

// Create new user

export async function POST(request: NextRequest) {
  try {
    const body: inputType = await request.json();

    const zodResponse = inputTypeValidation.safeParse(body);

    if (zodResponse.success === false) {
      const errorResponse: responseType = {
        success: false,
        message: fromZodError(zodResponse?.error).message,
        statusCode: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        voting_choice: body.voting_choice,
        casted_at: body.casted_at,
      },
    });

    const successResponse: responseType = {
      success: true,
      message: "User created successfully",
      statusCode: 200,
      messages: [{ user }],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in creating user");
    console.log(err);
    const errorResponse: responseType = {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
      messages: [{ err }],
    };
    return NextResponse.json(errorResponse);
  }
}

// Get all users

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const successResponse: responseType = {
      success: true,
      message: "Users fetched successfully",
      statusCode: 200,
      messages: [{ users }],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
      messages: [{ err }],
    };
    return NextResponse.json(errorResponse);
  }
}
