// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

//var direction = {horizontal:0, vertical:1}
const UNIT_SIZE = 30;
const BOARD_SIZE = 20;
const BOARD_NAME = "board"
//czas po jakim sprawdzamy czy przeciwnik wykonaΕ‚ ruch
const TIME = 14;
const TIME_ONLINE = 25;

var userFound = false;

var playerUnitMoved = false;
var playerUnitBought = false;
var unitId;
//var playerUnitId;
var currentPlayerId;
var opponentPlayerId;

var move_range_x = -1;
var move_range_y = -1;
var move_range = 0; 
var buy_area = 0;
var map_size_y = 0;
var is_owner = true;
var map_size =[0,0];
    
var eMove = { UP : 0, DOWN : 1, LEFT : 2, RIGHT : 3 };

var dragIdElements = new Array();
var dragElements = new Array();

var oPerCallRemote = null;

//--Maciek----------------------------------------------------------------------
function fixedLayout()
{     
  if ($("board"))
  {
    adjustLayout();  
  }else{
    adjustHomeLayout();
  }
}

function setOffline()
{  
    $("online_status").innerHTML = "offline"; 
    $("online_status").setStyle({color: 'red'});
}

//when player move unit on board
function movePlayerUnit(_playerUnitId,_currentPlayerId,_opponentPlayerId,_moveRange){ 
  playerUnitMoved = true;
  unitId = _playerUnitId;
  currentPlayerId = _currentPlayerId;
  opponentPlayerId = _opponentPlayerId;
  move_range = _moveRange;
// alert (mouseIsDown + "  " + mouseIsUp);
}

function buyPlayerUnit(_unitId,_currentPlayerId,_opponentPlayerId){ 
  playerUnitBought = true;  
  unitId = _unitId;
  currentPlayerId = _currentPlayerId;
  opponentPlayerId = _opponentPlayerId;
// alert (mouseIsDown + "  " + mouseIsUp);
}

function unitIsMoved(){
   if ($("board"))
   {
      if (playerUnitMoved)
      {
        hideMoveRange();
        setUnitPos(unitId,currentPlayerId,opponentPlayerId,move_range);
        playerUnitMoved = false;
      }
    }
}

function unitIsBought(){
   if ($("board"))
   {
       if (playerUnitBought)
      {
        hideBuyArea();
        playerUnitBought = false;            
        buyUnit(unitId,currentPlayerId,opponentPlayerId);
      }
   }
}

//blokuje jednostke w czasie przenoszenia
function blockDraggableElement(unitId,currentPlayerId,isPlayerUnit)
{
    active_ajax_loading();
//    alert("block");
//    eval("drag_" + unitId + "_" + currentPlayerId).destroy();    
//    dragElements[unitId].destroy();
    destroyDraggableElement(unitId,currentPlayerId,isPlayerUnit);
//    path = $("[unit(" + unitId + "," + currentPlayerId + ")]").getElementsByTagName("img")[0].src;    
//    path = path.replace(/unit\/show\/[0-9]/,"images/interactive_elements/moving_unit.gif");    
//    $("[unit(" + unitId + "," + currentPlayerId + ")]").getElementsByTagName("img")[0].src = path;
    if (isPlayerUnit){
        changeDivImage(unitId,currentPlayerId,"moving_unit.gif");
    }else{
        changeUnitDivImage(unitId,currentPlayerId,"moving_unit.gif");
    }     
        
}

//blokuje jednostke, zeby nie dalo sie nia poruszac i zmienia jpgega
function blockUnit(unitPlayerId,playerId,unitId,isPlayerUnit){
    
    destroyDraggableElement(unitPlayerId,playerId,isPlayerUnit);
    
     if (isPlayerUnit){
        changeDivImageToBlocked(unitPlayerId,playerId,unitId);
     }else{      
        changeUnitImageToBlocked(unitId,playerId)         ;
     }           
}

function createDraggableElement(unitId,playerId,oppId,m_range,isPlayerUnit){    

   var counter = dragIdElements.length;
  
   if (isPlayerUnit){
        dragIdElements[dragIdElements.length] = unitId + "_" + playerId;                    
         dragElements[counter] = new Draggable("[unit("+ unitId + "," + playerId +  ")]",
            {revert:
                    function()
                            { 
                                return ((revertElementIfNotOnBoard(unitId,playerId,isPlayerUnit)) 
                                    || (revertElementIfNotInMoveRange(unitId,playerId,m_range))
                                    )
                            }, 
                snap:30,
                onEnd: unitIsMoved,
                scroll: window
                } ); 
   }else{
        dragIdElements[dragIdElements.length] = "avail" + unitId + "_" + playerId;              
        dragElements[counter] = new Draggable("[availunit("+ unitId + "," + playerId +  ")]",
            {revert: 
                    function()
                            {    
                              return ((revertElementIfNotOnBoard(unitId,playerId,isPlayerUnit))
                                      || (revertElementIfNotOnBuyArea(unitId,playerId)));
                            },
            snap:30,
            onEnd: unitIsBought,
            scroll: window
              } ); 
   }         
}

//Ewa
function revertElementIfNotOnBuyArea(u_id,p_id){
    var top = $("[availunit(" + u_id + "," + p_id + ")]").offsetTop;
    var offset_top = parseInt($('board').offsetTop);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var iOffsetX = parseInt($("offsetX").innerHTML);
    
    if(is_owner){
        return (top > (buy_area*UNIT_SIZE + offset_top-(iOffsetY * UNIT_SIZE) - UNIT_SIZE)); 
    }else{
        var y = (iOffsetY + BOARD_SIZE + buy_area)- map_size_y;
        if(y > 0){
          y = iOffsetY + BOARD_SIZE - y;
          return (top < $("[" + iOffsetX +','+ y + "]").offsetTop);
        }else{ return true;}
    }       
    return false;
}

//Ewa
function revertIfOnYourUnit(u_id,p_id,isPlayerUnit){
//    var top;
//    var left;
//    var revert = false;
//    if(isPlayerUnit){
//        //document.getElementsByTagName("img").
//        top = $("[unit(" + u_id + "," + p_id + ")]").offsetTop;
//        left = $("[unit(" + u_id + "," + p_id + ")]").offsetLeft;
//    }else{
//       top = $("[availunit(" + u_id + "," + p_id + ")]").offsetTop;
//       left = $("[availunit(" + u_id + "," + p_id + ")]").offsetLeft; 
//    }     
//     var i = 0;
//     var unit_id;
//     var player_id;
//     var units = eval(getUnitPosFromDiv());     
//     if(units != null) 
//     {      
//         for(i; i < units.length; i++)
//         {
//            unit_id = units[i][2];
//            player_id = units[i][3];
//            if(!((unit_id == u_id)&&(player_id == p_id))){
//                if(isPlayerUnit){
//                    revert = ($("[unit("+unit_id+","+player_id+")]").offsetTop == top)
//                          &&($("[unit("+unit_id+","+player_id+")]").offsetLeft == left);
//                  }else{
//                    revert = ($("[unit("+unit_id+","+player_id+")]").offsetTop == top-1)
//                    //TODO - delete '-1', if availunits will not be down any more 1px from unit 
//                        &&($("[unit("+unit_id+","+player_id+")]").offsetLeft == left);
//                  }
//             }else {
//                 revert = false;
//             }
//            if (revert) {
//                if(player_id == p_id){
//                    //alert('my unit');
//                    return revert; //return true - revert unit
//                }else{
//                    if(isPlayerUnit){
//                      //alert('ATTACK');
//                      //attackIfOnOpponentUnit();
//                        return !revert;//return false - not revert unit, unit should attack
//                    }else{
//                        return revert; //you put ur bought unit on unit opponent
//                    }
//                }
//            }
//         }
//     }
//     return revert;
return false;
}


//Ewa
function revertElementIfNotInMoveRange(u_id,p_id,m_range){
    
    var  top = $("[unit(" + u_id + "," + p_id + ")]").offsetTop;
    var  left = $("[unit(" + u_id + "," + p_id + ")]").offsetLeft;
    
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
  
    var x = (move_range_x) * UNIT_SIZE + document.getElementById(BOARD_NAME).offsetLeft - (iOffsetX*UNIT_SIZE); 
    var y = (move_range_y) * UNIT_SIZE  + document.getElementById(BOARD_NAME).offsetTop - (iOffsetY *UNIT_SIZE);
    
    return (left > x + (m_range*UNIT_SIZE)+UNIT_SIZE-2)//2 - border, TODO:usunac jak jednostki beda odpowiedniej wielkosci
            ||(left < x - (m_range*UNIT_SIZE))
            ||(top < y - (m_range*UNIT_SIZE))
            ||(top > y+(m_range*UNIT_SIZE)+UNIT_SIZE-2);//2-border, czytaj wyzej
    
}

//Ewa
function revertElementIfNotOnBoard(u_id,p_id,isPlayerUnit){
    
    var offset_left = parseInt($('board').offsetLeft);
    var offset_right = parseInt($('board').offsetWidth) + offset_left;
    var offset_top = parseInt($('board').offsetTop);
    var offset_bottom = parseInt($('board').offsetHeight) + offset_top;    
    
    var top;
    var left;
    if(isPlayerUnit){
      top = $("[unit(" + u_id + "," + p_id + ")]").offsetTop;
      left = $("[unit(" + u_id + "," + p_id + ")]").offsetLeft;
    }else{
      top = $("[availunit(" + u_id + "," + p_id + ")]").offsetTop;
      left = $("[availunit(" + u_id + "," + p_id + ")]").offsetLeft;
    }
    var result;
    result = ((top < offset_top)
             ||(top + UNIT_SIZE- 1 > offset_bottom ) //TODO: delete - one pixel down from unit
             ||(left < offset_left) 
             || (left + UNIT_SIZE > offset_right));
        // alert(top + UNIT_SIZE +">"+ offset_bottom );
    return result;
}

function destroyDraggableElement(unitId,playerId,isPlayerUnit){
    var i = 0;
    for(i = 0; i < dragIdElements.length; i++){
        if (isPlayerUnit){
          if (dragIdElements[i] == (unitId + "_" + playerId)){
              dragElements[i].destroy();
          }
        }else{
           if (dragIdElements[i] == ("avail" + unitId + "_" + playerId)){
              dragElements[i].destroy();
          } 
        }
    }
}

//zmienia tylko unita po lewej stronie wyglad
function changeUnitImageToBlocked(unitId,playerId){
    var path = "/unit/show_blocked/" + unitId;
    if($("[availunit(" + unitId + "," + playerId + ")]")){
      $("[availunit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeDivImageToBlocked(unitId,playerId,id){
    var path = "/unit/show_blocked/" + id;
//        = $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src;    
//    path = path.replace(/show/,"show_blocked");
    if($("[unit(" + unitId + "," + playerId + ")]")){
      $("[unit(" + unitId + "," + playerId + ")]").style.zIndex = 1;
      $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeDivImageToNormal(unitId,playerId,id){
    var path = "/unit/show/" + id;
    if($("[unit(" + unitId + "," + playerId + ")]")){
      $("[unit(" + unitId + "," + playerId + ")]").style.zIndex = 1;
      $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeDivImageToChecked(unitId,playerId,id){
    var path = "/unit/show_checked/" + id; 
    if($("[unit(" + unitId + "," + playerId + ")]")){
      $("[unit(" + unitId + "," + playerId + ")]").style.zIndex = 3;
      $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeDivImageToBlockedChecked(unitId,playerId,id){
    var path = "/unit/show_blocked_checked/" + id; 
    if($("[unit(" + unitId + "," + playerId + ")]")){
      $("[unit(" + unitId + "," + playerId + ")]").style.zIndex = 3;
      $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeUnitDivImageToNormal(unitId,playerId){
    var path = "/unit/show/" + unitId; 
    if($("[availunit(" + unitId + "," + playerId + ")]")){
        $("[availunit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;       
    }
}


function changeDivImage(unitId,playerId,image){
    var path = "/images/interactive_elements/" + image;    
    if($("[unit(" + unitId + "," + playerId + ")]")){
      $("[unit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function changeUnitDivImage(unitId,playerId,image){
    var path = "/images/interactive_elements/" + image;    
    if($("[availunit(" + unitId + "," + playerId + ")]")){
      $("[availunit(" + unitId + "," + playerId + ")]").getElementsByTagName("img")[0].src = path;    
    }
}

function iAmOnline(id)
{

    fixedLayout();       

//    $('board').addEventListener("mousedown", mousedown, false);

//    if ($('board'))
//    {
//      //$('board').addEventListener("mouseup", mouseup, false);    
//    }

    if ((id != "") && (id !=  null))
    {
      new PeriodicalExecuter(function() 
            {
  
                    new Ajax.Request('/users/i_am_online',
                    {
                        asynchronous:true, evalScripts:true,                       
                        parameters:'id='+ id,   
                        onFailure: function()
                        {
                            setOffline();
                        },
                        onException: function()
                        {
                            setOffline();                                                       
                        },   
                        onComplete: function(transport){
                            var response = transport.responseText || "error";
                            if (response == "error")
                                {
                                  setOffline();   
                                }
                        }                        
                    }                    
                    ); 
            }             
      ,TIME_ONLINE)
    }  
}

function checkLoginAvailability(value)
{   
    $("login_checking").show();
    new Ajax.Request('/users/check_login',{asynchronous:true, evalScripts:true,
        parameters: {login: value}}); 
    return false;
}

function adjustHomeLayout()
{
    $("footer").style.visibility = "visible";
}

function adjustLayout()
{
  // Get natural heights  
  var cHeight = Element.getHeight("board_content");
  var lHeight = Element.getHeight("leftcontent");
  var rHeight = Element.getHeight("rightcontent");

  // Find the maximum height
  var maxHeight =
    Math.max(Math.max(cHeight,600), Math.max(lHeight, rHeight)); 
  
  var fixedHeight = 600 // super-hruper hacking
  
  // Assign maximum height to all columns  
  $("board").style.height =  fixedHeight + "px";
  $("left").style.height =  fixedHeight + "px";
  $("right").style.height = fixedHeight + "px";    
  $("wrapper").style.height = fixedHeight + "px";
  $("main").style.height = fixedHeight + "px";
  $("board_content").style.height = fixedHeight + "px";  

  // Show the footer  
  $("footer").style.visibility = "visible";
  $("board").style.visibility = "visible";
  
  // Set the correct position of unit_panel 30   
  var top_panel = $("unit_panel").getElementsByTagName("div")[0].offsetTop;    
  $("ut1").style.marginBottom =  (top_panel%30) + "px";
//  alert($("ut1").style.marginBottom.toString());
}

function mouseOnBoard(e, idBoard) {
  var coords = new Array();
  coords[0]="sadf"
  coords[1]="saf"
  if( !e ) { e = window.event; }
  if( !e ) { return null; }
  if( typeof( e.pageX ) == 'number' ) { 
//      alert("page" + e.pageX + "  " + e.pageY)
      coords[1] = e.pageY - document.getElementById(idBoard).offsetTop
      coords[0] = e.pageX - document.getElementById(idBoard).offsetLeft
  } else if( typeof( e.clientX ) == 'number' ) {
    coords[0] = e.clientX;
    coords[1] = e.clientY;
    if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
      coords[0] += document.body.scrollLeft;
      coords[1] += document.body.scrollTop;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
      coords[0] += document.documentElement.scrollLeft;
      coords[1] += document.documentElement.scrollTop;
    }
  } else { return null; }  
  return coords;
}

function elementClick(e, idBoard)
{
//    pobiera wspΓ³Ε‚rzedne gdzie jest myszka
    var coords = new Array();
    coords = mouseOnBoard(e,idBoard) ;
//    document.getElementById('mouse_coord_x').innerHTML = coords[0];
//    document.getElementById('mouse_coord_y').innerHTML = coords[1];    
//     document[2].src = '/unit/show/'
   // document[7].src = '/element/show/7' 
   
//    new Ajax.Request('/game/move?x=' + coords[0] + '&y=' +  coords[1] 
//           , {asynchronous:true, evalScripts:true}); 
    return false;
}


function scroll_down(sizeOfBoard,sizeX,sizeY)
{
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var iSofB = parseInt(sizeOfBoard);
    var iX = parseInt(sizeX);
    var iY = parseInt(sizeY);    
    
    var unitPositions = getUnitPosFromDiv();
    if ((iOffsetY + iSofB) < iY) {     
        
        $("arrow_up").style.visibility = 'visible';
        for( var i = iOffsetX; i < iSofB + iOffsetX; i++)
        { 
            $("[" + i + "," + iOffsetY + "]").style.display = "none"; 
        }          
        for( i = iOffsetX; i < iSofB + iOffsetX; i++)
        { 
            $("[" + i + "," + (iOffsetY + iSofB) + "]").style.display = "inline"; 
        }                   
        iOffsetY++;
        $("offsetY").innerHTML = iOffsetY;   
        move_units(unitPositions, eMove.DOWN);
    }
    else{       
        $("arrow_down").style.visibility = 'hidden'
    } 
}

function scroll_up(sizeOfBoard,sizeX,sizeY)
{
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var iSofB = parseInt(sizeOfBoard);
    var iX = parseInt(sizeX);    
    var iY = parseInt(sizeY);    
    var iTemp;

    var unitPositions = getUnitPosFromDiv();

    if ( iOffsetY >  0 ) {

        $("arrow_down").style.visibility = 'visible';
        for( var i = iOffsetX; i < iSofB + iOffsetX; i++)
        { 
            iTemp = (iOffsetY - 1)
            $("[" + i + "," + iTemp + "]").style.display = "inline";             
        }           
        
        for( i = iOffsetX; i < iSofB + iOffsetX; i++)
        { 
            $("[" + i + "," + (iOffsetY + iSofB - 1) + "]").style.display = "none"; 
        }           
              
        iOffsetY--;
        $("offsetY").innerHTML = iOffsetY;
        move_units(unitPositions, eMove.UP);
    } 
    else{       
        $("arrow_up").style.visibility = 'hidden'
    } 
}

function scroll_left(sizeOfBoard,sizeX,sizeY)
{
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var iSofB = parseInt(sizeOfBoard);
    var iX = parseInt(sizeX);    
    var iY = parseInt(sizeY);    
    var iTemp;

   var unitPositions = getUnitPosFromDiv();
    
    if ( iOffsetX >  0 ) {
        
        $("arrow_right").style.visibility = 'visible';  

        for( var i = iOffsetY; i < iSofB + iOffsetY; i++)
        { 
            iTemp = (iOffsetX - 1)
            $("[" + iTemp + "," + i + "]").style.display = "inline";             
        }           
        
        for( i = iOffsetY; i < iSofB + iOffsetY; i++)
        { 
            iTemp = (iOffsetX + iSofB - 1)
            $("[" + iTemp + "," + i + "]").style.display = "none"; 
        }           
              
        iOffsetX--;
        $("offsetX").innerHTML = iOffsetX; 
        move_units(unitPositions, eMove.LEFT);
    }else{
        $("arrow_left").style.visibility = 'hidden';        
    }
}

function scroll_right(sizeOfBoard,sizeX,sizeY)
{
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var iSofB = parseInt(sizeOfBoard);
    var iX = parseInt(sizeX);
    var iY = parseInt(sizeY);    
               
    var unitPositions = getUnitPosFromDiv();
        
    if ((iOffsetX + iSofB) < iX) {
               
        $("arrow_left").style.visibility = 'visible';    

        for( var i = iOffsetY; i < iSofB + iOffsetY; i++)
        { 
            $("[" + iOffsetX + "," + i + "]").style.display = "none"; 
        }           
        
        for( i = iOffsetY; i < iSofB + iOffsetY; i++)
        { 
            $("[" +  (iOffsetX + iSofB) + "," + i + "]").style.display = "inline"; 
        }           
              
        iOffsetX++;
        $("offsetX").innerHTML = iOffsetX;    
        move_units(unitPositions, eMove.RIGHT);
    }else{       
        $("arrow_right").style.visibility = 'hidden'
    } 
}

function showUser(){   
    
    login = $("user_login").value;           
    $("find_user_loading").show();
    
    if (oPerCallRemote){
      oPerCallRemote.stop();    
    }
    
    new Ajax.Request('/users/show_user',{asynchronous:true, evalScripts:true,
          parameters: {login: login}});   
    $("user_login_found").innerHTML = login;    
    return false;    
}

function active_ajax_loading(){
    $("ajax_loading").show();
}

function deactive_ajax_loading(){
    $("ajax_loading").hide();
}

function change_tab(tab,no_tab){
    itab = parseInt(tab)
    i_no_tab = parseInt(no_tab);
    
    for (var i = 0; i < no_tab; i++){
        if (i != itab){
          $(i.toString()).className = "nonactive_tab";
        }else{
          $(i.toString()).className = "active_tab";
        }
    }        
}

function reset_flash(){    
   
    if ($("notification")){
        $("notification").remove()
    }
    if ($("error")){
       $("error").remove();
    }   
       
}
//------------------------------------------------------------------------------


//---Ewa------------------------------------------------------------------------

function setAllUnitPos(curr_p_id, opp_p_id){
       new Ajax.Request('/unit/set_units',
          {asynchronous:true, evalScripts:true,
          parameters: {curr_player_id: curr_p_id, opp_player_id: opp_p_id}});
      
}


// zapisuje pozycjΔ™ jdnostki do bazy
function setUnitPos(u_id, curr_p_id, opp_p_id, m_range){
    
  if((!revertElementIfNotOnBoard(u_id,curr_p_id,true))
      && (!revertElementIfNotInMoveRange(u_id,curr_p_id,m_range))){
     var coords = new Array();     
     var i = 0;
     var x;
     var y;
     var unit_id;
     var player_id;
     
     var units = eval(getUnitPosFromDiv());     
//     alert (units);
     if(units != null) 
     {      
         for(i; i < units.length; i++)
         {
            x = units[i][0];
            y = units[i][1];
            unit_id = units[i][2];
            player_id = units[i][3];
            
            if ((player_id == curr_p_id) && (unit_id == u_id)){            
                coords = getUnitPosition(unit_id,curr_p_id,true);               
                             
                  if (checkIfCoordsChanged(x,y,coords)){                
                     
                    blockDraggableElement(u_id,curr_p_id,true);
                    
                    new Ajax.Request('/unit/leave',
                    { asynchronous:true, evalScripts:true,
                        parameters: {x: coords[0], y: coords[1], unitid: u_id,
                        curr_player_id: curr_p_id,opp_player_id: opp_p_id}});}}
                  }                
     }   
}     
     return false;
}

function buyUnit(u_id, curr_p_id, opp_p_id){
 
// alert ('u='+u_id+' p='+curr_p_id);
  coords = getUnitPosition(u_id,curr_p_id,false);   
  off_X = parseInt($("offsetX").innerHTML);
  off_Y = parseInt($("offsetY").innerHTML);
  

    if ((checkIfOnBoard(coords))
        &&(!revertElementIfNotOnBoard(u_id,curr_p_id,false))
        &&(!revertElementIfNotOnBuyArea(u_id,curr_p_id)))
    {   
      blockDraggableElement(u_id,curr_p_id,false);

      new Ajax.Request('/unit/buy',
              { method: 'post',asynchronous:true, evalScripts:true,
                parameters: {x: coords[0], y: coords[1], unitid: u_id,
                curr_player_id: curr_p_id,opp_player_id: opp_p_id,
                offsetX: off_X, offsetY: off_Y }});                               
    }
}


function checkIfOnBoard(coords){
    if ( (coords[0] - parseInt($("offsetX").innerHTML) >= 0)
        && ( (coords[1] - parseInt($("offsetY").innerHTML)) <= BOARD_SIZE) ) {
        return true;
    }
    return false;    
}

//sprawdza czy zmieniΕ‚a siΔ™ pozycja jednostki
function checkIfCoordsChanged(x,y,coords){
    if ((x != coords[0]) || (y != coords[1]))  return true;    
    return false;    
}


//Maciek
// zwraca tablicΔ™, pozycja jednostki danego playera x,y, zczytuje z planszy 
function getUnitPosition(unit_id, player_id, isPlayerUnit)
{
    
  var x;
  var y;
    
  if (isPlayerUnit){
      
    x = $("[unit(" + unit_id + "," + player_id + ")]").offsetLeft
    y = $("[unit(" + unit_id + "," + player_id + ")]").offsetTop 
      
  }else{
//      alert("[availunit(" + unit_id + "," + player_id + ")]");
     x = $("[availunit(" + unit_id + "," + player_id + ")]").offsetLeft
     y = $("[availunit(" + unit_id + "," + player_id + ")]").offsetTop 
  } 
  
// alert ("xy" +  x + "  " + y);
    
  var coords = unitPositionOnBoard(x,y)
  
  var iOffsetX = parseInt($("offsetX").innerHTML);
  var iOffsetY = parseInt($("offsetY").innerHTML);   
  
//  alert("c" +  coords[0] +  "   " + coords[1])

  coords[0] = (coords[0] / UNIT_SIZE) + iOffsetX;     
  coords[1] = (coords[1] / UNIT_SIZE) + iOffsetY;  
//  alert ("posistion " + coords[0] + "  " + coords[1]);
  
  return coords
}

function unitPositionOnBoard(x,y) {
  var coords = new Array(); 
  
  coords[0] = x - document.getElementById(BOARD_NAME).offsetLeft    
  coords[1] = y - document.getElementById(BOARD_NAME).offsetTop  
 
  return coords;
}
//--------------------------------

function showBuyArea(_buy_area,_map_size,_isOwner){
    //alert ('buy area= '+_buy_area+ ' map='+_map_size+' isOwner='+ _isOwner);
    buy_area = _buy_area;
    is_owner = _isOwner;
    map_size_y = _map_size;
    var iOffsetX = parseInt($("offsetX").innerHTML);
    var iOffsetY = parseInt($("offsetY").innerHTML);
    var i;
    var j;
    var til;
    if(is_owner){
      i = iOffsetY;
      j = iOffsetX;
      til = buy_area;
    }else{
      i= map_size_y - buy_area; //- iOffsetY;
      j= iOffsetX;
      til = map_size_y;
    }
    for(i; i<til; i++){
        for(j; j<(BOARD_SIZE + iOffsetX);j++){
          $("["+ j + "," + i + "]").style.opacity = 0.5;
        }
        j=iOffsetX;
    }
    
}

function hideBuyArea(){
  if(buy_area > 0){
      var iOffsetX = parseInt($("offsetX").innerHTML);
      var iOffsetY = parseInt($("offsetY").innerHTML);
      var i;
      var j;
      var til;
    if(is_owner){
      i = iOffsetY;
      j = iOffsetX;
      til = buy_area;
    }else{
      i= map_size_y - buy_area; //- iOffsetY;
      j= iOffsetX;
      til = map_size_y;
    }
    for(i; i<til; i++){
        for(j; j<(BOARD_SIZE + iOffsetX);j++){
          $("["+ j + "," + i + "]").style.opacity = 1;
        }
        j=iOffsetX;
    }
    
  }
}

function showMoveRange(u_id,p_id, _move_range, _map_size) {
    
    move_range_x = parseInt(getUnitPosition(u_id,p_id,true)[0]);
    move_range_y = parseInt(getUnitPosition(u_id,p_id,true)[1]); 
    move_range = _move_range;
    map_size = eval(_map_size);
    //alert (map_size);
    var s,l;
      if((move_range_x != null)&&(move_range_y != null)){
        l = 0;
        while(l <= move_range){
          s = 0;
          while(s <= move_range){
            if(((move_range_x - s) >= 0) && ((move_range_y - l) >= 0) 
                && ((move_range_y - l)<map_size[1]) && ((move_range_x - s) < map_size[0]))
            {
              $("["+(move_range_x - s)+ "," + (move_range_y - l) + "]").style.opacity = 0.6;
            }
          s = s + 1;
        }
        s = s - 1;
        while(s >= 0){
          if(((move_range_x + s) >= 0) && ((move_range_y + l) >= 0) 
              && ((move_range_y + l)<map_size[1]) && ((move_range_x + s) < map_size[0])){
                $("["+(move_range_x + s) + "," + (move_range_y + l) + "]").style.opacity = 0.6;
            }
          s = s - 1;
        }
        l = l + 1;
      }
      l = l - 1
      while(l > 0) {
        s = 0;
        while(s <= move_range){
          if(((move_range_x - s) >= 0) && ((move_range_y + l) >= 0) 
              && ((move_range_y + l)<map_size[1]) && ((move_range_x - s) < map_size[0])){
                $("["+(move_range_x - s) + "," + (move_range_y + l) + "]").style.opacity = 0.6;}
          s = s + 1;
        }
        s = s - 1;
        while(s >= 0){
          if(((move_range_x + s) >= 0) && ((move_range_y - l) >= 0) 
              && ((move_range_y - l)<map_size[1]) && ((move_range_x + s) < map_size[0])){
                $("["+(move_range_x + s) + "," + (move_range_y - l) + "]").style.opacity = 0.6;
          }
          s = s - 1;
        }
        l = l - 1;
    }
  }
}


function hideMoveRange() { 
   var s,l;
      if((move_range_x != -1)&&(move_range_y != -1)){
        l = 0;
        while(l <= move_range){
          s = 0;
          while(s <= move_range){
            if(((move_range_x - s) >= 0) && ((move_range_y - l) >= 0) 
                && ((move_range_y - l)<map_size[1]) && ((move_range_x - s) < map_size[0]))
                {
                  $("["+(move_range_x - s)+ "," + (move_range_y - l) + "]").style.opacity = 1;
                }
          s = s + 1;
          }
          s = s - 1;
          while(s >= 0){
            if(((move_range_x + s) >= 0) && ((move_range_y + l) >= 0) 
                && ((move_range_y + l)<map_size[1]) && ((move_range_x + s) < map_size[0])){
                  $("["+(move_range_x + s) + "," + (move_range_y + l) + "]").style.opacity = 1;}
            s = s - 1;
          }
          l = l + 1;
      }
      l = l - 1
      while(l > 0) {
        s = 0;
        while(s <= move_range){
          if(((move_range_x - s) >= 0) && ((move_range_y + l) >= 0) 
              && ((move_range_y + l)<map_size[1]) && ((move_range_x - s) < map_size[0])){
                $("["+(move_range_x - s) + "," + (move_range_y + l) + "]").style.opacity = 1;}
          s = s + 1;
        }
        s = s - 1;
        while(s >= 0){
          if(((move_range_x + s) >= 0) && ((move_range_y - l) >= 0) 
              && ((move_range_y - l)<map_size[1]) && ((move_range_x + s) < map_size[0])){
                $("["+(move_range_x + s) + "," + (move_range_y - l) + "]").style.opacity = 1;
          }
          s = s - 1;
        }
        l = l - 1;
    }
  }
}

//get list of unit positions which should be moved 
function getUnitPosFromDiv(){
    if( $("unit_move_pos").innerHTML == ""){
        return null;
    }
    return $("unit_move_pos").innerHTML;
}

//moving units on the board
function move_units(_unitPositions, _emove)
{
    //alert(_unitPositions);
    if(_unitPositions != null) //moving only if exist any units on the board
    {      
      var unitPos = eval(_unitPositions);
      var i = 0;
      var _x, _y, _u_id, _p_id;
      var n_y, n_x, temp; 
      var ioffsetY = parseInt($("offsetY").innerHTML);
      var ioffsetX = parseInt($("offsetX").innerHTML);
      var iboard = BOARD_SIZE;

      for(i; i < unitPos.length; i++)
      {
        _x= unitPos[i][0];
        _y = unitPos[i][1];
        _u_id = unitPos[i][2];
        _p_id = unitPos[i][3];
        switch(_emove)
        {
          case eMove.UP:
              temp = $("[unit(" + _u_id + "," + _p_id + ")]").style.top;
              n_y = getIntVal(temp) + UNIT_SIZE;
              $("[unit(" + _u_id + "," + _p_id + ")]").style.top =  n_y + 'px';
              if(((_y>=ioffsetY) && ((_y-ioffsetY)<iboard))
                  && ((_x>=ioffsetX) && ((_x - ioffsetX) < iboard )))
              {
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "visible";
              }else{
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "hidden";
                  hideAttackResultToolTip();
              }
              break;
          case eMove.DOWN:
              temp = $("[unit(" + _u_id + "," + _p_id + ")]").style.top;
              n_y = getIntVal(temp) - UNIT_SIZE;
              $("[unit(" + _u_id + "," + _p_id + ")]").style.top =  n_y + 'px';
              if(((_y<ioffsetY) || ((_y-ioffsetY)>= iboard)) 
                  || ((_x<ioffsetX) || ((_x - ioffsetX) >= iboard )))
              {
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "hidden";
                  hideAttackResultToolTip();
              }
              else{
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "visible";
              }
              break;
          case eMove.LEFT:
              temp = $("[unit(" + _u_id + "," + _p_id + ")]").style.left;
              n_x = getIntVal(temp) + UNIT_SIZE;
              $("[unit(" + _u_id + "," + _p_id + ")]").style.left =  n_x + 'px';
              if(((_x>=ioffsetX) && ((_x - ioffsetX) < iboard ))
                &&((_y>=ioffsetY) && ((_y-ioffsetY)<iboard)))
              {
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "visible";
              }
              else{
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "hidden";
                  hideAttackResultToolTip();
              }
              break;
          case eMove.RIGHT:
              temp = $("[unit(" + _u_id + "," + _p_id + ")]").style.left
              n_x = getIntVal(temp) - UNIT_SIZE;
              $("[unit(" + _u_id + "," + _p_id + ")]").style.left =  n_x + 'px';
              if(((_x>=ioffsetX) && ((_x - ioffsetX) < iboard ))
                && ((_y>=ioffsetY) && ((_y-ioffsetY)<iboard)))
              {
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "visible";
              }
              else{
                  $("[unit(" + _u_id + "," + _p_id + ")]").style.visibility = "hidden";
                  hideAttackResultToolTip();
              }
              break;
        }
      }
    }
}

//function get from size int
function getIntVal(_string)
{
    var value = _string.substring(0,_string.length - 2);// ex.100px
    return parseInt(value)
}

function showAttackResultToolTip(u, p, is_kill, text){
//    alert ( text);
   var obj = document.getElementById('bubble_tooltip_attack');
   var obj2 = document.getElementById('bubble_tooltip_content_attack');
   obj2.innerHTML = text; //+ "<a href='#' onclick='hideAttackResultToolTip("+u+","+p+")>close</a>";
   obj.style.display = 'block';
   //var coords = getUnitPosition(u, p, true)
   obj.style.zIndex = 4;
//   $("[unit(" + u + "," + p + ")]").style.zIndex = 3;
  if (!is_kill){
      obj.style.top = ($("[unit(" + u + "," + p + ")]").offsetTop - 125) + 'px';
  }else{
      obj.style.top = ($("[unit(" + u + "," + p + ")]").offsetTop - 155) + 'px';
  }
  obj.style.left = ($("[unit(" + u + "," + p + ")]").offsetLeft - 90) + 'px';
}

function hideAttackResultToolTip(){
    if ($('bubble_tooltip_attack')){
//      $("[unit(" + u + "," + p + ")]").style.zIndex = 1;
      document.getElementById('bubble_tooltip_attack').style.display = 'none'; 
    }
}

//tooltip actions
function showToolTip(e,text)
{
   if(document.all)
       e = event;

   var obj = document.getElementById('bubble_tooltip_terrain');
   var obj2 = document.getElementById('bubble_tooltip_content_terrain');
   obj2.innerHTML = text;
   obj.style.display = 'block';
   var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
   if(navigator.userAgent.toLowerCase().indexOf('safari')>=0)
       st=0; 
   var leftPos = e.clientX - 100;
   if(leftPos<0)
       leftPos = 0;
   obj.style.left = leftPos + 'px';
   obj.style.top = e.clientY - obj.offsetHeight -1 + st + 'px';
} 

function hideToolTip()
{
    document.getElementById('bubble_tooltip_terrain').style.display = 'none'; 
}
 
 function loadAccordion() 
{
  news_accordion = new accordion('vertical_container',{
                // The speed of the accordion
          resizeSpeed : 8,
          // The classnames to look for
          classNames : {
                  // The standard class for the title bar
              toggle : 'accordion_toggle',
              // The class used for the active state of the title bar
              toggleActive : 'accordion_toggle_active',
              // The class used to find the content
              content : 'accordion_content'
          },
          // The direction of the accordion
          direction : 'vertical',
          // Should the accordion activate on click or say on mouseover? (apple.com)
          onEvent : 'click',
          onActivate : getContent
  });
  // Open first one
  var verticalAccordions = $$('.accordion_toggle');
	verticalAccordions.each(function(accordion) {
		$(accordion.next(0)).setStyle({
		  height: '0px'
		});
	});
  news_accordion.activate($$('#vertical_container .accordion_toggle')[0]);
}

function getContent(elem){
  var elemid = $(elem).id;
  var elements = $(elem).descendants();
  //  alert ($(elem).descendants()[7])
  if($(elements[7])){
    var spanid = $(elements[7]).id; //span content
    switch (elemid) {
      case 'dynamicduo':
        fnAJAXIT('/news/new_content', spanid);
        break;
      case 'dynamicforever':
        fnAJAXIT('/news/new_content', spanid);
        break;
    }
  }
}

function fnAJAXIT(url, updateelem)
{
  active_ajax_loading();		
  $(updateelem).innerHTML = 'Loading....';

  //I usualled throw in some Spinny animated Gif here.

  var ajax = new Ajax.Request(url , 
          { 
//                  onSuccess :  ajax_text,
                  parameters : 'updateelem=' + updateelem
          }
     );

}

function ajax_text(originalRequest)
{
	var textdata = originalRequest.responseText.evalJSON();
	
	$(textdata.updateelem).innerHTML = textdata.message; 
}

function changePlayerUnitPosition(unitId,playerId,x,y){
    
    var iOffsetX  = 0// = parseInt(offset_x);
    var iOffsetY = 0 // = parseInt(offset_y);
    
    var el;
    var coords = new Array();
    
    var deltaX;
    var deltaY;
    
    var left;
    var top;
    
    coords = getUnitPosition(unitId, playerId, true)
    
//    nowa pozycja
    x = parseInt(x); 
    y = parseInt(y);
    
    deltaX = x - coords[0];
    deltaY = y - coords[1]; 
    
// alert("deltaX " + deltaX + " deltaY " + deltaY);    
    
    if($("offsetY"))
    { 
       iOffsetY = parseInt($("offsetY").innerHTML); 
    }
    if($("offsetX"))
    { 
       iOffsetX = parseInt($("offsetX").innerHTML); 
    }    
    
    el = $("[unit(" + unitId + "," + playerId + ")]")

    el.style.position = "relative";       
    
    left = getIntVal(el.style.left) + UNIT_SIZE * deltaX
        
    el.style.left = left.toString() + "px";       
    
    top = getIntVal(el.style.top) + UNIT_SIZE * deltaY;  
    
    el.style.top = top.toString() + "px";      
    
    setVisibility(unitId,playerId,x,y,iOffsetX,iOffsetY)
    
}

function hideUnit(unit_id,player_id){
    $("[unit(" + unit_id + "," + player_id + ")]").style.visibility = "hidden"
}

function setVisibility(unitId,playerId,x,y,iOffsetX,iOffsetY)
{
    if ((x >= BOARD_SIZE + iOffsetX) || 
        (y >= BOARD_SIZE + iOffsetY) ||
        (y < iOffsetY) || (x < iOffsetX))
        {
           $("[unit(" + unitId + "," + playerId + ")]").style.visibility = "hidden"  ;
        }else
        {
           $("[unit(" + unitId + "," + playerId + ")]").style.visibility = "visible"  ;
        }
    
}

function appendConsole(text)
{
    var value;
    
    value = $('console').innerHTML;       
    value = text+ value;
    $('console').innerHTML = value;         
}

//sprawdza czy przeciwnik wykonaΕ‚ ruch, co TIME sec
function checkOpponentMovement(opp_id)
{    
    new PeriodicalExecuter(function() 
    {        
        if (true) 
        { 
             var iOffsetX = 0
             var iOffsetY = 0 
            
             if($("offsetY"))              
                 iOffsetY = parseInt($("offsetY").innerHTML); 
             
             if($("offsetX"))             
                 iOffsetX = parseInt($("offsetX").innerHTML); 
                 
            
            new Ajax.Request('/player/opponent_move/' + opp_id
            , {asynchronous:true, evalScripts:true,
                parameters:'&offset_x='+ iOffsetX + '&offset_y='+ iOffsetY      
            }); 
        }
    }, TIME)
}


function setReadyPlayer(player_id)
{           
   var iOffsetX = 0
   var iOffsetY = 0 

   if($("offsetY"))              
       iOffsetY = parseInt($("offsetY").innerHTML); 

   if($("offsetX"))             
       iOffsetX = parseInt($("offsetX").innerHTML); 


  new Ajax.Request('/player/set_ready/' + player_id
  , {asynchronous:true, evalScripts:true,
      parameters:'&offset_x='+ iOffsetX + '&offset_y='+ iOffsetY      
  }); 
}

//------------------------------------------------------------------------------
