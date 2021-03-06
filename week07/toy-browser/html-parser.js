const css = require('css');

const layout = require('./layout');

let currentToken = null;
let currentAttr = null;

let currentTextNode = null;
let stack = [{ type: "document", children: [] }];

let rules = [];
function addCSSRules(text) {
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if(!selector || !element.attributes) return false;

  // a.class#id
  let combineSelectors = selector.split(/(?=[.#])/);

  for(s of combineSelectors) {
    let attr;
    if(s.charAt() == '#') {
      attr = element.attributes.filter(attr => attr.name === 'id')[0];
      if(!attr || attr.value !== selector.replace('#', '')) return false;
    } else if(s.charAt() === '.') {
      attr = element.attributes.filter(attr => attr.name === 'class')[0];
      if(!attr || attr.value.split(' ').indexOf(s.replace('.', '')) === -1) return false;
    } else {
      if(element.tagName !== s) return false;
    }
  }
  return true;
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(' ');
  for(let part of selectorParts) {
    let parts = part.split(/(?=[.#])/);
    parts.forEach(item => {
      if(item.charAt(0) == '#') {
        p[1] += 1;
      } else if(item.charAt(0) == '.') {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    })
  }
  return p;
}

function compare(sp1, sp2) {
  if(sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if(sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if(sp1[2] - sp2[2]) return sp1[2] - sp2[2];

  return sp1[3] - sp2[3];
}

function computeCSS(element) {
  let elements = stack.slice().reverse();
  if(!element.computedStyle) {
    element.computedStyle = {};
  }

  for(let rule of rules) {
    let selectorParts = rule.selectors[0].split(' ').reverse();

    if(!match(element, selectorParts[0])) continue; // 之所以提前判断是因为只要当前元素不匹配，那么说明不可能匹配，故直接跳过以下操作

    let matched = false;

    let j = 1; // 之所以从1开始是因为当前元素匹配的判断依据在上面做了
    for(let i = 0; i < elements.length; i++) {
      if(match(elements[i]), selectorParts[j]) {
        j++;
      }
    }

    if(j >= selectorParts.length) { // 一般是等于
      matched = true;
    }
    if(matched) {
      let sp = specificity(rule.selectors[0]);
      let computedStyle = element.computedStyle;
      for(let declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if(!computedStyle[declaration.property].specificity) { // 如果当前样式不存在，则直接进行复制
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if(compare(sp, computedStyle[declaration.property].specificity) >= 0) { // 当前选择器优先级大于等于element的选择器优先级时进行样式覆盖
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

function emit(token) {
  console.log(token);
  let top = stack[stack.length - 1];
  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    computeCSS(element);

    top.children.push(element);
    if (!token.isSelfCloseing) {
      stack.push(element);
    }
    currenTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      if(top.tagName == 'style') {
        addCSSRules(top.children[0].content);
      }

      layout(top);

      stack.pop();
    }
    currenTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

const EOF = Symbol("EOF"); // EOF: End of File

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: c });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = { type: "startTag", tagName: "" };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
  } else if (c === EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttrName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.currentToken += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttrName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttrName;
  } else if (c === ">" || c === "/" || c === EOF) {
    return afterAttrName;
  } else if (c === "=") {
    return beforeAttrName;
  } else {
    currentAttr = { name: "", value: "" };
    return attrName(c);
  }
}

function attrName(c) {
  if (c.match(/^[\t\b\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttrName(c);
  } else if (c === "=") {
    return beforeAttrValue;
  } else if (c == "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttr.name += c;
    return attrName;
  }
}

function afterAttrName(c) {
  if (c.match("/^[a-zA-Z]$/")) {
    return afterAttrName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttrName;
  } else if (c == ">") {
    currentToken[currentAttr.name] = currentAttr.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentToken[currentAttr.name] = currentAttr.value;
    currentAttr = {
      name: "",
      value: "",
    };
    return attrName(c);
  }
}

function beforeAttrValue(c) {
  if (c.match(/^[\t\b\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttrValue;
  } else if (c === '"') {
    return doubleQuotedAttrValue;
  } else if (c == "'") {
    return singleQuotedAttrValue;
  } else if (c === ">") {
    // return data;
  } else {
    return UnquotedAttrValue(c);
  }
}

function doubleQuotedAttrValue(c) {
  if (c == '"') {
    currentToken[currentAttr.name] = currentAttr.value;
    return afterQuotedAttrValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttr.value += c;
    return doubleQuotedAttrValue;
  }
}

function singleQuotedAttrValue(c) {
  if (c == '"') {
    currentToken[currentAttr.name] = currentAttr.value;
    return afterQuotedAttrValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttr.value += c;
    return singleQuotedAttrValue;
  }
}

function afterQuotedAttrValue(c) {
  if (c.match(/^[\t\b\f ]$/)) {
    return beforeAttrName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttr.name] = currentAttr.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttr.value += c;
    return doubleQuotedAttrValue;
  }
}

function UnquotedAttrValue(c) {
  if (c.match(/^[\t\b\f ]$/)) {
    currentToken[currentAttr.name] = currentAttr.value;
    return beforeAttrValue;
  } else if (c === "/") {
    currentToken[currentAttr.name] = currentAttr.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttr.name] = currentAttr.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c === EOF) {
  } else {
    currentAttr.value += c;
    return UnquotedAttrValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === "EOF") {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  console.log("HTML:\n", html);
  let state = data;
  for (let c of html) {
    try {
      state = state(c);
    } catch(e) {
      console.log('---------- error ---------');
      console.log('ERROR: ',e);
      console.log('CHAR: ', c);
      console.log('STATE: ', state);
      console.log('--------------------------');
    }
  }
  state = state(EOF);
  return stack[0];
};
