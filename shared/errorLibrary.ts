export interface ErrorExample {
  id: string;
  category: string;
  title: string;
  description: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  incorrectCode: string;
  correctCode: string;
  explanation: string;
  tips: string[];
}

export interface ErrorCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  errorCount: number;
}

export const errorCategories: ErrorCategory[] = [
  {
    id: "syntax",
    name: "Syntax Errors",
    icon: "AlertTriangle",
    description: "Mistakes in the structure of your code that prevent it from running.",
    errorCount: 6,
  },
  {
    id: "runtime",
    name: "Runtime Errors",
    icon: "Zap",
    description: "Errors that occur while your program is executing.",
    errorCount: 5,
  },
  {
    id: "logic",
    name: "Logic Errors",
    icon: "Brain",
    description: "Code runs without crashing but produces wrong results.",
    errorCount: 4,
  },
  {
    id: "type",
    name: "Type Errors",
    icon: "Type",
    description: "Errors caused by using the wrong data type in an operation.",
    errorCount: 4,
  },
  {
    id: "reference",
    name: "Reference Errors",
    icon: "Link",
    description: "Trying to use a variable or function that does not exist.",
    errorCount: 3,
  },
  {
    id: "async",
    name: "Async & Promise Errors",
    icon: "Clock",
    description: "Common mistakes when working with asynchronous code.",
    errorCount: 3,
  },
];

export const errorExamples: ErrorExample[] = [
  // Syntax Errors
  {
    id: "syntax-1",
    category: "syntax",
    title: "Missing Semicolon (C/Java)",
    description: "Forgetting to end a statement with a semicolon in languages that require it.",
    language: "java",
    difficulty: "beginner",
    incorrectCode: `public class Main {
    public static void main(String[] args) {
        int x = 10
        System.out.println(x)
    }
}`,
    correctCode: `public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);
    }
}`,
    explanation: "In Java and C-like languages, every statement must end with a semicolon (;). The compiler uses semicolons to know where one statement ends and the next begins. Without them, the compiler cannot parse your code correctly.",
    tips: [
      "Most IDEs will underline the line where the semicolon is missing",
      "The error message often points to the line AFTER the missing semicolon",
      "Get into the habit of typing the semicolon right after writing each statement",
    ],
  },
  {
    id: "syntax-2",
    category: "syntax",
    title: "Unmatched Brackets",
    description: "Opening a bracket or parenthesis without closing it properly.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    print("Sum is: " + str(total)
    return total`,
    correctCode: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    print("Sum is: " + str(total))
    return total`,
    explanation: "Every opening parenthesis '(' must have a matching closing parenthesis ')'. Python will raise a SyntaxError because it reaches the next line before finding the closing parenthesis for the print function call.",
    tips: [
      "Count your opening and closing brackets — they should always match",
      "Use an editor that highlights matching brackets",
      "When you type an opening bracket, immediately type the closing one",
    ],
  },
  {
    id: "syntax-3",
    category: "syntax",
    title: "Indentation Error (Python)",
    description: "Incorrect indentation in Python code blocks.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `def greet(name):
print("Hello, " + name)
    print("Welcome!")

if True:
print("This is true")`,
    correctCode: `def greet(name):
    print("Hello, " + name)
    print("Welcome!")

if True:
    print("This is true")`,
    explanation: "Python uses indentation (spaces or tabs) to define code blocks instead of curly braces. All code inside a function, loop, or condition must be indented consistently. Mixing indentation levels or forgetting to indent causes an IndentationError.",
    tips: [
      "Use 4 spaces per indentation level (Python standard)",
      "Never mix tabs and spaces in the same file",
      "Configure your editor to convert tabs to spaces automatically",
    ],
  },
  {
    id: "syntax-4",
    category: "syntax",
    title: "Missing Quotes in Strings",
    description: "Starting a string with a quote but forgetting to close it.",
    language: "javascript",
    difficulty: "beginner",
    incorrectCode: `let message = "Hello, World!;
console.log(message);

let name = 'Alice;
console.log("Hi " + name);`,
    correctCode: `let message = "Hello, World!";
console.log(message);

let name = 'Alice';
console.log("Hi " + name);`,
    explanation: "Strings must be enclosed in matching quotes — either both single quotes ('...') or both double quotes (\"...\"). If you open a string with a quote but forget to close it, the interpreter treats everything after it as part of the string.",
    tips: [
      "Always type both quotes first, then fill in the content between them",
      "Use an editor that auto-closes quotes",
      "Watch for error messages mentioning 'unterminated string literal'",
    ],
  },
  {
    id: "syntax-5",
    category: "syntax",
    title: "Wrong Assignment Operator",
    description: "Using = instead of == for comparison in conditions.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `x = 10

# This assigns instead of comparing
if x = 10:
    print("x is ten")`,
    correctCode: `x = 10

# This correctly compares
if x == 10:
    print("x is ten")`,
    explanation: "A single equals sign (=) is the assignment operator — it sets a variable to a value. A double equals sign (==) is the comparison operator — it checks if two values are equal. Using = in an if statement tries to assign a value instead of comparing, which causes a syntax error in Python.",
    tips: [
      "Remember: = assigns, == compares",
      "Some languages (like C) allow assignment in conditions, which can cause subtle bugs",
      "Read your conditions out loud: 'if x equals 10' should use ==",
    ],
  },
  {
    id: "syntax-6",
    category: "syntax",
    title: "Missing Colon After Control Statement",
    description: "Forgetting the colon at the end of if, for, while, or def statements in Python.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `for i in range(5)
    print(i)

if True
    print("yes")

def hello()
    print("hello")`,
    correctCode: `for i in range(5):
    print(i)

if True:
    print("yes")

def hello():
    print("hello")`,
    explanation: "In Python, control flow statements (if, for, while, def, class) must end with a colon (:). The colon tells Python that an indented block of code follows. Without it, Python raises a SyntaxError.",
    tips: [
      "Always add a colon after if, elif, else, for, while, def, class, with, try, except, finally",
      "The error usually points to the exact line missing the colon",
      "Think of the colon as saying 'here is what to do'",
    ],
  },

  // Runtime Errors
  {
    id: "runtime-1",
    category: "runtime",
    title: "Division by Zero",
    description: "Attempting to divide a number by zero.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total / count

# This crashes when the list is empty
result = calculate_average([])
print(result)`,
    correctCode: `def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    if count == 0:
        return 0  # Handle empty list
    return total / count

result = calculate_average([])
print(result)  # Prints 0`,
    explanation: "Dividing by zero is mathematically undefined and causes a ZeroDivisionError at runtime. This commonly happens when calculating averages of empty lists, or when a denominator variable unexpectedly becomes zero.",
    tips: [
      "Always check if the denominator could be zero before dividing",
      "Use try/except blocks to handle potential division errors",
      "Consider what the correct behavior should be when the denominator is zero",
    ],
  },
  {
    id: "runtime-2",
    category: "runtime",
    title: "Index Out of Range",
    description: "Trying to access a list element that does not exist.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `fruits = ["apple", "banana", "cherry"]

# Lists are 0-indexed, so index 3 doesn't exist
print(fruits[3])

# Negative index too far back
print(fruits[-4])`,
    correctCode: `fruits = ["apple", "banana", "cherry"]

# Access valid indices (0, 1, 2)
print(fruits[2])  # "cherry"

# Use len() to check bounds
if len(fruits) > 3:
    print(fruits[3])
else:
    print("Index 3 is out of range")

# Safe negative indexing
print(fruits[-1])  # "cherry" (last element)`,
    explanation: "Lists in Python are zero-indexed, meaning the first element is at index 0. A list with 3 elements has valid indices 0, 1, and 2. Accessing index 3 or beyond raises an IndexError because that position does not exist.",
    tips: [
      "Remember: the last valid index is len(list) - 1",
      "Use negative indices (-1 for last element) carefully",
      "Check the length of a list before accessing specific indices",
      "Consider using try/except IndexError for safer access",
    ],
  },
  {
    id: "runtime-3",
    category: "runtime",
    title: "Null Pointer / None Reference",
    description: "Trying to use a method or property on a null/None value.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `function getUserName(user) {
    return user.name.toUpperCase();
}

// user might be null or undefined
const result = getUserName(null);
console.log(result);`,
    correctCode: `function getUserName(user) {
    // Check if user and user.name exist
    if (!user || !user.name) {
        return "Unknown";
    }
    return user.name.toUpperCase();
}

// Safe even with null input
const result = getUserName(null);
console.log(result); // "Unknown"

// Or use optional chaining (modern JS)
const name = null?.name?.toUpperCase() ?? "Unknown";`,
    explanation: "When you try to access a property or call a method on null or undefined, JavaScript throws a TypeError. This is one of the most common runtime errors. Always validate that an object exists before accessing its properties.",
    tips: [
      "Use optional chaining (?.) to safely access nested properties",
      "Use nullish coalescing (??) to provide default values",
      "Always validate function parameters before using them",
      "Check API responses for null/undefined before processing",
    ],
  },
  {
    id: "runtime-4",
    category: "runtime",
    title: "Stack Overflow (Infinite Recursion)",
    description: "A function that calls itself without a proper stopping condition.",
    language: "python",
    difficulty: "intermediate",
    incorrectCode: `def countdown(n):
    print(n)
    countdown(n - 1)  # Never stops!

countdown(5)`,
    correctCode: `def countdown(n):
    if n <= 0:  # Base case - stops recursion
        print("Done!")
        return
    print(n)
    countdown(n - 1)

countdown(5)`,
    explanation: "Recursion requires a base case — a condition that stops the function from calling itself. Without it, the function calls itself infinitely until the program runs out of memory (stack space), causing a RecursionError or StackOverflow.",
    tips: [
      "Every recursive function MUST have a base case",
      "Make sure each recursive call moves toward the base case",
      "Test with small inputs first to verify the recursion terminates",
      "Consider using iteration (loops) instead of recursion for simple cases",
    ],
  },
  {
    id: "runtime-5",
    category: "runtime",
    title: "File Not Found",
    description: "Trying to open a file that does not exist at the specified path.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `# File might not exist
file = open("data.txt", "r")
content = file.read()
print(content)
file.close()`,
    correctCode: `import os

# Method 1: Check if file exists first
if os.path.exists("data.txt"):
    with open("data.txt", "r") as file:
        content = file.read()
        print(content)
else:
    print("File not found!")

# Method 2: Use try/except
try:
    with open("data.txt", "r") as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("File not found!")`,
    explanation: "When you try to open a file that does not exist, Python raises a FileNotFoundError. This commonly happens when the file path is wrong, the file was moved, or the program is running from a different directory than expected.",
    tips: [
      "Always use 'with' statements to ensure files are properly closed",
      "Use os.path.exists() to check before opening",
      "Use try/except to handle missing files gracefully",
      "Use absolute paths to avoid directory confusion",
    ],
  },

  // Logic Errors
  {
    id: "logic-1",
    category: "logic",
    title: "Off-by-One Error",
    description: "Loop iterates one too many or one too few times.",
    language: "javascript",
    difficulty: "beginner",
    incorrectCode: `// Trying to print numbers 1 to 5
for (let i = 0; i <= 5; i++) {
    console.log(i);
}
// Prints: 0, 1, 2, 3, 4, 5 (6 numbers, not 5)

// Trying to access all array elements
const arr = [10, 20, 30];
for (let i = 1; i <= arr.length; i++) {
    console.log(arr[i]);
}
// Prints: 20, 30, undefined (misses first, adds undefined)`,
    correctCode: `// Print numbers 1 to 5
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
// Prints: 1, 2, 3, 4, 5

// Access all array elements
const arr = [10, 20, 30];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
// Prints: 10, 20, 30`,
    explanation: "Off-by-one errors happen when a loop starts or ends at the wrong value. Arrays are 0-indexed, so the first element is at index 0 and the last is at index length-1. Using <= instead of < with array length accesses an index that does not exist.",
    tips: [
      "For arrays: start at 0, use < length (not <= length)",
      "For counting from 1 to N: start at 1, use <= N",
      "Double-check your loop boundaries with the first and last iterations",
      "Consider using for...of or forEach to avoid index errors entirely",
    ],
  },
  {
    id: "logic-2",
    category: "logic",
    title: "Incorrect Boolean Logic",
    description: "Using AND when OR is needed, or vice versa.",
    language: "python",
    difficulty: "intermediate",
    incorrectCode: `age = 15

# Wrong: This can never be true
# (age can't be both < 13 AND > 19 at the same time)
if age < 13 and age > 19:
    print("Not a teenager")
else:
    print("Is a teenager")

# Wrong: Should reject if EITHER is empty
username = ""
password = "secret"
if username == "" and password == "":
    print("Please fill in all fields")`,
    correctCode: `age = 15

# Correct: Use OR - either condition means not a teen
if age < 13 or age > 19:
    print("Not a teenager")
else:
    print("Is a teenager")

# Correct: Reject if EITHER field is empty
username = ""
password = "secret"
if username == "" or password == "":
    print("Please fill in all fields")`,
    explanation: "AND requires BOTH conditions to be true. OR requires at least ONE condition to be true. A common mistake is using AND when you mean OR. Think carefully: 'I want to check if age is less than 13 OR greater than 19' — both conditions cannot be true simultaneously, so AND would never match.",
    tips: [
      "Read your condition out loud in plain English",
      "AND = both must be true, OR = at least one must be true",
      "De Morgan's laws: not (A and B) = (not A) or (not B)",
      "Test with specific values to verify your logic",
    ],
  },
  {
    id: "logic-3",
    category: "logic",
    title: "Variable Scope Confusion",
    description: "Modifying a variable in a different scope than expected.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `let total = 0;

function addToTotal(value) {
    let total = 0;  // Creates a NEW local variable!
    total += value;
    console.log("Inside:", total);
}

addToTotal(5);
addToTotal(10);
console.log("Outside:", total);
// Inside: 5, Inside: 10, Outside: 0 (not 15!)`,
    correctCode: `let total = 0;

function addToTotal(value) {
    total += value;  // Uses the outer variable
    console.log("Inside:", total);
}

addToTotal(5);
addToTotal(10);
console.log("Outside:", total);
// Inside: 5, Inside: 15, Outside: 15`,
    explanation: "Using 'let' or 'var' inside a function creates a new local variable that shadows the outer variable with the same name. Changes to the local variable do not affect the outer one. Remove the declaration keyword to use the existing outer variable.",
    tips: [
      "Be intentional about whether you want a new variable or an existing one",
      "Use different names for local and global variables to avoid confusion",
      "Minimize the use of global variables",
      "Use strict mode to catch accidental global variable creation",
    ],
  },
  {
    id: "logic-4",
    category: "logic",
    title: "Floating Point Comparison",
    description: "Comparing floating point numbers for exact equality.",
    language: "python",
    difficulty: "intermediate",
    incorrectCode: `# This might surprise you!
result = 0.1 + 0.2
print(result)  # 0.30000000000000004

if result == 0.3:
    print("Equal!")
else:
    print("Not equal!")  # This prints!`,
    correctCode: `result = 0.1 + 0.2

# Method 1: Use a small tolerance (epsilon)
epsilon = 1e-9
if abs(result - 0.3) < epsilon:
    print("Equal!")  # This prints!

# Method 2: Use round()
if round(result, 10) == round(0.3, 10):
    print("Equal!")  # This prints!

# Method 3: Use the math module
import math
if math.isclose(result, 0.3):
    print("Equal!")  # This prints!`,
    explanation: "Computers store floating point numbers in binary, which cannot exactly represent some decimal fractions like 0.1 or 0.2. This means 0.1 + 0.2 is not exactly 0.3 in the computer's memory. Never compare floating point numbers with == directly.",
    tips: [
      "Use math.isclose() in Python for float comparisons",
      "Use an epsilon (small tolerance) value for manual comparisons",
      "Use integers (cents instead of dollars) for financial calculations",
      "Be aware that this affects ALL programming languages, not just Python",
    ],
  },

  // Type Errors
  {
    id: "type-1",
    category: "type",
    title: "String + Number Concatenation",
    description: "Trying to combine a string and a number without conversion.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `age = 25
message = "I am " + age + " years old"
print(message)
# TypeError: can only concatenate str to str`,
    correctCode: `age = 25

# Method 1: Convert to string
message = "I am " + str(age) + " years old"
print(message)

# Method 2: Use f-strings (recommended)
message = f"I am {age} years old"
print(message)

# Method 3: Use format()
message = "I am {} years old".format(age)
print(message)`,
    explanation: "In Python, you cannot directly concatenate (join) a string and a number using the + operator. Python does not automatically convert types. You must explicitly convert the number to a string first, or use f-strings which handle the conversion automatically.",
    tips: [
      "Use f-strings (f'...{variable}...') — they are the most readable",
      "In JavaScript, + automatically converts numbers to strings (but this can cause bugs!)",
      "Always be explicit about type conversions",
      "Use str() for strings, int() for integers, float() for decimals",
    ],
  },
  {
    id: "type-2",
    category: "type",
    title: "Calling a Non-Function",
    description: "Trying to call something that is not a function.",
    language: "javascript",
    difficulty: "beginner",
    incorrectCode: `const name = "Alice";

// Trying to call a string as a function
name();  // TypeError: name is not a function

const obj = { count: 5 };
// Trying to call a number as a function
obj.count();  // TypeError: obj.count is not a function`,
    correctCode: `const name = "Alice";

// Use the variable directly
console.log(name);  // "Alice"

const obj = { count: 5 };
// Access the property without ()
console.log(obj.count);  // 5

// If you need a function, define one:
const getName = () => "Alice";
console.log(getName());  // "Alice"`,
    explanation: "Adding parentheses () after a value tells JavaScript to call it as a function. If the value is not a function (it is a string, number, etc.), JavaScript throws a TypeError. Only add () when you are calling an actual function.",
    tips: [
      "Parentheses () mean 'call this as a function'",
      "Check if you accidentally shadowed a function with a variable of the same name",
      "Use typeof to check: typeof value === 'function'",
      "Look for typos in function names",
    ],
  },
  {
    id: "type-3",
    category: "type",
    title: "Iterating Over Non-Iterable",
    description: "Trying to loop over something that cannot be iterated.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `number = 42

# Cannot iterate over an integer
for digit in number:
    print(digit)
# TypeError: 'int' object is not iterable

# Common mistake: forgetting range()
for i in 5:
    print(i)`,
    correctCode: `number = 42

# Convert to string to iterate over digits
for digit in str(number):
    print(digit)  # Prints "4", "2"

# Use range() to iterate a number of times
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# Iterate over a list of numbers
for num in [1, 2, 3, 4, 5]:
    print(num)`,
    explanation: "The for loop in Python works with iterable objects like lists, strings, tuples, and ranges. Numbers (int, float) are not iterable. To loop a certain number of times, use range(). To iterate over digits of a number, convert it to a string first.",
    tips: [
      "Use range(n) to loop n times",
      "Strings, lists, tuples, dicts, and sets are iterable",
      "Numbers and booleans are NOT iterable",
      "Use list() to convert other iterables to lists if needed",
    ],
  },
  {
    id: "type-4",
    category: "type",
    title: "Mutable Default Arguments",
    description: "Using a mutable object as a default function argument.",
    language: "python",
    difficulty: "advanced",
    incorrectCode: `def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("apple"))   # ['apple']
print(add_item("banana"))  # ['apple', 'banana'] — Wait, what?!
print(add_item("cherry"))  # ['apple', 'banana', 'cherry']`,
    correctCode: `def add_item(item, items=None):
    if items is None:
        items = []  # Create a new list each time
    items.append(item)
    return items

print(add_item("apple"))   # ['apple']
print(add_item("banana"))  # ['banana']
print(add_item("cherry"))  # ['cherry']`,
    explanation: "In Python, default argument values are evaluated once when the function is defined, not each time the function is called. This means a mutable default (like a list or dict) is shared across all calls. Each call modifies the same list object!",
    tips: [
      "Never use mutable objects (list, dict, set) as default arguments",
      "Use None as the default and create the object inside the function",
      "This is one of Python's most famous gotchas",
      "Immutable defaults (strings, numbers, tuples) are safe",
    ],
  },

  // Reference Errors
  {
    id: "reference-1",
    category: "reference",
    title: "Undefined Variable",
    description: "Using a variable before it has been defined.",
    language: "javascript",
    difficulty: "beginner",
    incorrectCode: `console.log(greeting);  // ReferenceError!

// Variable defined after use
let greeting = "Hello";

// Typo in variable name
let userName = "Alice";
console.log(username);  // ReferenceError! (wrong case)`,
    correctCode: `// Define before use
let greeting = "Hello";
console.log(greeting);  // "Hello"

// Use the exact same name (case-sensitive!)
let userName = "Alice";
console.log(userName);  // "Alice"`,
    explanation: "A ReferenceError occurs when you try to use a variable that has not been declared yet or does not exist. JavaScript variable names are case-sensitive, so 'userName' and 'username' are completely different variables.",
    tips: [
      "Always declare variables before using them",
      "JavaScript is case-sensitive: myVar and myvar are different",
      "Use 'let' or 'const' instead of 'var' for clearer scoping",
      "Check for typos in variable names carefully",
    ],
  },
  {
    id: "reference-2",
    category: "reference",
    title: "Using Variable Outside Its Scope",
    description: "Trying to access a variable outside the block where it was defined.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `function processData() {
    if (true) {
        let result = "success";
        const count = 42;
    }
    // result and count don't exist here!
    console.log(result);  // ReferenceError
    console.log(count);   // ReferenceError
}`,
    correctCode: `function processData() {
    let result;
    let count;
    
    if (true) {
        result = "success";
        count = 42;
    }
    
    // Now they're accessible
    console.log(result);  // "success"
    console.log(count);   // 42
}`,
    explanation: "Variables declared with 'let' and 'const' are block-scoped — they only exist inside the { } block where they are defined. If you need a variable outside an if/for/while block, declare it before the block.",
    tips: [
      "let and const are block-scoped (inside { })",
      "Declare variables at the scope level where you need them",
      "If you need a variable in multiple blocks, declare it in the parent scope",
      "var is function-scoped (different behavior) — prefer let/const",
    ],
  },
  {
    id: "reference-3",
    category: "reference",
    title: "Import/Module Not Found",
    description: "Importing a module or package that is not installed or does not exist.",
    language: "python",
    difficulty: "beginner",
    incorrectCode: `# Module not installed
import pandas as pd

# Typo in module name
import numppy

# Wrong import path
from myproject.utils import helper`,
    correctCode: `# First install the package:
# pip install pandas
import pandas as pd

# Correct module name
import numpy

# Correct import path (make sure file exists)
# from myproject.utils import helper
# Or use relative imports:
# from .utils import helper`,
    explanation: "A ModuleNotFoundError occurs when Python cannot find the module you are trying to import. This usually means the package is not installed, the module name is misspelled, or the file path is incorrect.",
    tips: [
      "Install packages with: pip install package_name",
      "Check spelling of module names carefully",
      "Use 'pip list' to see what packages are installed",
      "For local modules, check that the file exists and __init__.py is present",
    ],
  },

  // Async Errors
  {
    id: "async-1",
    category: "async",
    title: "Forgetting await",
    description: "Calling an async function without using await.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `async function fetchUser(id) {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
}

// Missing await — gets a Promise, not the data!
const user = fetchUser(1);
console.log(user.name);  // undefined!
console.log(user);       // Promise { <pending> }`,
    correctCode: `async function fetchUser(id) {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
}

// Use await to get the actual data
async function main() {
    const user = await fetchUser(1);
    console.log(user.name);  // "Alice"
}

main();

// Or use .then()
fetchUser(1).then(user => {
    console.log(user.name);  // "Alice"
});`,
    explanation: "Async functions always return a Promise. If you call an async function without 'await', you get the Promise object instead of the resolved value. You must use 'await' inside another async function, or use .then() to access the actual result.",
    tips: [
      "Always use 'await' when calling async functions",
      "You can only use 'await' inside an async function",
      "If you see [object Promise] in your output, you forgot await",
      "Use .then() and .catch() as an alternative to await",
    ],
  },
  {
    id: "async-2",
    category: "async",
    title: "Unhandled Promise Rejection",
    description: "Not catching errors from async operations.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
}

// No error handling — crashes silently!
fetchData();`,
    correctCode: `async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
}

// Method 1: try/catch
async function main() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error("Failed to fetch:", error.message);
    }
}

// Method 2: .catch()
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error("Failed:", error.message));`,
    explanation: "When an async operation fails (network error, server error, etc.), it rejects the Promise. If you do not catch this rejection with try/catch or .catch(), it becomes an 'unhandled promise rejection' which can crash your application or cause silent failures.",
    tips: [
      "Always wrap await calls in try/catch blocks",
      "Check response.ok for HTTP requests before parsing",
      "Use .catch() at the end of Promise chains",
      "Add a global unhandled rejection handler as a safety net",
    ],
  },
  {
    id: "async-3",
    category: "async",
    title: "Callback Hell",
    description: "Deeply nested callbacks making code unreadable and hard to maintain.",
    language: "javascript",
    difficulty: "intermediate",
    incorrectCode: `// Nested callbacks — hard to read and maintain
getUser(userId, function(user) {
    getOrders(user.id, function(orders) {
        getOrderDetails(orders[0].id, function(details) {
            getShippingInfo(details.shippingId, function(shipping) {
                console.log(shipping);
                // More nesting...
            }, function(err) { console.error(err); });
        }, function(err) { console.error(err); });
    }, function(err) { console.error(err); });
}, function(err) { console.error(err); });`,
    correctCode: `// Clean async/await approach
async function getShippingDetails(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const details = await getOrderDetails(orders[0].id);
        const shipping = await getShippingInfo(details.shippingId);
        
        console.log(shipping);
        return shipping;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

getShippingDetails(userId);`,
    explanation: "Callback hell (also called 'pyramid of doom') happens when you nest multiple asynchronous callbacks inside each other. The code becomes deeply indented, hard to read, and difficult to handle errors in. Modern JavaScript solves this with Promises and async/await.",
    tips: [
      "Use async/await instead of nested callbacks",
      "Convert callback-based APIs to Promises with new Promise()",
      "Keep your code flat — avoid deep nesting",
      "Use Promise.all() for parallel async operations",
    ],
  },
];
