# Range API

- `Range` 代表DOM树中的一个片段，不必考虑层级关系。
- API：
  - `const range = new Range();`
    - `range.setStart(element, 9);`
    - `range.setEnd(element, 4);`
  - `const range = document.getSelection().getRangeAt(0);`
- `Range`可以精细到文本节点的一段内容。
- `const fragment = range.extractContents();`
  - 将range从原DOM中切出来，返回fragment
- `range.insertNode(document.createTextNode("aa"));`

### 将一个元素的各子元素逆序

```javascript
function reverseChildren(element) {
  let children = element.childNodes;
  const range = new Range();
  range.selectNodeContents(element);  // 选中元素
  let fragment = range.extractContents(); // 切出元素

  // 在DOM树之外进行反转
  let l = fragment.childNodes.length;
  while(l-- > 0) {
    fragment.appendChild(fragment[l]);
  }

  element.appendChild(fragment);  // 将反转后的元素添加回去
}
```

# CSSOM

- `document.styleSheets`
  - 页面中所有的StyleSheet对象数组
- `document.styleSheets[0].cssRules;`
- `document.styleSheets[0].insertRule("p {color: red;}",0);`
  - 插入css，注意传入的是字符串
- `document.styleSheets[0].removeRule(0);`

> 可以在link的href属性中直接使用data-url，将转义后的独立文件直接放进标签里：`<link rel="stylesheet" href="data:text/css,p%7Bcolor:blue%7D">`

## Rule

- CSSStyleRule
  - selectorText
  - style K-V
  - 可用于批量修改属性：`document.styleSheets[0].cssRules[0].style.fontSize = "40px";`
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- ...

## getComputedStyle

- `window.getComputedStyle(elt, pseudoElt);`
  - elt：想要获取的元素
  - pseudoElt：可选，伪元素

## window API

```javascript
let childWindow = window.open("about:blank", "_blank", "width=100,height=100,left=100,top=100");
childWindow.moveBy(-50, -50); // 移动
childWindow.resizeBy(50, 50); // 放缩

// window滚动
console.log(childWindow.scrollX);
console.log(childWindow.scrollY);
childWIndow.scroll(0, 30);  // 绝对量
childWindow.scrollBy(0, 50);  // 差量

// 元素滚动与window滚动的api不同
div.scrollBy(30, 30);
div.scrollTo(0, 100);
console.log(div.scrollLeft);
console.log(div.scrollHeight);

div.getClientRects()[0];  // 获取元素第一个行盒的真实位置与尺寸
// getClientRects()是行盒的数组 

div.getBoundingClientRect() // 元素整体的位置与尺寸

// 视口尺寸
window.innerHeight;
window.innerWidth;
// 等同写法
document.documentElement.getBoundingClientRect();

window.devicePixelRatio;  // 真实-虚拟像素比
```