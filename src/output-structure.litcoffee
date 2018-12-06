
# Output Structures

The LDE module constructs, for its internal use, a hierarchy of
`OutputStructure` instances called the Output Tree.  The word "output" is
used because it is the output of an interpretation process defined
throughout the subclasses of `InputStructure`.

These have entirely different functionality than their cousins
`InputStructure` instances.  In short, these support validation while
`InputStructure`s support interpretation.  You can also think of the
difference as this:  `InputStructure`s represent the syntax of what the user
has expressed to the client, and `OutputStructure`s represent the semantics
into which we interpret that syntax.

## Import modules

Import the `Structure` class.  The following lines detect whether this
is being used in Node.js or a WebWorker, or a WebWorker-like background
thread within Node.js, and do the right thing in any case.

In the Worker cases, it is important not to call `importScripts` on the same
module more than once from different files, or all manner of confusing logic
errors manifest at runtime, hence the checks below.

    if require?
        { Structure } = require './structure'
        { InputStructure } = require './input-structure'
        { OM } = require 'openmath-js'
    else if WorkerGlobalScope?
        if not WorkerGlobalScope.Structure?
            importScripts 'structure.js'
            importScripts 'input-structure.js'
        if not WorkerGlobalScope.OM?
            importScripts 'openmath.js'
    else if self?.importScripts?
        if not self.Structure?
            importScripts 'release/structure.js'
            importScripts 'release/input-structure.js'
        if not self.OM?
            importScripts 'node_modules/openmath-js/openmath.js'

## Define the `OutputStructure` class

    class OutputStructure extends Structure

In order for a hierarchy of structures to be able to be serialized and
deserialized, we need to track the class of each structure in the hierarchy.
We do so for this class with the following line of code.

        className : Structure.addSubclass 'OutputStructure', OutputStructure

Marking an `OutputStructure` dirty, unlike with `InputStructure`s, does not
propagate up the ancestor chain.  Thus we define the following function
analogous to the one in the `InputStructure` class, but without the
recursive propagation.

        markDirty : ( yesOrNo = yes ) -> @dirty = yesOrNo

A newly constructed instance should be considered dirty (because it probably
just changed and thus may need to be validated).  It should also record the
`InputStructure` instance that gave rise to it, if indeed this construction
happend as part of interpretation.

        constructor : ->
            super arguments...
            @markDirty()
            IS = Structure::subclasses.InputStructure
            if len = IS::instancesBeingInterpreted?.length
                @origin = IS::instancesBeingInterpreted[len-1]

Similar to tracking origins for `OutputStructure` nodes, if a connection is
formed between `OutputStructure` instances, we will want to track its origin
in the sense of which `InputStructure` was being interpreted when the
connection was formed.

        addConnectionOrigin : ( source, target, data ) ->
            IS = Structure::subclasses.InputStructure
            if ( target instanceof OutputStructure ) and \
               ( len = IS::instancesBeingInterpreted?.length )
                data._origin = IS::instancesBeingInterpreted[len-1].id()

## Feedback

To give feedback about a particular `OutputStructure` instance, find the
`InputStructure` instance that created this `OutputStructure` and if there
is such a thing, call the `feedback` method in it.  (That will delegate the
work further, but that is not our concern here.)

        feedback : ( feedbackData ) -> @origin?.feedback feedbackData

## Labels

`OutputStructure`s can be labeled.  This is implemented by a function that
takes a string as input and returns true or false, whether the structure has
that label.  This permits a lot of freedom in how we match labels to
structures, including case sensitivity, punctuation sensitivity, multiple
labels, and so on.  By default, however, everything is unlabeled, so the
base implementation is as follows.

        hasLabel : ( label ) -> no

We can look back through a list of all the `OutputStructure`s accessible to
a given one, seeking the first one that admits to having a given label, by
use of the `hasLabel()` function on each accessible structure.  We implement
that generically with the following class method, then make a shortcut for
use by instances below.  Here we assume that the accessibles array is given
in the order in which the nodes appear in the tree
(`Structure.isEarlierThan()`).

        @lookUpIn : ( label, accessibles ) ->
            for candidate in accessibles[...].reverse()
                return candidate if candidate.hasLabel label
            undefined

When an instance asks to look up the nearest accessible thing with a given
label, what it means is among those things accessible to that instance.

        lookUp : ( label ) ->
            @firstAccessible ( candidate ) -> candidate.hasLabel label

When an instance asks to look up all accessible things with a given label,
they are still returned in the order in which they are encountered when
traversing the list of accessibles.

        lookUpAll : ( label ) ->
            @allAccessibles ( candidate ) -> candidate.hasLabel label

## Citations

Obeying the conventions set down by interpretation, as defined in
[the InputStructure class](input-structure.litcoffee#citations), we provide
the following function to look up all structures cited by this one.  The
notion of "looking them up" here means finding the targets that are cited by
the data stored in this object and creating a dictionary mapping the means
of citation to the structures cited.

We respect the following citation conventions set down by the
`InputStructure` class linked to in the previous paragraph:
 * The "premise citations" and "reason citations" attributes will each map
   to a list of strings, each of which attempts to cite something by label.
 * Connections out of this node whose JSON data contains the key-value pair
   ("type","premise citation") or ("type","reason citation") are each
   interpreted as a citation.

This routine does not actually call `lookUp()`, defined above, because to do
so repeatedly would be inefficient, traversing the accessibles list
potentially many times.  Rather, we traverse it just once, asking about
multiple label matches at each stop.

The form of the result will be a JSON structure with this format:
```javascript
{
    premises : { // citations of premises go in here
        connections : [ // citations by connection go in here
            {
                cited : "id of target structure",
                id : "id of connection, so you can get its data later"
            }
            // zero or more such objects in this array
        ],
        labels : [ // citations by label go in here
            {
                cited : "id of cited structure",
                label : "text of label by which it was cited"
            }
            // zero or more such objects in this array
        ]
    },
    reasons : {
        // same structure as premises object above
    }
}
```

        lookUpAllCitations : ->

Initialize the data structure we will return, empty at first.

            result =
                premises :
                    connections : [ ]
                    labels : [ ]
                reasons :
                    connections : [ ]
                    labels : [ ]

Fill both connections arrays by examining all connections out of this
structure for their types.

            for connection in @getConnectionsOut()
                data = @getConnectionData connection
                for type in [ 'premise', 'reason' ]
                    if data?.type is "#{type} citation" and
                       ( target = @getConnectionTarget connection )?
                        result["#{type}s"].connections.push
                            cited : target.id()
                            id : connection

Fill both labels arrays by examining the relevant attributes of this
structure.

            for type in [ 'premise', 'reason' ]
                if ( labels = @getAttribute "#{type} citations" ) and \
                   labels instanceof Array
                    for label in labels
                        if ( cited = @lookUp label )?
                            result["#{type}s"].labels.push
                                cited : cited.id()
                                label : label

Return the result.

            result

## Handling change events

When interpretation has completed, the `justChanged()` function will be
called in every structure in the Output Tree has been updated during that
interpretation phase.  We provide the following default implementation for
`justChanged()` that will defer the work to the class method
`instanceJustChanged` if and only if that class method exists.  It doesn't
yet exist, so this is ineffective unless some later code installs just such
a class method.

The reason for this is that the actual implementation we want to provide
depends upon some global data structures in the LDE to which this module
does not have access.  When the LDE loads this module, it can fill in the
missing class method with the appropriate implementation, which accesses its
own internals.

        justChanged : -> OutputStructure::instanceJustChanged? @

## Define `OutputExpression` as a type of `OutputStructure`

An `OutputExpression` is the most common type of mathematics we think of
when doing mathematics on a computer.  It may be a mathematical noun, such
as 3x, or a mathematical statement, such as "not every number is even."
These are what typically appear inside dollar signs in LaTeX documents, and
form the majority of the content of any proof in a formal system.

In the LDE, we use OpenMath data types to store expressions.  In particular,
we rely on a JavaScript implementation of part of the OpenMath Standard,
[published here](https://github.com/lurchmath/openmath-js).  Each expression
is a tree made up of instances of the following class, each of which
corresponds to a node in an OpenMath tree, and there are conversion
functions between the two data structures.

    class OutputExpression extends OutputStructure

In order for a hierarchy of structures to be able to be serialized and
deserialized, we need to track the class of each structure in the hierarchy.
We do so for this class with the following line of code.

        className : Structure.addSubclass 'OutputExpression',
            OutputExpression

The constructor takes an arbitrary number of parameters.  The first is
always the OpenMath type that this object represents (e.g., string, integer,
function application, etc.).  That type should be expressed in the
three-letter form used in the OpenMath module's code (e.g., "int", "flo",
"str", etc., as a JavaScript string).

The remaining parameters depend on the first.

 * If the first parameter gives this object an OpenMath atomic type, then
   the next should contain the atomic content (e.g., string data if this is
   a string).  In one case (OpenMath symbol) this atomic content is spread
   over two or three parameters: name, CD, and optional URI.
 * If the first parameter gives this object an OpenMath binding type, then
   the second parameter should be an array of the indices of bound
   variables, and then the third and further parameters are its children,
   which must be `OutputExpression` instances, and will be passed to the
   superclass's constructor.
 * In all other cases, the second and further parameters are the children,
   and are passed on as in the previous case.

If an invalid type is passed as first parameter, we construct an OpenMath
error object instead, with no children and no attributes.  Any other
configuration of invalid parametrs (e.g., bad binding indices) will be
accepted, but may not convert to an OpenMath object in `toOpenMath()`.
Note that an error object constructed that way will not correctly convert
to an OpenMath object, because it has not head symbol.

Currently there is not any supported way to decorate an `OutputExpression`
instance with OpenMath attributes, though that could be added later if the
need arises.

        constructor : ( type, rest... ) ->
            switch type
                when 'int', 'flo', 'str', 'byt', 'var'
                    super()
                    @setAttribute 'OM type', type
                    @setAttribute 'OM atomic value', rest[0]
                when 'sym'
                    super()
                    @setAttribute 'OM type', type
                    @setAttribute 'OM atomic value', rest
                when 'bin'
                    super rest[1..]...
                    @setAttribute 'OM type', type
                    @setAttribute 'OM bound indices', rest[0]
                when 'app', 'err'
                    super rest...
                    @setAttribute 'OM type', type
                else
                    super()
                    @setAttribute 'OM type', 'err'

We wish to be able to extract from any `OutputExpression` instance the
OpenMath object that it represents.  We do so with the following conversion
function.  If conversion to an OpenMath object fails from an error in the
OpenMath package, that error is not caught; clients should take care to
form their `OutputExpression` instances correctly or use `try`/`catch`.

As stated above, attributes are not yet supported, though such support
could be added later.

        toOpenMath : ->
            switch type = @getAttribute 'OM type'
                when 'int', 'flo', 'str', 'byt', 'var'
                    new OM[type] @getAttribute 'OM atomic value'
                when 'sym'
                    new OM[type] @getAttribute( 'OM atomic value' )...
                when 'app', 'err'
                    childResults =
                        ( child.toOpenMath() for child in @children() )
                    new OM[type] childResults...
                when 'bin'
                    indices = @getAttribute 'OM bound indices'
                    vars = for i in indices
                        OM.var @children()[i].getAttribute 'OM atomic value'
                    notVarIndices = ( i for i in [0...@children().length] \
                        when i not in indices )
                    head = @children()[notVarIndices[0]].toOpenMath()
                    body = @children()[notVarIndices[1]].toOpenMath()
                    new OM.bin head, vars..., body
                else
                    throw "Not a valid OpenMath type: #{type}"

We also want the inverse conversion function, from `OMNode` instances (from
the OpenMath package) to instances of this type.  We provide that function
as a class method here, and one should call it on an instance of the
`OMNode` class; it will yield an instance of this class in every case,
because `OMNode` instances cannot be incorrectly formed.

As stated above, attributes are not yet supported, though such support
could be added later.

        @fromOpenMath : ( node ) ->
            childResults = ( OutputExpression.fromOpenMath child \
                for child in node.children )
            switch node.type
                when 'i' then new OutputExpression 'int', node.value
                when 'f' then new OutputExpression 'flo', node.value
                when 'st' then new OutputExpression 'str', node.value
                when 'ba' then new OutputExpression 'byt', node.value
                when 'sy' then new OutputExpression 'sym', node.name,
                    node.cd, node.uri
                when 'v' then new OutputExpression 'var', node.name
                when 'a' then new OutputExpression 'app', childResults...
                when 'bi'
                    vars = ( new OutputExpression 'var', v.name \
                        for v in node.variables )
                    head = OutputExpression.fromOpenMath node.symbol
                    body = OutputExpression.fromOpenMath node.body
                    new OutputExpression 'bin', [1...childResults.length],
                        head, vars..., body
                when 'e' then new OutputExpression 'err',
                    OutputExpression.fromOpenMath( node.symbol ),
                    childResults...
                else throw "This should never happen - how did an
                    OMNode instance get type #{node.type}?"

For convenience, we install in the `OMNode` class a method for converting
instances to `OutputExpression` types by simply deferring the work to the
above function.

    OM::toOutputExpression = -> OutputExpression.fromOpenMath @

## Exports

Now if this is being used in a Node.js context, export the class we defined.

    if exports?
        exports.OutputStructure = OutputStructure
        exports.OutputExpression = OutputExpression
        exports.OM = exports.OMNode = OM
