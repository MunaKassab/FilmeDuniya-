export async function onRequestPost({ request, env }) {
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

        await env.DB.prepare(`
            UPDATE movie_stats
            SET views = views + 1
            WHERE id = ?
        `).bind(movieId).run();

        return Response.json({
            success: true,
            message: "View counted"
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
