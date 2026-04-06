export async function callSphinxOSStream(idea: string) {
  const response = await fetch(process.env.SPHINXOS_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SPHINXOS_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `You are UnicornOS Core. Evaluate the startup idea using holographic principles where applicable.`,
      idea,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) throw new Error('SphinxOS unavailable');
  return response.body;
}
