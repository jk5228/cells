'use strict';

/* Cells - An evolutionary game
 * Jason Kim
 * 4/15/2015
 */


var ticker = require('ticker');


// Point

function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}


// Return the point rotated by the given angle in radians w/r/t (0,0)
Point.prototype.rotated = function(ang) {
  var x = this.x * Math.cos(-ang) - this.y * Math.sin(-ang);
  var y = this.x * Math.sin(-ang) + this.y * Math.cos(-ang);
  return new Point(x,y);
};

// Return the distance to the given point
Point.prototype.dist = function(pt) {
  return Math.sqrt(Math.pow(this.x-pt.x,2) +
                   Math.pow(this.y-pt.y,2));
};


// Cell

function Cell(center,dna) {
  this.center = center || new Point(0,0);
  this.angle = -Math.PI/2;
  this.dna   = dna || { speed: 1, attr: 1, rep: 1, alone: 1 };
}

Cell.prototype.width  = 20;    // Default height of cell
Cell.prototype.height = 30;    // Default width of cell

Cell.prototype.top = function() {
  var pt = new Point(0,-Cell.prototype.height/2);
  var x = pt.rotated(this.angle).x + this.center.x;
  var y = pt.rotated(this.angle).y + this.center.y;
  return new Point(x,y);
};

Cell.prototype.right = function() {
  var pt = new Point(Cell.prototype.width/2,Cell.prototype.height/2);
  var x = pt.rotated(this.angle).x + this.center.x;
  var y = pt.rotated(this.angle).y + this.center.y;
  return new Point(x,y);
};

Cell.prototype.left = function() {
  var pt = new Point(-Cell.prototype.width/2,Cell.prototype.height/2);
  var x = pt.rotated(this.angle).x + this.center.x;
  var y = pt.rotated(this.angle).y + this.center.y;
  return new Point(x,y);
};

Cell.prototype.draw = function() {
  var ctx   = this.context;
  var top   = this.top();
  var right = this.right();
  var left  = this.left();

  // Draw cell
  ctx.beginPath();
  ctx.moveTo(top.x,top.y);      // Top point
  ctx.lineTo(right.x,right.y);  // Bottom-right point
  ctx.lineTo(left.x,left.y);    // Bottom-left point
  ctx.lineTo(top.x,top.y);      // Top point
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
};


$(document).ready(function(){


  // Set canvas properties
  var canvas = document.getElementsByTagName('canvas')[0],
      ctx    = canvas.getContext('2d');
  var body = $('body');

  Cell.prototype.context = ctx;

  canvas.width = body.width();
  canvas.height = body.height();


  // Environment variables
  var speed    = 5,      // Speed of game
      popstart = 10,      // Size of starting population
      popmax   = 5,      // Maximum population size
      cells    = [];     // Cell array

  for (var i = 0; i < popstart; i++) {      // Create start population
    var dna = {
      speed : Math.random() + 0.5,          // Movement speed
      attr  : Math.random() + 0.5,          // Attraction to cells
      rep   : Math.random() + 0.5,          // Repulsion from predators
      alone : Math.random() + 0.5           // Behavior when alone
    };
    var pt = new Point(0,Math.random() * body.height());
    cells.push(new Cell(pt,dna));
  }


  // Setup ticker
  ticker(window, 60, 5)
    .on('tick', function() {
      canvas.width = body.width();
      canvas.height = body.height();

      for (var i = 0; i < cells.length; i++) {
        cells[i].center.x += 1*cells[i].dna.speed;
        cells[i].angle += 0.01*cells[i].dna.speed;
      }
      console.log(cells[0].center.dist(cells[1].center));
    })
    .on('draw', function() {
      canvas.width = canvas.width;   // Clear canvas
      for (var i = 0; i < cells.length; i++) {
        cells[i].draw();
      }
    });
});