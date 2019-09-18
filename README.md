# requireclass
Automatically load an object named '.Class.js' and determine whether to use remote when processing objects in electron

# Install
npm install requireclass.

# Example
Create an object named .Class.js.

ex.<br>
  ClassName1.Class.js,ClassName2.Class.js<br><br>

Custom object:<br>
  const requireClass = require('requireclass');<br>
  const {ClassName1,ClassName2 } = requireClass('ClassName1','ClassName2');<br><br>

Electron object:<br>
  Use requireClass to load an electron object in the main process and renderer<br><br>

  const requireClass = require('requireclass');<br>
  const {app} = requireClass('app');

