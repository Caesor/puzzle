/**
 * Jigsaw Puzzle
 * 
 * Puzzle is a flat space-filling and solution-arranging game. 
 * Players will require put all zero-piece pattern together, then the whole plane will show.
 *
 * @author Nemo
 * @version 1.0
 * 
 * @param  COLNUM  The column number of puzzle
 * 
 */
window.onload = function(){
	COLNUM = 3;//default parameter
	init();
	setting();
}
function init(){
	var child = document.getElementsByClassName("puzzle_part");
	if(child.length != 0){
		while(child.length != 0){
			document.getElementById("puzzle_area").removeChild(child[child.length-1]);
		}
	}
	createPuzzleBox();//initialize the puzzle
	puzzles = document.getElementById("puzzle_area").getElementsByTagName("div");
	start();
}
function setting(){
	//select a background picture for fun
	var select_bg = document.getElementById("bg");
	select_bg.onchange = function(event){
		for(var j = 0; j < puzzles.length; j++){
			puzzles[j].style.backgroundImage = "url(resource/background" + event.target.selectedIndex + ".jpg)";
		}
	}
	//choose the difficulty of the game, higher number, the more difficult the game
	var select_level = document.getElementById("choose_level");
	select_level.onchange = function(event){
		stop();
		COLNUM = parseInt(select_level.options[event.target.selectedIndex].text);
		document.getElementById("level").innerHTML = COLNUM;
		init();
	}
	//have a look at the whole picture
	var cheat = document.getElementById("cheat");
	cheat.onmousedown = function(){
		document.getElementById("puzzle_area").style.backgroundImage = document.getElementsByClassName("puzzle_part")[0].style.backgroundImage;
		for(var i = 0; i < puzzles.length; i++){
			puzzles[i].style.display = "none";
		}
	}
	cheat.onmouseup = function(){
		document.getElementById("puzzle_area").style.backgroundImage = "none";
		for(var i = 0; i < puzzles.length; i++){
			puzzles[i].style.display = "block";
		}
	}
}
function createPuzzleBox(){
	var width = 400 / COLNUM;
	var height = width;
	var puzzle = new Array();
	var puzzle_box = document.getElementById("puzzle_area");
	for( var i = 0; i < COLNUM * COLNUM; i++ ){
		puzzle[i] = document.createElement("div");
		puzzle[i].className = "puzzle_part";
		puzzle[i].id = "puzzle_part_" + i;
		puzzle[i].style.width = width + "px";
		puzzle[i].style.height = height + "px";
		var x = (i % COLNUM) * width + "px";
		var y = parseInt(i / COLNUM) * height + "px";
		puzzle[i].style.left = x;
		puzzle[i].style.top = y;
		puzzle[i].style.backgroundImage = "url(resource/background0.jpg)";
		puzzle[i].style.backgroundPosition = "-" + x + " -" + y;
		if(i == COLNUM * COLNUM - 1){
			blank_position = [x, y];
		}else{
			puzzle_box.appendChild(puzzle[i]);
		}
	}
}

function addHandlerToPuzzlePieces(){
	OnmouseoverHandler();
	OnclickHandler();
}

function OnmouseoverHandler(){
	for (var i = 0; i < puzzles.length; i++ ){
		puzzles[i].onmousemove = onMouseOverAnimation;
		puzzles[i].onmouseout = onMouseOutAnimation;
	}
}
function onMouseOverAnimation(event){
	var onMouseMovePuzzle = event.target;
	if(canMove(onMouseMovePuzzle)){
		onMouseMovePuzzle.className = "puzzle_part will_move";
	}
}
function onMouseOutAnimation(event){
	var onMouseOutPuzzle = event.target;
	if(canMove(onMouseOutPuzzle)){
		onMouseOutPuzzle.className = "puzzle_part";
	}	
}
function OnclickHandler(){
	for (var i = 0; i < puzzles.length; i++ ){
		puzzles[i].onclick = moveAnimation;
	}
}
function moveAnimation(event){
	var onClickPuzzle = event.target;
	//alert(canMove(onClickPuzzle))
	if(canMove(onClickPuzzle)){
		
		movePuzzle(onClickPuzzle);
		
	}
}
function canMove(obj){
	var distance = Math.sqrt(Math.pow(parseInt(obj.style.left) - parseInt(blank_position[0]),2)+Math.pow(parseInt(obj.style.top) - parseInt(blank_position[1]),2));
	//alert(distance)
	if (distance > 400 / COLNUM){
		return false;
	}
	return true;
}
function movePuzzle(onClickPuzzle){
	var new_blank_position = [onClickPuzzle.style.left, onClickPuzzle.style.top];
	var timer = null;
	clearInterval(timer);
	timer = setInterval(function(){
		var num = 13;
		if(onClickPuzzle.style.top == blank_position[1] ){
			var speed = onClickPuzzle.offsetLeft < parseInt(blank_position[0])?num:-num;
			if( Math.abs(onClickPuzzle.offsetLeft - parseInt(blank_position[0])) < num ) {
					clearInterval(timer);
					onClickPuzzle.style.left = blank_position[0];
					blank_position = new_blank_position;
					if(checkWin()){
						clearInterval(start_time);
						showWin();
					}
				} else {
					// 到达目标之前
					onClickPuzzle.style.left = onClickPuzzle.offsetLeft + speed + "px";
				};
		}else{
			var speed = onClickPuzzle.offsetTop < parseInt(blank_position[1])?num:-num;
			if( Math.abs(onClickPuzzle.offsetTop - parseInt(blank_position[1])) < num ) {
					clearInterval(timer);
					onClickPuzzle.style.top = blank_position[1];
					blank_position = new_blank_position;
					if(checkWin()){
						clearInterval(start_time);
						showWin();
					}
				} else {
					// 到达目标之前
					onClickPuzzle.style.top = onClickPuzzle.offsetTop + speed + "px";
				};
		}
		
	},10);
	document.getElementById("step").innerHTML = parseInt(document.getElementById("step").innerHTML) + 1;
}
//Order disrupted
function shuffle(){
	var step = 100;
	for(var i = 0; i < step; i++ ){
		var puzzlesCanMove = new Array();
		var canMove_num = 0;
		for(var j = 0; j < puzzles.length; j++ ){
			if(canMove(puzzles[j])){
				puzzlesCanMove[canMove_num] = puzzles[j];
				canMove_num++;
			}
		}
		var n = Math.floor(Math.random() * canMove_num);
		var x = puzzlesCanMove[n].style.left;
		var y = puzzlesCanMove[n].style.top;
		puzzlesCanMove[n].style.left = blank_position[0];
		puzzlesCanMove[n].style.top = blank_position[1];
		blank_position = [x, y];
	}
	while(checkWin()){
		shuffle();
	}
	addHandlerToPuzzlePieces();
}

function start(){
	var start_btn = document.getElementById("start");
	var time = document.getElementById("time");
	start_time = null;
	start_btn.onclick = function(){
		start_btn.innerHTML = "Replay";
		var t = 0;
		clearInterval(start_time);
		start_time = setInterval(function(){
			time.innerHTML = t++;
		}, 1000);
		shuffle();
	}
}
function stop(){
	clearInterval(start_time);
}
function checkWin(){
	for(var i = 0; i < puzzles.length; i++){
		//optimization method
		if((puzzles[i].offsetLeft - (i % COLNUM)*400/COLNUM ) > 1 || (puzzles[i].offsetTop - parseInt(i / COLNUM)*400/COLNUM) > 1 ){
			return false;
		}
	}
	return true;
}
function showWin(){
	alert(" Congratulations!");
}
