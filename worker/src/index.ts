const COMMANDER_SPELLBOOK_URL =
  "https://backend.commanderspellbook.com/find-my-combos";

async function getComboResponse(body: string) {
  const response = await fetch(COMMANDER_SPELLBOOK_URL, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });

  return JSON.stringify((await response.json())["results"]);
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const combos = await getComboResponse(await request.text());

    return new Response(combos, {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  },
} satisfies ExportedHandler;
