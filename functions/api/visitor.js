export async function onRequestPost({ request, env }) {
    try {
        const data = await request.json();

        const visitorId = data.visitorId;

        if (!visitorId) {
            return Response.json({
                success: false,
                error: "Visitor ID required"
            }, { status: 400 });
        }

        const now = new Date().toISOString();

        await env.DB.prepare(`
            INSERT OR IGNORE INTO movie_visitors
            (visitor_id, first_seen, last_seen)
            VALUES (?, ?, ?)
        `).bind(visitorId, now, now).run();

        const total = await env.DB.prepare(`
            SELECT COUNT(*) AS total
            FROM movie_visitors
        `).first();

        return Response.json({
            success: true,
            visitors: total.total
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
