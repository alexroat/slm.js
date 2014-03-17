slm.js
======

Simple Layout Manager: simplify the layout management of UI in Single Page Applications


Project home page
http://alexroat.github.io/slm.js/


slm.js provides a simple method to create very complex and fully nestable layouts.
The main aim is to avoid to write directly javascript code to create and manage the layout manager (sizers) hierachy, adopting a simple sintax in the custom "layout" attribute that can be appended on the elements that compose the interface.
The major benefits of this approach are 
- the annihilation of the JS code for the layout management
- the full interoperability with other JS library and the avoidance of the namespace pollution
- the improved readability of the HTML
- the reusage of the experience in UI organization for developers that comes from Desktop UI library (similar concepts in wxWidgets, QT, GTK, ...)


At the moment the available sizers are:
- vbox/hbox: they manage their children in V/H direction adjusting height/width according to a base height/width and a weight
- vsplit/hsplit: they manage onl two children, on with fixed and one with variable height/width in order to fill space, the ration can be adjusted by a splitter that is draggable by the mouse
- tab: they organize an undefined number of children creating the header of the tabbed panel and rescaling accordingly the visible tab
- accordion: the same as tab but organized in an accordion
- menu: they organize an ol/li tree in a drop down menu
- shift: they show only a children along a loop with two button to move to the next or previous
- flap: they works as tabs but can be hidden on a side of the parent: on top,botton,left or right side
- snap: they organize the children along a grid, each children can take more than a slot in both direction, the floating is managed automatically
- absolute: they place an element in an absolute position
- fullpage: they bring a container to fullpage and handle the window resize
- dialog: they bring a container in a dialog that is draggable, closable and resizable


"layout" attribute use a JS object like syntax (but without root brachets) achieving a very smooth signature in your HTML elements. You can choose the sizer that will be impersonated by an element by the parameter "sz". You can then set other specific parameter in the children nodes and set them as other nested sizers always with "sz" parameter.


In order to "bootstrap" the slm.js, you have simply to call the plugin on the root element in the $( document ).ready callback.

The only dependency is the presence of the latest jquery library that you can directly get from google CDN.


At the moment a full documentation is not ready but you can check the source of the demo and try to hack with it.
