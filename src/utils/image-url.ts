import { IMAGES_HOST } from "constants/server";

export function validateUrl(url: string | URL) {
    try {
        if (url === "") return false;
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export function getImageUrl(src: string) {
    console.log(src);

    if (validateUrl(src)) return src;
    console.log(IMAGES_HOST + src);
    return IMAGES_HOST + src;
}