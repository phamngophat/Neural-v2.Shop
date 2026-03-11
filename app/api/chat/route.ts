import { PRODUCTS } from "@/lib/products";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("Chat API called with native REST fetch");
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return NextResponse.json({
                response: "Hệ thống AI chưa được cấu hình API Key. Vui lòng thêm GEMINI_API_KEY vào biến môi trường."
            });
        }

        // Build a detailed context about the shop and its products to guide Gemini
        const storeContext = `
You are a highly intelligent, professional, and helpful AI support assistant for "NeuralShop"(an e - commerce platform).
Your tone should be friendly, polite, and helpful in Vietnamese.

** IMPORTANT RULES:**
    1. You can answer ANY general knowledge questions(e.g., coding, science, writing, translation, general advice) just like a normal AI(Gemini / ChatGPT).
2. IF the user asks about ANY products, services, pricing, or the store itself, you MUST use the following product catalog to answer.
3. If the user asks about a product not in the catalog, politely say NeuralShop currently doesn't offer it, but you are still happy to chat about it generally.
4. Format prices with "đ"(e.g., 499.000đ).
5. Use markdown for better readability(bolding, lists).

** NEURALSHOP PRODUCT CATALOG:**
        ${PRODUCTS.map(p => `- **${p.name}**: ${p.price.toLocaleString("vi-VN")}đ. Category: ${p.category}. Details: ${p.description}`).join('\n')}

** Store Info:**
    - Categories: AI Tools, Game Services, Social Media.
- We pride ourselves on quick delivery, safe usage, and premium quality.
`;

        try {
            // Call Gemini REST API natively to bypass any NPM package issues
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: message }] }
                    ],
                    systemInstruction: {
                        role: "system",
                        parts: [{ text: storeContext }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Gemini API Error Response:", errText);
                throw new Error("Failed to fetch from Gemini API");
            }

            const data = await res.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";

            return NextResponse.json({ response: aiText });
        } catch (apiError: any) {
            console.error("Gemini API Error Catch:", apiError);
            return NextResponse.json({
                response: "Xin lỗi quý khách, hệ thống AI (Gemini) hiện tại đang bị lỗi kết nối hoặc hết hạn ngạch. Vui lòng thử lại sau giây lát. 🙏"
            });
        }

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
