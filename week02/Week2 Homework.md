# Week2 Homework

## 1. A regular expression to match all Number literal

- 整数
  - ``/^-?[1-9][0-9]*|0$/``

- 浮点数
  - ``/^-?[1-9][0-9]*(\.)[0-9]*$/``

- 二进制数
  - ``/^[01]+$/``

- 八进制数
  - ``/^0[oO][0-7]+$/``

- 十六进制数
  - ``/^0[xX][0-9a-fA-F]+$/``
- 所有数字字面量
  - ``/^(-?[1-9][0-9]*(\.)?[0-9]*|0)|([01]+)|(0[oO][0-7]+)|(0[xX][0-9a-fA-F]+)$/``

## 2. Function UTF8_Encoding

```javascript
const UTF8Encoding = str => (
	str.split('')
  	.map(s => (`\\u${s.charCodeAt()}`))
  	.join('')
);
```

### 3. A regular expression to match all string literal ("" and '')

- ``/"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/``
- ``/'(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'/``

