Ruler Commands
===

本文件说明尺规作图中的原子操作以及基本操作。

## 原子类型

尺规作图中需要四种基本的数据结构类型。

* `float` - 表示标量值，比如坐标值或者弧度值
* `Point` - 表示一个点，其中 `x` 和 `y` 属性分别表示横坐标和纵坐标
* `Line` - 表示一条直线，采用标准方程的格式表示（`aX + bY + c = 0`），其中 `a`、`b` 和 `c` 分别表示方程系数
* `Arc` - 表示一个圆的圆弧，圆心为 `Point` 类型的属性 `center`，半径为 `r`

## 原子命令

原子命令从传统的尺规作图中提取，主要包括定点、连线、作弧。具体命令见下表：

```
Point ruler.point(float x, float y);
Point ruler.point(Line l1, Line l2);
Point ruler.point(Line l, Arc a);
Point ruler.point(Arc a1, Arc a2);

Point ruler.line(Point p1, Point p2);
Point ruler.line(Point p, Arc a);
Point ruler.line(Arc a1, Arc a2);

Point ruler.distance(Point p1, Point p2);

Point ruler.arc(Point p, float d);
```

Command |Format                     |Description
--------|---------------------------|-------------
P       |P `id` `x` `y`             |定义一个点，点的坐标为 (x, y)
P       |P `id` `l1` `l2`           |定义一个点，为两直线 `l1` 和 `l2` 的交点，若两直线无交点，则报错
P       |P `id` `l` `a`             |定义一个点，为直线 `l` 和圆弧 `a` 的交点，若两者无交点，则报错
P       |P `id` ``
L       |L `id` `p1` `p2`           |Defines a straight line by p1 and p2
D       |D `id` `p1` `p2`           |Defines a distance between p1 and p2
C       |C `id` `p` `d`             |Defines a circle track use p as center and d as radius, the track's angle is from 0 to 2PI
