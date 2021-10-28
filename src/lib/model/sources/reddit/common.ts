export const parsePage = (page: unknown) =>
    (page as any).data.children.map(({ data }) => ({
        name: data.title,
        imageUrl: data.url,
        isNsfw: data.over_18,
    }));
