Ruler Commands
===

This file describes the primitive and basic commands for geometry ruler.

## Primitive Commands

Primitive commands inherits from the typical compass and straightedge constructions. Includes commands below.

Command |Format                     |Description
--------|---------------------------|-------------
P       |P `name` `x` `y`           |Defines a point with certain coordinate (x, y)
L       |L `name` `p1` `p2`         |Defines a straight line by p1 and p2
D       |D `name` `p1` `p2` [`r`]   |Defines a distance between p1 and p2, can optional multipy by r
C       |C `name` `p` `d`           |Defines a circle track use p as center and d as radius, the track's angle is from 0 to 2PI
I       |I `name` `c1` `c2` or<br/>I `name` `c1` `l1`         |
