import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const backendUrl = process.env.PYTHON_API_URL

  if (!backendUrl) {
    return NextResponse.json(
      { error: "PYTHON_API_URL is not configured." },
      { status: 500 },
    )
  }

  try {
    const body = await request.json()
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()

    if (!response.ok) {
      // Keep the backend's response in the Next.js terminal for debugging.
      console.error(
        `Python chat backend returned ${response.status}: ${responseText}`,
      )
      return NextResponse.json(
        { error: "The chat backend failed. Check its Docker logs for details." },
        { status: response.status },
      )
    }

    try {
      return NextResponse.json(JSON.parse(responseText), {
        status: response.status,
      })
    } catch {
      console.error("Python chat backend returned invalid JSON:", responseText)
      return NextResponse.json(
        { error: "The chat backend returned an invalid response." },
        { status: 502 },
      )
    }
  } catch (error) {
    console.error("Could not reach the Python chat backend:", error)
    return NextResponse.json(
      { error: "Could not reach the chat backend. Check that it is running." },
      { status: 502 },
    )
  }
}
