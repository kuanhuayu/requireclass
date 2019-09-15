# requireclass
Automatically load an object named '.Class.js'

# Install
npm install requireclass.

# Example
Create an object named .Class.js.

ex.<br>
  ClassName1.Class.js,ClassName2.Class.js

call:<br>
  const requireClass = require('requireclass');<br>
  const {ClassName1,ClassName2 } = requireClass('ClassName1','ClassName2');
