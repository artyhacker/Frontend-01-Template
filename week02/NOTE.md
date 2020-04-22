# 前端训练营W2

## Day1 编程语言通识

### 语言按语法分类

- 非形式语言
  - 中文、英文
  - 过于灵活、难以解析
- 形式语言(乔姆斯基谱系)
  - 0型 无限制文法
  - 1型 上下文相关文法
    - 编译器难以实现
  - 2型 上下文无关文法
  - 3型 正则文法
    - 表达能力极为有限
- 大多数现代语言采取了折中的方式,分为词法、语法
  - 词法分析: 用正则做粗略的处理,生成单个的词,作为语法分析的输入流
  - 语法分析
- 一些特殊语言可以一遍出: Lisp、BrainFuck

> 了解一下Lisp语言

### 产生式(BNF)

>  用于形式化地定义语言、语法

- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符(即字符串)
- 可以有括号
- ``*``表示重复多次
- ``|``表示或
- ``+``表示至少一次

#### 例1: BNF定义由“a",“b”组成的字符串

```
<Program>:= "a"+ | "b"+
<Program>:= <Program> "a"+ | <Program> "b"+
```

#### 练习1: 使用BNF定义整数加法

```
<Number> = "0" | 1" | "2" | ... | "9"
<DecimalNumber> = "0" | ((1" | "2" | ... | "9") <Number>*)	// 十进制数
<AddtiveExpress> = <DecimalNumber> | <AddtiveExpress> "+" <DecimalNumber>	// 加法
```

#### 练习2: 使用BNF定义四则运算

```
<Number> = "0" | 1" | "2" | ... | "9"
<DecimalNumber> = "0" | ((1" | "2" | ... | "9") <Number>*)	// 十进制数

<PrimaryExpress> = <DecimalNumber> |
	"(" <LogicalExpress> ")"																	// 小括号

<MultiplicativeExpression> = <DecimalNumber> |
	<MultiplicativeExpression> "*" <PrimaryExpress> |
	<MultiplicativeExpression> "/" <PrimaryExpress>
	
<AdditiveExpression> = <DecimalNumber> |
	<AdditiveExpression> "+" <MultiplicativeExpression> |
	<AdditiveExpression> "-" <MultiplicativeExpression>
	
<LogicalExpression> = <AdditiveExpression> |
	<LogicalExpression> "&&" <AdditiveExpression> |
	<LogicalExpression> "||" <AdditiveExpression>
```

### 通过产生式理解乔姆斯基谱系

- 0型 无限制文法
  - ``? ::= ?`` 
  - “?”代表任意, 无限制地任意定义
- 1型 上下文相关文法
  - ``?<A>? ::= ?<B>?``	
  - A在特定上下文中被定义为B
- 2型 上下文无关文法
  - ``<A> ::= ?``
  - A具有固定不变的定义,与上下文无关
- 3型 正则文法
  - ``<A> ::= <A>?``
  - 可用正则解析,只允许左递归
  - 在JS中,除了``**``都是左递归

> JavaScript的表达式,除了``**``都是正则文法.
>
> JavaScript的正则由于支持回溯,效率很低,非线形复杂度.
>
> WildCard(通配符)效率高,可以了解一下.
>
> 了解产生式才能读懂标准中的语言定义.

### 其他产生式

- EBNF
- ABNF
- Customized(自定义)

> JavaScript标准采用了自定义的表达方式,如使用粗体来表示终结符.
>
> 其他产生式的原理都与BNF类似,只是有一些特殊写法.

### 现代语言特例

- C++中,``*``可能表示乘号或指针,取决于``*``前面的标识符是否被声明为类型
- VB中,``<``可能是小于号或XML直接量的开始,取决于当前位置是否可以接受XML直接量
- Python中,行首的tab符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或dedent
- JavaScript中,``/``可能是除号或正则表达式开头,处理方式类似于VB,字符串模版中也需要特殊处理``}``,还有自动插入分号规则.

#### 练习: 分类你所了解的计算机语言

> 大多数语言语法都是2型,主要看有没有case会让它滑落到1型或0型.

### 图灵完备性

- 图灵完备性: 凡是可计算的都能计算出来
  - 命令式——图灵机
    - goto
    - if和while
  - 声明式——lambda
    - 递归
- 计算机编程语言都是图灵完备的

> 是否一切都是可计算的? 否, 一个图灵机无法计算出另一个图灵机能否停机

## 动态与静态

### 动态

- 在用户的设备/在线服务器上
- 产品实际运行时
- Runtime

### 静态

- 在程序员的设备上
- 产品开发时
- Compiletime

### 类型系统

- 动态类型系统与静态类型系统
- 强类型与弱类型
  - 有隐式类型转换就是弱类型
  - C++是静态弱类型
- 符合类型
  - 结构体: ``{a: T1, b: T2}``
  - 函数签名: ``(T1,T2) => T3``
- 子类型
  - 协变: 凡是能用``Array<Parent>``的地方都能用``Array<Child>``
  - 逆变: 凡是能用``Function<Child>``的地方都能用``Function<Parent>``

### 一般命令式编程语言

- Atom: 原子
  - Identifier
  - Literal
- Expression: 表达式
  - Atom
  - Operator
  - Punctuator
- Statement: 语句
  - Expression
  - Keyword
  - Punctuator
- Structure: 结构化程序设计
  - Function(Pure Function)
  - Class
  - Process(Unpure Function)
  - Namespace
  - ...
- Program
  - Program
  - Module
  - Package
  - Library

#### 重学JavaScript

``语法 ==语义==> 运行时``



## Day2 JavaScript

### Unicode

- 应用范围最广的字符集
- 参考: [FileFormat](http://www.fileformat.info/info/unicode/)
- 采用4个十六进制表示(目前已经扩展到5个十六进制)

#### Basic Latin

- ``U+0000 - U+007F``

- 兼容ASCII
- 包括一些空白符、大小写字母、键盘上可直接打出的大多数符号

```javascript
// 打印Basic Latin
for(let i = 0; i < 128; i++) {
  console.log(String.fromCharCode(i)); 
}
```

#### CJK

- Chinese Japanese Korean
- 因为增补过很多次,分布在好几段
- 一般使用 ``U+4E00 - U+9FFFF``来判断中文,其实不准确.

#### BMP

- 基本字符空间

- ``U+0000 - U+FFFF`` 4位十六进制可表示的范围
- JavaScript中的``String.formCharCode()``只支持BMP范围
- 更大范围的Unicode字符需使用``String.fromCodePoint()``和``String.codePointAt()``方法
- emoji字符基本都在BMP之外,兼容性不好

#### JavaScript与Unicode

- JavaScript可以使用BMP中任意字符作为变量名,但只推荐使用BasicLatin范围
- 需要使用中文时,可使用转义: ``\u5389``
- 可以使用构建工具直接将中文改为\u转义.

### JavaScript词法

- InputElement
  - WhiteSpace: 空白符
  - LineTerminator: 换行符
  - Comment: 注释
  - Token: 所有有效输入

#### WhiteSpace

- ``<TAB>``: ``\t`` 制表符,一般编辑器都替换成了n个空格
- ``VT``: ``\v``纵向制表符,一般不用

- ``FF``: Form Feed, 翻页
- ``SP``: 普通空格
- ``NBSP``: ``&nbsp`` no-break space, 只空格,不分词
- ``ZWNBSP``: zero width no break space, 零宽空格, ``\uFEFF``
  - BOM(BitOrderMask),历史上用于区分大端法/小端法,看是``FEFF``还是``FFFE``
  - 很多历史代码第一行都是空行,就是防BOM的,因为很多解析器会默认第一行有BOM

- ``USP``: Unicode Space

> 实践中最好只用SP

#### LineTerminator

- ``U+000A``	Line Feed(LF)	``<LF>``    ``\n``
- ``U+000D``    Carriage Return(CR)    ``<CR>``    ``\r``

- ``<LS>``分行, ``<PS>``分段, 一般不用

> 一般只用"\n",Win下会有"\r\n"

#### Comment

- //
- /* */
  - 不可嵌套
  - 内部无法使用``\u``转义

#### Token

- Punctuator: 符号
- Identifier: 标识符
  - Keywords: 关键字
  - 变量名: 不能与Keywords重合
  - 属性名: 可以与Keywords重合
  - Future reserved Keywords: enum
    - 以字母、``_``、``$``开头

> JavaScript中的class属性,必须要用“className”访问,是因为早期属性名不能与keywords重合

- Literal: 直接量

##### Number

- IEEE 754 Double Float ``Sign(1)+Exponent(11)+Fraction(52)``
- Grammer
  - DecimalLiteral: 
    - 0
    - 0.
    - .2
    - 1e3
  - BinaryIntegerLiteral: 0b111
  - OctalIntegerLiteral: 0o10
  - HexIntegerLiteral: 0xFF

> parseInt("20", 10)

##### ! 作业: 写一个正则匹配所有Number

> 参考: ECMA-262 page167 Number定义

- 安全整数范围: ``Number.MAX_SAFE_INTEGER`` 
- 浮点数的比较: ``Math.abs(0.1+0.2-0.3) <= Number.EPSILON``
  - 需要精确时转为整数

##### String

- Character
- Code Point
- Encoding
  - ASCII
  - Unicode
    - UTF8: 以8位为单位表示字符,前几位为控制位,表示字符有几个8位
    - UTF16: 以16位为单位
  - UCS: U+0000 - U+FFFF
  - GB国标, 兼容ASCIII
    - GB2312
    - GBK(GB13000)
    - GB18030
  - ISO-8859
  - BIG5
- Grammer
  - "abc"
  - 'abc'
    - \ b f n r t v
  - \`abc\`

>  ``97 .toString(2)``: “.”前面加空格是为了避免被识别为小数点

##### ! 作业: 写一个UTF8编码函数

```javascript
function UTF8_Encoding(string) {
  // return new Buffer();
}
```

##### !作业3: A regular Expression to match  string literal

```javascript
// 写正则匹配单引号、双引号字符串
```

##### Boolean

##### Null

##### Undefined

##### 正则直接量

- ``/a/g``
- 不能用除号的地方,``/``被解析为正则直接量