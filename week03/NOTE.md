# 前端训练营Week3

## Day1. Expressions/表达式

### Grammar

- 运算符优先级用树实现.

#### Left Handside

- Member

  - a.b

  - a[b]

  - foo\`string\` 

    - 用函数处理模版字符串,可以实现一些简单的自定义模版语言

    - ```javasc
      function foo() {
      	// 处理模版字符串
      	console.log(arguments);
      }
      const name = "dh";
      foo`Hello, ${name}!`;	// [["Hello, ", "!"], "dh"]
      ```

    - JSX考虑过将语法定为 jsx\`<\${tagname}> </​\${tagname}>\` 使js原生支持JSX.

  - super.b

  - super['b']

  - new.target

    - 代码就是``new.target``,不能为别的变量名
    - 一个``function``通过``new``调用时,``new.target``为函数本身
    - 用于判断``function``是不是被``new``出来的,为补充性的语法,一般极少使用.

  - new Foo()

  > Member表达式返回Reference类型

- New

  - new Foo
    - 优先级低于 ``new Foo()``
    - ``new new foo()`` => ``new (new foo())``
    - 一般不这么用,只是语法的完备性考虑

- Call

  - foo()
  - super()
  - foo()['b']
  - foo().b
  - foo()\`string\`
    - foo返回一个function来处理模版字符串

#### Right Handside

- “Left Handside & Right Handside” 即 “等号的左边 & 右边”.

- Update

  - a++
  - a--
  - ++a
  - --aa

- Unary 单目运算符

  - delete a.b
  - void foo()
  - typeof a
    - null => "object"
    - function => "function"
  - \+ a
  - \- a
  - ~ a
    - 按位取反
  - ! a
  - await a

  > void 将后面任何表达式变为 undefined.
  >
  > 生成undefined最好的方式: void 0.
  >
  > 因为"undefined"变量本身可以被重新赋值.

  > IIFE: (function() { }) ()
  >
  > 另一种更好的IIFE: void function() {} ()

- Exponental幂运算

  - ** : 唯一的右结合运算符

- Multiplicative

  - \* / %

- Additive

  - \+ -

- Shift

  - << >> >>>

- Relationship

  - < > <= >= instanceof in

- Equality

  - == != === !==

- Bitwise

  - & ^ |

- Logical

  - && ||
    - 短路逻辑

- Conditional

  - ? :

- 逗号 ``,`` 

  - 最低优先级, 即表达式版的分号

### Boxing & Unboxing

#### Boxing

- String
  - Boxing: `new String('abc')`
  - `typeof new String('abc')` : "object"
  - 不用`new`调用则是显式类型转换: `String(1)`: 1
  - 另一种装箱方法: `Object("1")` or `new Object("1")` 都返回 `String{"1"}`
- Number、Boolean同String类似
- Symbol
  - 特别的: 不能用`new`调用, 只能直接调: `Symbol("1")`
- `undefined` 与 `null` 没有对应的类型

#### Unboxing

- 第一优先: `Symbol.toPrimitive`

> 在 `Symbol.toPrimitive` 属性(用作函数值)的帮助下，一个对象可被转换为原始值。该函数被调用时，会被传递一个字符串参数 `hint` ，表示要转换到的原始值的预期类型。 `hint` 参数的取值是 `"number"`、`"string"` 和 `"default"` 中的任意一个。

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive

- 第二优先: `valueOf`
- 第三优先: `toString`

#### 作业: StringToNumber | NumberToString

> 只考虑十进制Number

> TestCase: github: tc39/test262

## Day2 语句, Object

### 语句

#### Grammar

- 简单语句
  - 表达式语句: `a = 1 + 2;`
  - 空语句: `;`
  - Debugger语句: `debugger;`
  - Throw语句: `throw new Error();`
  - Continue语句: `continue label1;`
  - Break语句: `break label2;`
  - Return语句: `return a;`
- 复合语句
  - Block语句/块语句: `{ 语句1; 语句2; }`
    - [[type]]: normal (见下面Runtime)
    - 一旦语句中有非normal则会中断执行
  - Iteration/循环迭代
    - while
    - do while
    - for
    - for...in
      - 遍历对象属性: `for(let p in { a: 1, b: 2 }) { console.log(p); }`	`// a b`
    - for...of
      - 遍历数组
      - 遍历Generator
      - Iterator => 遍历可迭代的类型
    - ~~for await( of )~~
  - 标签、循环、break、continue、switch
  - `try {} catch(){} finally {}`
    - `throw`
- 声明
  - Function
    - 函数声明: `function foo() {}`
    - 表达式: `const foo = function() {}`
    - 提升
  - Generator
    - `function* foo() { yield }`
    - 分步返回多个值
  - AsyncFunction
    - `async/await`
  - AsyncGenerator
  - Variable
    - `var` 声明会提升到函数体开头,可能会影响其他语句的执行
    - 所以只要用 `var`,都应写在函数体内变量首次出现的地方
  - Class
  - Lexical

#### Runtime

- Completion Record
  - [[type]]: normal, break, continue, return, throw
  - [[value]]: Types
  - [[target]]: label
    - 用于break、continue
- Lexical Environment

### Object

- 任何一个Object都是 **唯一** 的.
  - 状态完全一致的两个Object也并不相等.

- 用 **状态** 来描述对象
- 状态的改变即 **行为**

#### Object-Class

- 编程语言中最常见的描述对象的方式.

##### 归类

- 传统的类, 多继承
- C++

##### 分类

- 单继承, 具有一个最终的基类
- Object => Animal => Cat

#### Object-Prototype

- 原型是一种更接近人类原始认知的描述对象的方法
- 不试图做严谨的分类,而是采用“相似”的方式去描述对象
- 任何对象仅需要描述自己与原型的区别即可

- Nihilo => Object Prototype => Animal Prototype => Cat Prototype
- JavaScript最早的核心思想: 
  - 原型
  - 函数式编程

##### “狗咬人”

- 不应收到语言描述的干扰
- 在设计对象的状态和行为时,总是遵循 **行为改变状态 ** 的原则.
- 抓住“状态改变” -> 人受伤
- 最终设计: 
  - 错误: `class Dog { bite() {...} }`
  - 正确: `class Human { hurt() {...} }`

##### Object in JavaScript

- Object <- Property <- [[Prototype]]
- JavaScript运行时,原生对象只需关心两个部分:
  - Property/属性
  - [[Prototype]]/原型

###### Property

- (Symbol / String) => (Data / Accessor)
- Data Property: 数据属性用于描述状态, 若存储函数也可以描述行为
  - [[value]]
  - writable
  - enumeraable
  - configurable
- Accessor Property: 访问器属性用于描述行为
  - get
  - set
  - enumerable
  - configurable
- 访问: 沿原型链向上访问

#### Object API/Grammar

- `{}` `.` `[]` `Object.defineProperty`
  - 最基本的属性访问/定义
- `Object.create` `Object.setPrototypeOf` `Object.getPrototypeOf`
  - ES5加入的纯粹的原型系统
- `new` `class` `extends`
  - 支持基于类的面向对象范式
- `new` `function` `prototype`
  - 混乱的模式,不推荐使用

#### Function Object

- 具有 `[[call]]` 的特殊Object
- 使用 `function` 关键字、箭头运算符或Function构造器创建的对象
- 用类似 `f()` 的语法把对象作为函数调用时,会访问 `[[call]]` 这个行为.
  - 如果对应的对象没有 `[[call]]` 行为则会报错.
- 推荐: 不要用 `new function` , 需要的时候直接用class

#### Special Object

- Array
  - 具有 `[[length]]`
- Object.prototype
  - `[[setPrototypeOf]]`
  - 不能给 `Object.prototype` 添加原型

#### 作业: 找出JS中所有的对象

>  见同目录下文件

