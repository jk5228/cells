'use strict';

/* Cells - An evolutionary game
 * Jason Kim
 * 4/15/2015
 */

// Config
var population = 100;
var canvas = document.getElementById('canvas');
var maxwidth = canvas.width;
var maxheight = canvas.height;
var maxspeed = 5;

// Cursor
var pt = new Point(Math.floor(Math.random() * maxwidth),
                   Math.floor(Math.random() * maxheight));

var cursor = {
  point: pt,
  path: new Path.Circle({
    center: pt,
    radius: 20,
    fillColor: 'white'
  })
};

// Boid class
function Boid(position,angle,speed,color) {
  var position = position || new Point(0,0);
  this.angle = angle || 90;
  this.speed = speed || 1;
  this.path = new Path({
    segments: [
      [position.x-10,position.y-10],
      [position.x,position.y+15],
      [position.x+10,position.y-10],
      [position.x-10,position.y-10]
    ],
    fillColor: this.color || new Color('red'),
    closed: true
  });
  this.path.rotate(this.angle-90,this.path.position);
};

// Animate boid
Boid.prototype.iterate = function() {

  // if (this.path.intersects(cursor.path)) {
  //   // view.pause();
  //   return;
  // }

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

  // Update color
  var dist = 30/cursor.path.position.getDistance(this.path.position);
  this.path.fillColor.brightness = dist;

};

var boids = [];

for (var i = 0; i < population; i++) {
  var position = new Point(Math.random() * maxwidth,Math.random() * maxheight);
  var angle = Math.floor(Math.random() * 360) - 180;
  var speed = Math.ceil(Math.random() * maxspeed);
  var boid = new Boid(position,angle,speed);
  boids.push(boid);
}

function onFrame() {
  for (var i = 0; i < population; i++) {
    boids[i].iterate();
  }
}

function onMouseMove(e) {
  var delta = e.point - cursor.point;
  cursor.point = e.point;
  cursor.path.translate(delta);
  // view.play();
}