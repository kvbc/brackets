# Brackets

Brackets is an esoteric stack-based programming language. A little bit confusing, because consists only of 4 unique characters. The language uses Instruction Modification Parameter (IMP) and was heavily inspired by [whitespace](https://en.wikipedia.org/wiki/Whitespace_(programming_language)).

&nbsp;
# Syntax

| IMP  | Meaning            |
| ---  | -------            |
| `()` | Stack Manipulation |
| `{}` | Arithmetic         |
| `[]` | Flow Control       |
| `<>` | Input / Output     |

| IMP  | Command | Parameter | Meaning                                             |
| :-:  | :-----: | :-------: | :------                                             |
| `()` | `()`    | Number    | Push the number onto the stack                      |
| `()` | `{}`    | -         | Duplicate the top item on the stack                 |
| `()` | `[]`    | -         | Swap the top two items on the stack                 |
| `()` | `<>`    | -         | Discard the top item on the stack                   |
| `{}` | `()`    | -         | Pop `a` and `b` and push `a + b`                    |
| `{}` | `{}`    | -         | Pop `a` and `b` and push `a * b`                    |
| `{}` | `[]`    | -         | Pop `a` and `b` and push `b / a` rounded down       |
| `{}` | `<>`    | -         | Pop `a` and `b` and push `b % a`                    |
| `[]` | `()`    | -         | Pop `a`, `if (top == a) { ... }`                    |
| `[]` | `{}`    | -         | Pop `a`, `if (top != a) { ... }`                    |
| `[]` | `[]`    | -         | Pop `a`, `while (top != a) { ... }`                 |
| `[]` | `<>`    | -         | Exit the program                                    |
| `<>` | `()`    | -         | Pop `c` and output `c` as a character               |
| `<>` | `{}`    | -         | Pop `n` and output `n` as a number                  |
| `<>` | `[]`    | -         | Read `c` and push it onto the stack as a character  |
| `<>` | `<>`    | -         | Read `n` and push it onto the stack as a number     |

___
### Numbers

Numbers in `Braces` are in binary, where `()` represents `0`, and `{}` represents `1`.
The first bit tells us if the number is positive -`()`, or negative -`{}`. Numbers have to end with an opening arrow bracket `<`.

Here is an example:
```
(){}(){}()< => 0-1010 => 10
{}{}(){}()< => 1-1100 => -12
```
___
Any characters other than brackets, are simply ignored.

&nbsp;
# Examples

### Alphabet

The following program prints the whole english alphabet.

```c
()() (){}{}()()()(){}<   push 97 'a'
()() (){}{}{}{}(){}{}<   push 123 'z' + 1
[][]{                    while top != 123:
  (){}                      dup
  <>()                      printn
  ()() (){}<                push 1
  {}()                      add
}
```

### Loops

Simple `while` loop:
```c
()() (){}{}()(){}()()<   push 100
()() ()()<               push 0
[]<>{                    while top != 0 do top /= 2:
  (){}                      dup
  <>{}                      printn
  ()() (){}(){}()<          push 10 '\n'
  <>()                      printc
  ()() (){}()<              push 2
  {}[]                      div
}
```

### Statements

Simple `if` statements:
```c
()() (){}<     push 1
()() ()()<     push 0
[](){          if 1 == 0:
  ()() (){}<      push 1
  <>{}            printn
}

()() (){}<     push 1
()() ()()<     push 0
[]{}{          if 1 != 0:
  ()() {}{}<      push -1
  <>{}            printn
}
```

Simple `if-else` statement:
```c
()() (){}{}<   push 3
()() (){}<     push 1
[](){          if 3 == 1:
  ()() (){}<      push 1
  <>{}            printn
  ()() (){}<      push 1
}
()() (){}<     push 1
[]{}{          if 3 != 1:
  ()() {}{}<      push -1
  <>{}            printn
}
```

You can find more examples on the online Brackets interpreter below.

&nbsp;
# Interpreter

Try out official Brackets [interpreter](https://kvbc.github.io/brackets/interpreter/) online.
