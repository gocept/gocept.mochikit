===============
gocept.mochikit
===============

gocept.mochikit integrates MochiKit (http://mochikit.com) into Zope 3. Send
questions to Christian Zagrodnick <cz@gocept.com>.

Usage
=====

To use gocept.mochikit you need to add the following to your package
configuration (ZCML):: 

    <include package="gocept.mochikit" />

This provides several resource libraries using the `zc.resourcelibrary`
package. In a page template you use::

    <tal:replace replace="resource_library:mochikit" />

This will automatically load the main MochiKit file in its packed variant.
There are several additional MochiKit files which are not included in the
libarary above:

  * mochikit.DragAndDrop
  * mochikit.Controls
  * mochikit.MockDOM
  * mochikit.Selector
  * mochikit.Test

You use those like this::

    <tal:replace replace="resource_library:mochikit.DragAndDrop" />

Unpacked Variant
================

If you need to debug it's often easier to use the plain and unpacked MochiKit
variant. To use you load the package like this::

    <include package="gocept.mochikit" file="unpacked" />


Changes
=======

1.4.2.1 (2009-04-06)
++++++++++++++++++++

* Sending a signal before the lightbox closes (before-close).

1.4.2 (2008-12-10)
++++++++++++++++++

* Updated to MochiKit 1.4.2

1.3.2 (2008-02-13)
++++++++++++++++++

* Added styles (CSS) for lightbox 

* Updated to Mochikit r1323
  
1.3.1 (2007-12-07)
++++++++++++++++++

* Created a viewlet manager to allow easy dynamic javascript injection


1.3 (2007-11-26)
++++++++++++++++


* Updated to Mochikit r1320

* Added a lightbox (probably doesn't work in IE)

1.2
+++

* Added an approach for easier inheritance from
  http://www.ajaxpath.com/javascript-inheritance/

* Update to Mochikit r1315


