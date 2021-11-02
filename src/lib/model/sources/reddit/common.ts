import type { Image, SourceResponse } from "$lib/model/ImageSource";

export type RedditResponse = RedditListing | RedditStatus;

export function isListing(response: RedditResponse): response is RedditListing {
    return (response as RedditListing).kind === "Listing";
}

export type RedditStatus = {
    error: number;
    message: string;
    reason?: string;
};

export type RedditListing = {
    kind: "Listing";
    data: {
        before: string | null;
        after: string | null;
        dist: number;
        modhash: string;
        geo_filter: unknown | null;
        children: { kind: "t3"; data: RedditLink }[];
    };
};

// `unknown` fields are those that were set to something like null or [] in the
// response I was using to make the schema off of.
export type RedditLink = {
    approved_at_utc: unknown | null;
    subreddit: string;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title: string | null;
    gilded: number;
    clicked: boolean;
    is_gallery: boolean;
    title: string;
    link_flair_richtext: unknown[];
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: unknown | null;
    link_flair_css_class: unknown | null;
    downs: number;
    thumbnail_height: number;
    top_awarded_type: unknown | null;
    hide_score: boolean;
    media_metadata: Record<string, unknown>; // TODO
    name: string;
    quarantine: boolean;
    link_flair_text_color: string;
    upvote_ratio: number;
    author_flair_background_color: unknown | null;
    ups: number;
    domain: string;
    media_embed: unknown;
    thumbnail_width: number;
    author_flair_template_id: unknown | null;
    is_original_content: boolean;
    user_reports: unknown[];
    secure_media: unknown | null;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: unknown | null;
    secure_media_embed: unknown;
    gallery_data: { items: { media_id: string; id: number }[] };
    link_flair_text: unknown | null;
    can_mod_post: boolean;
    score: number;
    approved_by: unknown | null;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean;
    author_flair_css_class: unknown | null;
    author_flair_richtext: unknown[];
    gildings: unknown;
    content_categories: unknown | null;
    is_self: boolean;
    subreddit_type: string;
    created: number;
    link_flair_type: string;
    wls: unknown | null;
    removed_by_category: unknown | null;
    banned_by: unknown | null;
    author_flair_type: string;
    total_awards_received: number;
    allow_live_comments: boolean;
    selftext_html: unknown | null;
    likes: unknown | null;
    suggested_sort: unknown | null;
    banned_at_utc: unknown | null;
    url_overriden_by_dest: string;
    view_count: unknown | null;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    all_awardings: unknown[];
    awarders: unknown[];
    media_only: boolean;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text: unknown | null;
    treatment_tags: unknown[];
    visited: boolean;
    removed_by: unknown | null;
    mod_note: unknown | null;
    distinguished: unknown | null;
    subreddit_id: string;
    author_is_blocked: boolean;
    mod_reason_by: unknown | null;
    num_reports: unknown | null;
    removal_reason: unknown | null;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons: unknown | null;
    author: string;
    discussion_type: unknown | null;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: unknown | null;
    contest_mode: boolean;
    mod_reports: unknown[];
    author_patreon_flair: boolean;
    author_flair_text_color: unknown | null;
    permalink: string;
    parent_whitelist_status: unknown | null;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media: unknown | null;
    is_video: boolean;
};

export function getRedditPageUrl(baseUrl: URL, pageId: string | null): URL {
    const url = new URL(baseUrl);
    if (pageId) {
        url.searchParams.set("after", String(pageId));
    }
    return url;
}

export function parseRedditResponse(
    response: RedditResponse
): SourceResponse<string> {
    if (!isListing(response)) {
        return { status: "invalid" };
    }

    if (response.data.dist === 0) {
        return { status: "exhausted" };
    }

    const images = response.data.children.map(
        ({ data }): Image => ({
            name: data.title,
            imageUrl: data.url,
            isNsfw: data.over_18,
        })
    );

    return {
        status: "success",
        images,
        nextPageId: response.data.after,
    };
}
