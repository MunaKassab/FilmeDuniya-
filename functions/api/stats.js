export async function onRequestGet({ request, env }) {
    try {
        const url = new URL(request.url);
        const movieId = url.searchParams.get("movieId");

        if (!movieId) {
            return Response.json({
                success: false,
                error: "Movie ID required"
            }, { status: 400 });
        }

        await env.DB.prepare(`
            INSERT OR IGNORE INTO movie_stats (id, views, plays)
            VALUES (?, 0, 0)
        `).bind(movieId).run();

        const result = await env.DB.prepare(`
            SELECT views, plays
            FROM movie_stats
            WHERE id = ?
        `).bind(movieId).first();

        const visitors = await env.DB.prepare(`
            SELECT COUNT(*) AS total
            FROM movie_visitors
            WHERE movie_id = ?
        `).bind(movieId).first();

        return Response.json({
            success: true,
            views: result.views,
            plays: result.plays,
            visitors: visitors.total
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
