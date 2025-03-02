import {format, parseISO} from "date-fns";

export const formatarData = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
        return format(parseISO(dateString), "dd/MM/yyyy");
    } catch {
        return "N/A";
    }
};
