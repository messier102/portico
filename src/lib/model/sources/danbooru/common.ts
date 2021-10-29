export const parsePage = (page) =>
    page
        .filter((item) => item.file_url !== null)
        .map((item) => ({
            name: item.md5,
            imageUrl: item.file_url,
            isNsfw: item.rating === "e" || item.rating === "q",
        }));

type Timestamp = string;

// The actually used schema is a little different from the one described on the
// API help page: https://danbooru.donmai.us/wiki_pages/api%3Aposts
export type DanbooruPost = {
    id: number;
    uploader_id: number;
    approver_id: number;
    tag_string: string;
    tag_string_general: string;
    tag_string_artist: string;
    tag_string_copyright: string;
    tag_string_character: string;
    tag_string_meta: string;
    rating: "s" | "q" | "e" | null;
    parent_id: number | null;
    source: string;
    md5: string;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
    file_ext: string;
    file_size: number;
    image_width: number;
    score: number;
    fav_count: number;
    tag_count_general: number;
    tag_count_artist: number;
    tag_count_copyright: number;
    tag_count_character: number;
    tag_count_meta: number;
    last_comment_bumped_at: Timestamp | null;
    last_noted_at: Timestamp | null;
    has_children: boolean;
    is_note_locked: boolean;
    is_rating_locked: boolean;
    image_height: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    up_score: number;
    down_score: number;
    is_pending: boolean;
    is_flagged: boolean;
    is_deleted: boolean;
    tag_count: number;
    is_banned: boolean;
    pixiv_id: number | null;
    has_active_children: boolean;
    bit_flags: number;
    has_large: boolean;
    has_visible_children: boolean;
};

export type DanbooruStatus = {
    success: boolean;
    message: string;
    backtrace: string[];
};

export type DanbooruPage = DanbooruPost[];

export type DanbooruResponse = DanbooruPage | DanbooruStatus;

export function isPage(page: DanbooruResponse): page is DanbooruPage {
    return (page as DanbooruPage).length !== undefined;
}
