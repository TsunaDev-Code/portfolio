import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, title, message, locale = "en" } = await request.json();
    const t = await getTranslations({ locale, namespace: "ContactModal" });

    if (!name || !email || !title || !message) {
      return NextResponse.json({ message: t("privacyError") }, { status: 400 });
    }

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
      <h2>${t("emailHeading")}</h2>
      <p><strong>${t("emailFrom")}</strong> ${name}</p>
      <p><strong>${t("emailLabel")}</strong> ${email}</p>
      <p><strong>${t("emailTitle")}</strong> ${title}</p>
      <hr>
      <p><strong>${t("emailMessage")}</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    const result = await resend.emails.send({
      from: "noreply@tsuna-dev.com",
      to: "info@tsuna-dev.com",
      replyTo: email,
      subject: `${title}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ message: t("errorMessage") }, { status: 500 });
    }

    return NextResponse.json(
      { message: t("successMessage"), id: result.data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    const fallbackT = await getTranslations({
      locale: "en",
      namespace: "ContactModal",
    });
    return NextResponse.json(
      { message: fallbackT("errorMessage") },
      { status: 500 },
    );
  }
}
