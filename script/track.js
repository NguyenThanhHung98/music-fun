class Step
{
    constructor()
    {
        this.notes = [];
        this.active = false;
        this.octave = 4;
    }
    addNote(note)
    {
        //Check to see if note is already on the step
        var canAdd = true;
        for(let i = 0; i < this.notes.length; i++){
            if(this.notes[i] == (note+this.octave)){
                //Note is already here; do nothing
                canAdd = false;
                return false;
            }
        }

        //Add note to the step
        if(canAdd){
            this.notes.push(note+this.octave);
            return true;
        }
    }
    removeNote(note)
    {
        for(let i = 0; i < this.notes.length; i++){
            if(this.notes[i] == (note+this.octave)){
                //Remove note from array
                this.notes.splice(i, 1);
                break;
            }
        }
    }
}

class Track
{
    constructor(trackNum)
    {
        this.steps = []; //Array of steps and their notes
        this.loop; //Interval
        this.trackNum = trackNum; //Track number

        this.midiDevice = 0;
        this.midiChannel = 1;
        this.clock = "8n";
        this.stepTime = GetStepTime("8n");
        this.noteTime = GetStepTime("8n");
        this.cycleDelay = 0;
        this.cycleSteps = false;
        this.shiftNotes = false;

        this.randScale = getRandom(1,6);
        this.randRoot = 0;
        this.randOctave = 4;
        this.randSteps = 8;

        this.sliderValues = [1, 1, 4, 3, 0, 1, 1, 0, 0, 4, 8];
        //Fill steps array with empty steps
        for(let i = 0; i < 16; i++)
            this.steps.push(new Step());
    }
    startLoop()
    {
        //Get parameters to use in our loop
        var track = this;
        var stepCount = 0;
        var stepElememts = document.getElementById("track" + this.trackNum);
        this.stepTime = GetStepTime(this.clock);
        
        //Start the sequence
        this.loop = setInterval(function(){
            //Send MIDI data
            console.log(track);
            console.log(stepCount);
            console.log(track.steps[stepCount]);
            if(track.steps[stepCount] != undefined){
                if(track.steps[stepCount].active){
                    //Step is active
                    if(track.steps[stepCount].notes.length > 0){
                        console.log(track);
                        //Step has notes
                        for (let i = 0; i < track.steps[stepCount].notes.length; i++) {
                            console.log(track.steps[stepCount].notes[i]);
                            console.log(track.steps[stepCount].notes[i]);
                            // console.log(track.midiChannel);
                            // console.log(track.noteTime);
                            // console.log(track.midiDevice);
                            // SendNote(track.steps[stepCount].notes[i], track.midiChannel, track.noteTime, track.midiDevice);
                            SendPlay(track.steps[stepCount].notes[i], track.clock, track.trackNum);
                        }
                    }
                }
            }

            //Handle loop
            if(stepCount == (15 + track.cycleDelay)){
                //Reached end of sequence
                stepElememts.children[14].style.border = "";
                stepElememts.children[15].style.borderTop = "1px solid white";
                stepElememts.children[15].style.borderBottom = "1px solid white";

                //Random steps
                if(track.cycleSteps){
                    //Activate random steps
                    var stepElements = document.getElementById("track" + track.trackNum);
                    for(let i = 0; i < 16; i++){
                        track.steps[i].active = true;
                        stepElements.children[i].style.backgroundColor = "";
                    }
                    // for(let i = 0; i < track.randSteps; i++){
                    //     var s = getRandom(0, 16);
                    //     track.steps[s].active = true;
                    //     stepElements.children[s].style.backgroundColor = "var(--dark-blue2)";
                    // }
                }

                //Shift notes to the left
                if(track.shiftNotes){
                    var stepElements = document.getElementById("track" + track.trackNum);
                    var newNotes = [];
                    for(let i = 0; i < 16; i++){
                        newNotes.push(track.steps[i].notes[0]);
                    }
                    for(let i = 0; i < 16; i++){
                        if(i == 15){
                            track.steps[i].notes[0] = newNotes[0];
                        }else{
                            track.steps[i].notes[0] = newNotes[i+1];
                        }
                        stepElements.children[i].innerHTML = track.steps[i].notes[0];
                    }
                }

                stepCount = 0;
            }else{
                if(stepCount < 15){
                    if(stepCount == 0)
                        stepElememts.children[15].style.border = "";
                    else if(stepCount > 0)
                        stepElememts.children[stepCount-1].style.border = "";
                
                    stepElememts.children[stepCount].style.borderTop = "1px solid white";
                    stepElememts.children[stepCount].style.borderBottom = "1px solid white";
                }
                
                stepCount++;
            }
        }, this.stepTime);
    }
    generate(trackNum)
    {
        //Generate a random sequence based on current parameters
        var pool = []; //Pool of notes to choose from

        //Get notes from scales
        if (this.randScale == 1){
            for(let i = 0; i < MajorScale.length; i++){
                var n = Tone.Frequency(MajorScale[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }else if (this.randScale == 2){
            for(let i = 0; i < MinorScale.length; i++){
                var n = Tone.Frequency(MinorScale[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }else if (this.randScale == 3){
            for(let i = 0; i < MajorSeven.length; i++){
                var n = Tone.Frequency(MajorSeven[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }else if (this.randScale == 4){
            for(let i = 0; i < MinorSeven.length; i++){
                var n = Tone.Frequency(MinorSeven[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }else if (this.randScale == 5){
            for(let i = 0; i < Sus2.length; i++){
                var n = Tone.Frequency(Sus2[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }else if (this.randScale == 6){
            for(let i = 0; i < Sus4.length; i++){
                var n = Tone.Frequency(Sus4[i] + (Number(this.randOctave))).transpose(this.randRoot).toNote();
                pool.push(n);
            }
        }
        
        var stepElements = document.getElementById("track" + trackNum);
        if (!stepElements) {
            var stepElements = document.getElementById("track" + this.trackNum);
        }
        console.log(stepElements);
        //Generate sequence
        for(var i = 0; i < 16; i++){
            this.steps[i].notes[0] = "";
        }
        for(var i = 0; i < 16; i++){
            var note = getRandom(0, pool.length);
            this.steps[i].notes[0] = pool[note];
            stepElements.children[i].innerHTML = pool[note];

            this.steps[i].active = true;
            stepElements.children[i].style.backgroundColor = "";
            console.log(this.steps[i]);
        }

        //Activate random steps
        // for(let i = 0; i < this.randSteps; i++){
        //     var s = getRandom(0, 16);
        //     this.steps[s].active = true;
        //     stepElements.children[s].style.backgroundColor = "var(--dark-blue2)";
        // }

        //Update piano roll
        for(let i = 0; i < 16; i++)
        {
            ChangeOctave(0, i, document.getElementById("notes"+i).children[0]);
        }
    }
}



//Get note length in milliseconds
function GetStepTime(toneTime)
{
    return Tone.Time(toneTime).toSeconds() * 1000;
}