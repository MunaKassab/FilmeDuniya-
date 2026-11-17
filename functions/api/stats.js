export async function onRequestGet({ env }) {
    try {
        const result = await env.DB.prepare(`
            SELECT views, plays
            FROM movie_stats
            WHERE id = ?
        `).bind("premada-oorali-2026").first();

        const visitors = await env.DB.prepare(`
            SELECT COUNT(*) AS total
            FROM movie_visitors
        `).first();

        return Response.json({
            success: true,
            views: result?.views || 0,
            plays: result?.plays || 0,
            visitors: visitors?.total || 0
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
