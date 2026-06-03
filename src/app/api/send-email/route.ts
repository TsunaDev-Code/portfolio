import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, title, message } = await request.json();
    console.log("message: ", message);
    console.log("title: ", title);
    console.log("email: ", email);
    console.log("name: ", name);

    // Валидация
    if (!name || !email || !title || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
      <h2>New Message from TsunaDev</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Title:</strong> ${title}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    const result = await resend.emails.send({
      from: email,
      to: "info@tsuna-dev.com",
      replyTo: email,
      subject: `${title}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: result.data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
