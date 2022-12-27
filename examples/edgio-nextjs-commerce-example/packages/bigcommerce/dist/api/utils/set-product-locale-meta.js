export default function setProductLocaleMeta(node) {
    var ref;
    if ((ref = node.localeMeta) === null || ref === void 0 ? void 0 : ref.edges) {
        node.localeMeta.edges = node.localeMeta.edges.filter((edge)=>{
            const { key , value  } = (edge === null || edge === void 0 ? void 0 : edge.node) ?? {};
            if (key && key in node) {
                node[key] = value;
                return false;
            }
            return true;
        });
        if (!node.localeMeta.edges.length) {
            delete node.localeMeta;
        }
    }
};
