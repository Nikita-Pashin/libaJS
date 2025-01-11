import {FiberNode} from "./create-fiber-node.ts";

export const reconsilation = (oldFiber: FiberNode | string | number, newFiber: FiberNode | string | number) => {
    if (!oldFiber && !newFiber) return null;

    if (oldFiber === undefined) {
        return { type: 'CREATE', newVNode: newFiber, newFiberType: newFiber?.type };
    }
    if (!newFiber) {
        return { type: 'REMOVE', oldFiberType: oldFiber.type };
    }
    if (oldFiber === null || typeof oldFiber !== typeof newFiber || oldFiber?.type !== newFiber.type) {
        return { type: 'REPLACE', newVNode: newFiber, newFiberType: newFiber.type, oldFiberType: oldFiber?.type   };
    }
    if (typeof newFiber === 'string' || typeof newFiber === 'number') {
        if (oldFiber !== newFiber) {
            return { type: 'TEXT', newVNode: newFiber, newFiberType: typeof newFiber };
        } else {
            return null;
        }
    }

    const patch = {
        type: 'UPDATE',
        props: diffProps(oldFiber.props, newFiber.props),
        sibling: null,
        parent: null,
        newFiberType: newFiber.type,
        oldFiberType: oldFiber.type
    };

    diffChildren(oldFiber.child, newFiber.child, patch);

    return patch;
}

function diffProps(oldProps, newProps) {
    const patches = [];

    for (let key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patches.push({ key, value: newProps[key] });
        }
    }

    for (let key in oldProps) {
        if (!(key in newProps)) {
            patches.push({ key, value: undefined });
        }
    }

    return patches;
}

function diffChildren(oldChild, newChild, patch) {
    if (oldChild || newChild) {
        patch.child = reconsilation(oldChild, newChild);
    }

    let oldChildSibling = oldChild.sibling;
    let newChildSibling = newChild.sibling;

    patch.sibling = reconsilation(oldChildSibling, newChildSibling);
}