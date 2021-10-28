export const parsePage = (page) =>
    page
        .filter((item) => item.file_url !== null)
        .map((item) => ({
            name: item.md5,
            imageUrl: item.file_url,
            isNsfw: item.rating === "e" || item.rating === "q",
        }));
