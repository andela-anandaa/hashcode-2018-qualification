#! /usr/bin/env node
const fs = require('fs');

const utils = require('./utils');

const inFile = process.argv[2];


const exit = () => {
  console.log(...arguments);
  process.exit();
}

// simulation timer

class Fleet {
  constructor(index) {
    this.rides = [];
    this.position = [0, 0]; // [r, c]
    this.rideStatus = 0; // 0 - idle, 1 - on-ride
    this.index = index;
  }

  // make static later
  chooseRide(rides, currentStep) {
    // current position
    // steps to ride
    // check if can take ride
    // take the least steps
    // earliest time for ride
    // take the ride

    // get available rides (for the fleet)
    const availableRides = rides.filter(r => !r.taken && r.canPick(this, currentStep));
    if (availableRides.length > 0) {
      // choose the ride out of the available rides
      const ride = availableRides.sort((a, b) => a.stepsToMe(this) < b.stepsToMe(this))[0];
      this.takeRide(ride);
    }
  }

  takeRide(ride) {
    console.log(`Fleet ${this.index} take ride ${ride.index}`);
    this.rideStatus = 1;
    this.rides.push(ride.index);
    // perform transformations as sim. clock turns (steps)
    ride.taken = true;
  }

  takeStep(currentStep) {

  }

  finishRide(ride) {
    // move with clock
    this.rideStatus = 0;
    this.position = ride.finish;
  }
}

class Ride {
  constructor(a, b, x, y, s, f, index) {
    this.start = [a, b]; // [r, c]
    this.finish = [x, y]; // [r, c]
    this.eStart = s; // earliest start
    this.lFinish = f; // latest finish
    this.stepsNeeded = Math.abs(a - x) + Math.abs(b - y);
    this.taken = false;
    this.index = index;
  }

  stepsToMe(fleet) {
    return Math.abs(this.start[0] - fleet.position[0]) + Math.abs(this.start[1] - fleet.position[1]);
  }

  stepToPick(fleet, currentStep) {
    return currentStep + this.stepsToMe(fleet);
  }

  canPick(fleet, currentStep) {
    return (this.stepsToMe(fleet) + this.stepsNeeded) < (this.lFinish - currentStep)
  }
}

const PARAMS = {
  R: 0,
  C: 0,
  F: 0, // fleets
  N: 0, // rides
  B: 0, // bonus
  T: 0, // steps
};

let rides = [];
let fleets = [];

function runSimulation(fleets, rides) {
  for (let i = 0; i < PARAMS.T; i += 1) {
    const availableFleets = fleets.filter(f => f.rideStatus === 0);
    // run findRide
    availableFleets.forEach(f => f.chooseRide(rides, i));
  }
  
  // list of rides taken per fleet
  fleets.forEach(f => {
    console.log(f.rides.length, f.rides.join(' '));
  });
}

let lc = 0;
utils.readWriteLine(inFile, (line, rl) => {
  const lineArray = line.split(' ').map(Number);
  if (lc === 0) {
    PARAMS.R = lineArray[0];
    PARAMS.C = lineArray[1];
    PARAMS.F = lineArray[2];
    PARAMS.N = lineArray[3];
    PARAMS.B = lineArray[4];
    PARAMS.T = lineArray[5];
  } else {
    const ride = new Ride(...lineArray, lc - 1);
    rides.push(ride);
  }
  lc += 1;
  
  // reached end of line
  if (lc === (PARAMS.N + 1)) {
    // create fleets
    for (let i = 0; i < PARAMS.F; i += 1) {
      const fleet = new Fleet(i);
      fleets.push(fleet);
    }
    
    // run the sim
    runSimulation(fleets, rides);
  }
});


const outFile = inFile.replace('.in', '.out');
// fs.appendFileSync(outFile, `Out: ${lineArray[0]}\n`);
