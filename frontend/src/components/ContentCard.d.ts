interface Content {
    _id: string;
    title: string;
    link: string;
    type: string;
    tags: any[];
}
interface ContentCardProps {
    content: Content;
    onDelete: (id: string) => void;
    onSuccess?: (message: string) => void;
}
export declare const ContentCard: ({ content, onDelete, onSuccess }: ContentCardProps) => any;
export {};
//# sourceMappingURL=ContentCard.d.ts.map