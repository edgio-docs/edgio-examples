export default function filterEdges(edges) {
    return (edges === null || edges === void 0 ? void 0 : edges.filter((edge)=>!!edge
    )) ?? [];
};
