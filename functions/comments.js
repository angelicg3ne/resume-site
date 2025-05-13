export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const url = new URL(request.url);
    const project = url.searchParams.get("project");

    if (!project) {
      return new Response("Missing project", { status: 400 });
    }

    const { results } = await env.DB.prepare(
      "SELECT name, text, timestamp FROM comments WHERE project = ? ORDER BY timestamp DESC"
    ).bind(project).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "POST") {
    const data = await request.json();
    const { name, text, project } = data;

    if (!name || !text || !project) {
      return new Response("Missing fields", { status: 400 });
    }

    await env.db.prepare(
      "INSERT INTO comments (name, text, project) VALUES (?, ?, ?)"
    ).bind(name, text, project).run();

    return new Response("Comment saved", { status: 200 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

