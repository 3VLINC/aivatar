import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    ...prefix("api", [
        route("generateSigner", "./routes/api/generateSigner.tsx"),
        route("updateLocation", "./routes/api/updateLocation.tsx"),
        route("getSigner", "./routes/api/getSigner.tsx"),
      ]),
] satisfies RouteConfig;
