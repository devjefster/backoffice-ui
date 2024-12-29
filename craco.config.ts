import path from "path";

export default {
    webpack: {
        alias: {
            "@components": path.resolve(__dirname, "src/components"),
            "@features": path.resolve(__dirname, "src/features"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@assets": path.resolve(__dirname, "src/assets"),
        },
    },
};
