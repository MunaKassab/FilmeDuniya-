export async function onRequestPost({ env }) {
    try {
        await env.DB.prepare(`
            UPDATE movie_stats
            SET views = views + 1
            WHERE id = ?
        `).bind("premada-oorali-2026").run();

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
