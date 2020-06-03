# 重学CSS - 选择器

## 选择器语法

- 简单选择器
  - *
  - div svg|a
  - .cls
  - \#id
  - [attr=value]
  - :hover
  - ::before

- 复合选择器
  - <简单选择器><简单选择器><简单选择器>
    - 没有空格
  - *或者div必须写在最前面
- 复杂选择器
  - <复合选择器><sp><复合选择器>
    - 后代
  - <复合选择器>">"<复合选择器>
    - 子
  - <复合选择器>"~"<复合选择器>
    - 兄弟
  - <复合选择器>"+"<复合选择器>
    - 相邻
  - <复合选择器>"||"<复合选择器>
    - 知道有就行,浏览器可能未实现
- 选择器列表: 
  - <复合选择器>,<复合选择器>,<复合选择器>

## 选择器优先级

- 简单选择器计数
  - `[inline-style, id, class, tag-name]`
  - 与顺序无关: 若优先级一致,改变顺序效果不变
  - 属性选择器[attr=value]优先级 = id优先级
  - :not() 不参与优先级计算,但:not(#id)里的#id参与
  - `*` 不改变优先级
- 复合/复杂选择器不影响优先级,只是其中的简单选择器优先级相加

## 伪类

- 链接/行为
  - :any-link(所有超链接)
  - :link(未访问的超链接) :visited(访问过的超链接)
  - :hover
  - :active
  - :focus
  - :target
- 树结构
  - :empty(无child)
  - :nth-child() 
    - 当前元素是其父元素的第几个子元素
  - :nth-last-child()
  - :first-child :last-child :only-child
    - 都是当前元素相对于其父元素的位置
- 逻辑型
  - :not伪类
  - :where :has

## 伪元素

- ::before ::after
  - 内容的前后
- ::firstLine
  - 排版后的第一行(第一个LineBox)
- ::firstLetter
  - 第一个字母

> 问: 为什么firstLetter有float/vertical-align/盒模型系列属性,而firstLine没有?
>
> 因为如果firstLine加了这些属性,就不再是第一行了.
>
> 问: 字体也会影响第一行内容,为什么firstLine可以改字体?
>
> 因为文字是一个一个输出的,firstLine的属性都是文字属性,是一个一个作用在文字上的.

> 作业: 编写一个match函数,检查某元素是否符合某个选择器.
>
> 例如: match("div #id.class", document.getElementById("id"));
>
> function match(selector, element){ return true|false; }



# 重学CSS - 排版

## 盒(Box)

- 源代码: Tag
- 语义: Element
  - CSS选择器选中的元素
- 表现: Box
  - 排版和渲染的基本单位
  - 一个元素在排版时可能产生多个盒
    - inline元素
    - 伪元素

> toy-browser将元素当成了盒来渲染

### 盒模型

- 从内到外: content - padding - border - margin
- width默认为content宽度,可以设box-sizing为"border-box"来使宽度包含padding

## 正常流

### 正常流排版

- 收集盒进行
- 计算盒在行中的排布
- 计算行的排布

- box: 
  - inline-box：从左到右、从上到下
  - block-box：从上到下

> IFC：从左到右；BFC：从上到下

### 正常流的行模型（inline-box)

- baseline: 基线，英文字母的下缘，但不是line-height底部
- 同一行的两个line-box，line-height不同时，文字高度是对齐的，原因就是默认行内基线对齐（vertical-align: baseline）。
  - 如果其中一个line-box中没有内容，那么其基线在底部
  - 默认情况下，`vertical-align` 属性为 `baseline`，行内基线对齐，导致行高异常。
- 一般来说，`inline-block` 要配合 `vertical-align: bottom|top` 来使用，使得行顶或行底对齐。
- line-box行高：`max(line-height, 最高的子元素)`
- 推荐`vertical-align`只用 `bottom|top|middle`，否则容易出现意想不到的效果。

> chrome console `$0.getClientRects()`可以得到 inline-box

### float与clear

- float: 先排列正常文档流，再将float的元素“挤”过去，装不下就换行
  - 如果有多个float元素交叠，则会摞起来
- clear：清除浮动，使得多个float元素不会摞起来，假如有四个float：right的元素，则会竖直排列在右侧
- 早年float可用于实现inline-block效果，用clear实现换行，现在有更好的flex
- float不在正常流内，正常流“贴着”float元素环绕。

### margin折叠

- 如果两个div在纵向都具有margin，则纵向margin会折叠，这也就是翻译为“留白”的原因。
- 只会发生在BFC里

### BFC与float

- 现象：当bfc的overflow设为hidden时，bfc不会包含float的元素，而是整体贴着float元素；
  - 否则bfc包含float元素，bfc的内容紧贴float元素。
- 原因：加上overflow:hidden时，bfc为inline-box，所以整体与float元素分离；不加overflow:hidden时，bfc为父级容器，所以包含float元素。

### Flex排版

- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布

#### 分行

- 根据主轴尺寸，把元素分进行
- 若设置了no-wrap，则强行分配进第一行