import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

class FieldUtils {
    static cn(...inputs) {
        return twMerge(clsx(inputs));
    }
}
export default FieldUtils;
