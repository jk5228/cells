'use strict';

/* Cells - An evolutionary game
 * Jason Kim
 * 4/15/2015
 */

// Config
var population = 50;
var canvas = document.getElementById('canvas');
var maxwidth = canvas.width;
var maxheight = canvas.height;

// Cursor
var cursor = {
  point: new Point(100,100),
  path: new Path.Circle({
    center: new Point(100,100),
    radius: 10,
    fillColor: 'white'
  })
};

// Boid class
function Boid(position,angle,speed,color) {
  var position = position || new Point(0,0);
  this.angle = angle || 90;
  this.speed = speed || 1;
  this.color = color || new Color('red');
  this.path = new Path({
    segments: [
      [position.x-10,position.y-10],
      [position.x,position.y+15],
      [position.x+10,position.y-10],
      [position.x-10,position.y-10]
    ],
    fillColor: this.color,
    closed: true
  });
  this.path.rotate(this.angle-90,this.path.position);
};

// Animate boid
Boid.prototype.iterate = function() {

  // Update position
  var rad = this.angle * Math.PI/180;
  var dX = Math.cos(rad) * this.speed;
  var dY = Math.sin(rad) * this.speed;
  this.path.translate(new Point(dX,dY));

  // Update angle
  var vector = cursor.point - this.path.position;
  var rawdiff = Math.floor(vector.angle) - this.angle;
  // console.log(rawdiff);
  if ((rawdiff < 0 && rawdiff > -180) || rawdiff >= 180) {
    this.angle -= this.speed;
    if (this.angle < -180)
      this.angle += 360;
    this.path.rotate(-this.speed,this.path.position);
  }
  else if ((rawdiff > 0 && rawdiff < 180) || rawdiff <= -180) {
    this.angle += this.speed;
    if (this.angle > 180)
      this.angle -= 360;
    this.path.rotate(this.speed,this.path.position);
  }

};

var boids = [];

for (var i = 0; i < population; i++) {
  var position = new Point(Math.random() * maxwidth,Math.random() * maxheight);
  var angle = Math.floor(Math.random() * 360) - 180;
  var speed = Math.ceil(Math.random() * 5);
  var boid = new Boid(position,angle,speed);
  boids.push(boid);
}

function onFrame() {
  for (var i = 0; i < population; i++) {
    boids[i].iterate();
  }
}

function onMouseDown(e) {
  var delta = e.point - cursor.point;
  cursor.point = e.point;
  cursor.path.translate(delta);
}