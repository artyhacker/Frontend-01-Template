# 重学CSS

## 1. CSS语法的研究

### CSS2.1的语法

- https://www.w3.org/TR/CSS21/grammar.html#q25.0
- https://www.w3.org/TR/css-syntax-3

### CSS总体结构

- @charset
- @import
- rules
  - @media
  - @page
  - rule

## 2. @规则的研究

- at-rules
  - @supports: 检查Feature/兼容性,但本身兼容性不好
  - @viewport  
  - @document  
  - @page  
  - @import  
  - @media: 可嵌套,常用print、screen、max-width、min-width
  - @namespace  
  - @counter-style  
  - @font-face  
  - @keyframes  
  - @charset

## 3. CSS规则的结构

- Selector
  - https://www.w3.org/TR/selectors-3
  - https://www.w3.org/TR/selectors-4
- Key
  - Properties
  - Variables: 以“--[name]”开头的key为变量, 通过 `var(--[name])`使用
    - https://www.w3.org/TR/css-variables/
- Value
  - https://www.w3.org/TR/css-values-4/

## 