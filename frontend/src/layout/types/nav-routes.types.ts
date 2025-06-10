export type NavRoute = {
    path: string;
    element: string;
    children?: NavRoute[];
    isProtected?: boolean;
    isPublic?: boolean;
}