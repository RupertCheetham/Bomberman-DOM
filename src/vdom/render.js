const renderElem = ({ tagName, attrs, children } = null) => {
  //console.log("Rendering element:", tagName, attrs, children);
  // create the element
  //   e.g. <div></div>
  const $el = document.createElement(tagName);

  // add all attributs as specified in vNode.attrs
  //   e.g. <div id="app"></div>
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v);
  }

  // append all children as specified in vNode.children
  //   e.g. <div id="app"><img></div>
  for (const child of children) {
    //console.log("Rendering child:", child);
    if (render(child) == null) {
      //console.log("Skipping null child");
      continue
    }
    $el.appendChild(render(child));
  }

  return $el;
};


const render = vNode => {
  //console.log("Rendering vNode:", vNode);
  if (vNode == null) {
    return
  }

  if (typeof vNode === 'string') {
    //console.log("Rendering text node:", vNode);
    return document.createTextNode(vNode);
  }

  // we assume everything else to be a virtual element
  //console.log("Rendering element:", vNode);
  return renderElem(vNode);
};

export default render;


// MODIFIED FUNCTION TO DEAL WITH NULL VALUE BUG THAT HAS BEEN SOLVED, KEEP FOR REFERENCE FOR NOW
// const renderElem = ({ tagName, attrs = {}, children } = {}) => {
//   //console.log("Rendering element:", { tagName, attrs, children });

//   // Create the element
//   const $el = document.createElement(tagName);

//   // Check if attrs is not undefined before trying to access it
//   if (attrs && Object.entries(attrs).length > 0) {
//     for (const [k, v] of Object.entries(attrs)) {
//       $el.setAttribute(k, v);
//     }
//   }

//   // Append children
//   for (const child of children) {
//     //console.log("Rendering child:", child);

//     if (child == null) {
//       //console.log("Skipping null or undefined child:", child);
//       continue;
//     }

//     const renderedChild = render(child);
//     if (renderedChild == null) {
//       //console.log("Skipping rendering null child:", child);
//       continue;
//     }

//     $el.appendChild(renderedChild);
//   }

//   return $el;
// };