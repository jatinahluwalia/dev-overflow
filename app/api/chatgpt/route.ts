import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { question } = await req.json();

    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI which answers problems on a help platform.`,
          },
          {
            role: 'user',
            content: `${question}`,
          },
        ],
      }),
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 },
    );
  }
};
