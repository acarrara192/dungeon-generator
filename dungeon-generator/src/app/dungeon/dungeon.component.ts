import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {
  dimension = 0;
  numTunnels = 0;
  maxLength = 0;
  dungeon: number[][] = [];
  hasGenerated = false;
  startRow = -1;
  startCol = -1;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.dimension = f.value.dungeonDim;
    this.numTunnels = f.value.numTunnels;
    this.maxLength = f.value.maxLength;
    this.createArray();
    this.randomWalk();
    console.clear;
    
  }
  createArray() {
    this.dungeon = new Array(this.dimension);
    for (var i = 0; i < this.dungeon.length; i++) {
      var fillArray = Array(this.dimension).fill(1);
      this.dungeon[i] = fillArray;
    }
    this.hasGenerated = true;
    
  }
  oppositeDirection(d: number[]) {
    return d.map(x => x*-1);
  }
  directionsEqual(d1: number[], d2:number[]) {
    if (d1[0] == d2[0] && d1[1] == d2[1]) {
      return true;
    }
    else {
      return false;
    }

  }
  breaksBounds(currentCol: number, currentRow: number, d: number[], tunnelLength: number){
    if (
      currentRow + (d[0]*tunnelLength) <= 0 || 
      currentRow + (d[0]*tunnelLength) >= this.dimension -1 || 
      currentCol + (d[1]*tunnelLength) <= 0 || 
      currentCol + (d[1]*tunnelLength) >= this.dimension -1
      ){
      return true;
    }
    else {
      return false;
    }
  }
  randomWalk() {
    // pick a random starting point 
    this.startRow = Math.floor(Math.random() * this.dimension );
    this.startCol = Math.floor(Math.random() * this.dimension );  
    this.dungeon[this.startRow][this.startCol] = 0;
    var tunnels = this.numTunnels;
    var currentRow = this.startRow;
    var currentCol = this.startCol;
    let directions: number[][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]; //up, down, left, right
    var lastDir = [0,0];
    while (tunnels !== 0) {
      //pick a length
      var tunnelLength = Math.floor(Math.random() * this.maxLength) + 1;
      // direction
      var possibleDirections = [];
      for (var d of directions) { // eliminate bad directions
        if (!this.directionsEqual(d, lastDir) && !this.directionsEqual(this.oppositeDirection(d), lastDir) && 
        !this.breaksBounds(currentCol, currentRow, d, tunnelLength)){
          possibleDirections.push(d);
        }
      } 
      if (possibleDirections.length == 0) { // try again if no directions were viable (length too big)
        continue;
      }
      // choose a random direction out of the good ones 
      var chosenDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      
      // update the dungeon, current, and last variables 
      for (let i = 0; i < tunnelLength; i++) {
        if (this.directionsEqual(chosenDirection, [-1,0])) { //up

          this.dungeon[currentRow - 1][currentCol] = 0;
          currentRow -= 1;
          
          }
        else if (this.directionsEqual(chosenDirection, [1,0])) { // down
          this.dungeon[currentRow + 1][currentCol] = 0;
          currentRow += 1;
          
          }
        else if (this.directionsEqual(chosenDirection, [0,-1])) { // left
          this.dungeon[currentRow][currentCol - 1] = 0;
          currentCol -= 1;
          
          }
        else if (this.directionsEqual(chosenDirection, [0,1])) { // right
          this.dungeon[currentRow][currentCol + 1] = 0;
          currentCol += 1;
          }

        }
        lastDir = chosenDirection;
        tunnels--;
      }
   
    }


    chooseBorder(side: string, j: number, i:  number) { //used to apply correct css images
      var result = false;
      if (this.dungeon[j][i] == 1) {
        try {
          switch (side) {
            case 'top' :
              if (this.dungeon[j-1][i] <= 0) {
                result = true;
              }
              break;
            case 'bottom' :
              if (this.dungeon[j+1][i] <= 0) {
                result = true;
              }
              break;
            case 'left' :
              if (this.dungeon[j][i-1] <= 0) {
                result = true;
              }
              break;
            case 'right' :
              if (this.dungeon[j][i+1] <= 0) {
                result = true;
              }
              break;
            case 'top-left' :
              if (
                this.dungeon[j-1][i-1] <= 0 && 
                this.dungeon[j-1][i] == 1 && 
                this.dungeon[j][i-1] == 1 
                ){
                result = true; 
              }
              break;
            case 'top-right' :
              if (
                this.dungeon[j-1][i+1] <= 0 &&
                this.dungeon[j-1][i] == 1 &&
                this.dungeon[j][i+1] == 1 
                ){
                  result = true;
              }
              break;
            case 'bottom-right':
              if (
                this.dungeon[j+1][i+1] <= 0 &&
                this.dungeon[j][i+1] == 1 &&
                this.dungeon[j+1][i] == 1 
              ){
                result = true;
              }
              break;
            case 'bottom-left':
              if (
                this.dungeon[j+1][i-1] <= 0 &&
                this.dungeon[j][i-1] == 1 &&
                this.dungeon[j+1][i] == 1
              ){
                result = true;
              }
              break;
          }
        }
        catch(e) {
          result = false;
        }
      }
      return result;
    }
  }


