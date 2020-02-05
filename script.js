const Ello = (() => {

    const h = (type, props, ...chn) =>{
        return {
            type,
            props: props || {}, //{} prazni objekt
            chn
        }
    };

    const isEventProp = name => /^on/.test(name); //bolean

    const isCustomProp = name => isEventProp(name) || name === "forceUpdate";
 
    const extractEventName = name => name.slice(2).toLowerCase();
    
    const setProp = (target, name, value) => {
        if (isCustomProp(name)){
            return;
        } else if (name === "className"){
            target.setAttribute("class", value);
        } else {
            target.setAttribute(name, value);
        }
    };

    const removeProp = (target, name, value) => {
        if (isCustomProp(name)){
            return;
        } else if (name === "className"){
            target.removeAttribute("class", value);
        } else {
            target.removeAttribute(name);
        }
    };

    const setProps = (target, props) => {
        Object.keys(props).forEach(name => {
            setProp(target, name, props[name])
        })
    };

    const updateProp = (target, name, newVal, oldVal) => {
        if (!newVal){
            removeProp(target, name, oldVal)
        } else if (!oldVal || newVal !== oldVal){
            setProp(target, name, newVal)
        }
    };

    const updateProps = (target, newProps, oldProps = {}) =>{
        const props = Object.assign({}, newProps, oldProps);
        Object.keys(props).forEach(name =>{
            updateProp(target, name, newProps[name], oldProps[name])
        });
    };

    const addEventListeners = (target, props) =>{
        Object.keys(props).forEach(name => {
            if(isEventProp(name)){
                target.addEventListener(extractEventName(name), props[name])
            }
        });
    };

    const createElement = (node) =>{
        if(typeof node === "string"){
            return document.createTextNode(node);
        }
        const el = document.createElement(node.type);
        setProps(el, node.props);
        addEventListeners(el, node.props);
        node.chn.map(createElement).forEach(el.appendChild.bind(el));
        return el;
    }

    function changed(node1, node2){
        return (
            typeof node1 !== typeof node2 ||
            (typeof node1 === "string" && node1 !== node2) ||
            node1.type !== node2.type
        );
    }

    function update(parent, newNode, oldNode, index = 0){

        if(!oldNode){
            parent.appendChild(createElement(newNode));
        } else if (!newNode){
            parent.removeChild(parent.childNodes[index]);
        } else if (changed(newNode, oldNode)){
            parent.replaceChild(createElement(newNode), parent.childNodes[index]);
        } else if (newNode.type){
            updateProps(parent.childNodes[index], newNode.props, oldNode.props);

            const newLength = newNode.chn.length;
            const oldLength = oldNode.chn.length;

            for (let i = 0; i < newLength || i < oldLength; i++){
                update(parent.childNodes[index], newNode.chn[i], oldNode.chn[i], i);
            }
        }
    }


    return {
        h,
        update
    }
})();

const el = Ello.h("h2", {}, "World");
console.log(el);
Ello.update(document.body, el);

 