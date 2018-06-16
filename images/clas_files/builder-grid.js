var currentDocument = null;
var timerSave = 2000;
var demoHtml = $('.demo').html();

$.fn.eachSlice=function(e,c){for(var l=$(this),n=0;n<l.length;n+=e)c.call(l.slice(n,n+e).get(),n/e);return l};

 
var addAreaContainer = "<div id='add-area-container'><input type='text' id='area-name' placeholder='Area name...'><button id='add-area' disabled>Save</button><i></i></div>";
var inputContainer = ("<div class='input-container'><input type='number' min='0' step='0.25' value='1'><select name='' id=''><option value='fr'>fr</option><option value='px'>px</option><option value='%'>%</option><option value='em'>em</option><option value='auto'>auto</option><option value='min-content'>min-content</option><option value='max-content'>max-content</option><option value='minmax'>minmax</option></select><button class='remove-item'><svg version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button></div>");
var areaColors = ["rgba(230, 25, 75, 1)",
                  "rgba(60, 180, 75, 1)",
                  "rgba(245, 130, 48, 1)",
                  "rgba(240, 50, 230, 1)",
                  "rgba(0, 128, 128, 1)"];

function updateInput(selector, subGrid) {

  // Search for current input values
  var newValues = [];
  $(selector+" .input-container").each(function(){
    var currentValue = $(this).children("input").val();
    var currentSizing = $(this).children("select").val();
    //if (currentSizing == null) { var currentSizing = ""; }    
    if (currentValue) { var currentMix = currentValue + currentSizing; } else { var currentMix = currentSizing; }
    if (currentSizing == "minmax") { 
      currentValue = currentValue.replace(/\s+/g, '');      
      var currentMix = "minmax(" + currentValue +")";
    }       
    if (currentSizing == "auto" || currentSizing == "min-content" || currentSizing == "max-content" ) { var currentMix = currentSizing; }    
    newValues.push(currentMix)
  });
  newValues = newValues.join(" ");  

  if (selector == ".input-cols") { currentLayoutJson[subGrid].current_cols = newValues; }
  if (selector == ".input-rows") { currentLayoutJson[subGrid].current_rows = newValues; }
  if (selector == ".input-gaps") { currentLayoutJson[subGrid].current_gaps = newValues; }

  setCurrentArea(subGrid);  
  
}

function setCurrentArea(subGrid, reset) {

  if (reset) {
    var current_cols =  "1fr 1fr 1fr 1fr"; 
    var current_rows = "1fr 1fr 1fr"; 
    var current_gaps = "1px 1px"; 
    var current_areas = {};
  } else {
    var current_cols = currentLayoutJson[subGrid].current_cols; 
    var current_rows = currentLayoutJson[subGrid].current_rows; 
    var current_gaps = currentLayoutJson[subGrid].current_gaps; 
    var current_areas = currentLayoutJson[subGrid].current_areas;    
  }
  $('.warning-area').html("Editing <span>"+subGrid+"</span>");    

  var subGrid = document.querySelector("[data-name='"+subGrid+"']");

  var areaName = $(subGrid).attr("data-name");

  var gridArr = {};
  gridArr.current_rows = current_rows;
  gridArr.current_cols = current_cols;
  gridArr.current_gaps = current_gaps;
  gridArr.current_areas = current_areas;

  currentLayoutJson[areaName] = gridArr;

  subGrid.style.gridTemplateRows = current_rows;
  subGrid.style.gridTemplateColumns = current_cols;
  subGrid.style.gap = current_gaps;

  addGridSections(areaName);



}

function updateInputVals(subGrid) {
    
  // Get current CSS values from the grid
  var current_cols = currentLayoutJson[subGrid].current_cols; 
  var current_rows = currentLayoutJson[subGrid].current_rows;  

  //Add current CSS grid to manual inputs
  $('#input-add-row-text').val(current_rows);        
  $('#input-add-column-text').val(current_cols);
  $('.warning-area').html("Editing <span>"+subGrid+"</span>");    

}

function addGridSections(subGrid) {
  
    $('.warning-area').html("Editing <span>"+subGrid+"</span>");    
  var reAddedItems = $("[data-name='"+subGrid+"']").children(".saved-area");

  var AddingItems = $("section.adding").detach();
  var AddedItems = $("[data-name='"+subGrid+"']").children(".saved-area").detach();

  var selectedItems = [];
  
  var startCell = $('section.start-cell').find('span').attr('data-row') + $('section.start-cell').find('span').attr('data-col');
  selectedItems.push(startCell);
  
  var endCell = $('section.end-cell').find('span').attr('data-row') + $('section.end-cell').find('span').attr('data-col');
  selectedItems.push(endCell);

  $("[data-name='"+subGrid+"']").find("section").remove();

  //$("[data-name='"+subGrid+"']").append("<button class='subgrid-area'><svg version='1.1' id='Grid' x='0px' y='0px' viewBox='0 0 20 20' enable-background='new 0 0 20 20' xml:space='preserve'><path fill='#FFFFFF' d='M8,4H5C4.447,4,4,4.447,4,5v3c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1V5C9,4.448,8.553,4,8,4z M15,4h-3  c-0.553,0-1,0.447-1,1v3c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1V5C16,4.448,15.553,4,15,4z M8,11H5c-0.553,0-1,0.447-1,1v3  c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1v-3C9,11.448,8.553,11,8,11z M15,11h-3c-0.553,0-1,0.447-1,1v3c0,0.552,0.447,1,1,1h3  c0.553,0,1-0.448,1-1v-3C16,11.448,15.553,11,15,11z'/></svg></button><button class='remove-area' id='multi-btn'><svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button><i></i>");




  var numGrid = currentLayoutJson[subGrid].current_rows; 
  var numGridToo = currentLayoutJson[subGrid].current_cols; 

  var numRowArr = [numGrid.split(/(?!\(.*)\s(?![^(]*?\))/g)];
  var numColArr = [numGridToo.split(/(?!\(.*)\s(?![^(]*?\))/g)];

  var colNumber = numColArr[0].length;
  var rowNumber = numRowArr[0].length;

  var spaceCount = colNumber * rowNumber;
  
  $("[data-name='"+subGrid+"']").append(new Array(++spaceCount).join('<section><span data-row="" data-col=""></span><b data-plusrow="" data-pluscol=""></b></section>'));

  // Adds column number to each section (data-col)
  $("[data-name='"+subGrid+"'] section").each(function(i){ 
    var num = (i%colNumber) + 1; 
    var plusnum = (i%colNumber) + 2; 

    $(this).find("span").attr("data-col", num); 
    $(this).find("b").attr("data-pluscol", plusnum); 

  });

  $("[data-name='"+subGrid+"'] section").eachSlice(colNumber, function(colNumber) { 
    var reRow = colNumber + 1; 
    var plusRow = colNumber + 2; 

    $(this).find("span").attr("data-row", reRow);
    $(this).find("b").attr("data-plusrow", plusRow); 

  });
  var replusnum = colNumber + 1; 
  var replusnumrow = rowNumber + 1;

  $("[data-name='"+subGrid+"'] b[data-plusrow="+replusnumrow+"]").addClass("lastrow"); 
  $("[data-name='"+subGrid+"'] b[data-pluscol="+replusnum+"]").addClass("lastcol"); 

  generateTemplateAreas(subGrid, reAddedItems)

  $("[data-name='"+subGrid+"']").append(AddedItems);
  $("[data-name='grid-container']").append(AddingItems);

}

function generateTemplateAreas(subGrid, reAddedItems) {
  var numGrid = currentLayoutJson[subGrid].current_rows; 
  var numGridToo = currentLayoutJson[subGrid].current_cols; 

  var numRowArr = [numGrid.split(/(?!\(.*)\s(?![^(]*?\))/g)];
  var numColArr = [numGridToo.split(/(?!\(.*)\s(?![^(]*?\))/g)];

  var colNumber = numColArr[0].length;
  var rowNumber = numRowArr[0].length;


  var areaRowsArr = Array(rowNumber).fill(".");
  var areaColsArr = Array(colNumber).fill(".");
  
  var areaRowsArrTotal = [].concat(...Array(colNumber).fill(areaRowsArr));
  var areaRowsArrTotal = _.chunk(areaRowsArrTotal, colNumber); 
 
  var areaRowsArrTotalString = "";

  for (i = 0; i < reAddedItems.length; ++i) { 

    var itemRowStart = reAddedItems[i].style.gridRowStart - 1; 
    var itemRowEnd = reAddedItems[i].style.gridRowEnd - 2; 
    if (itemRowStart > itemRowEnd) { itemRowEnd = itemRowStart; }

    var itemColumnStart = reAddedItems[i].style.gridColumnStart - 1; 
    var itemColumnEnd = reAddedItems[i].style.gridColumnEnd - 2; 
    if (itemColumnStart > itemColumnEnd) { itemColumnEnd = itemColumnStart; }

    var itemName = reAddedItems[i].dataset.name; 

    var list = [];
    var relist = [];

    for (var listItem = itemColumnStart; listItem <= itemColumnEnd; listItem++) { list.push(listItem); }
    for (var relistItem = itemRowStart; relistItem <= itemRowEnd; relistItem++) { relist.push(relistItem); }
    for (rreei = 0; rreei < relist.length; ++rreei) { 
      for (rei = 0; rei < list.length; ++rei) { areaRowsArrTotal[relist[rreei]][list[rei]] = itemName; }
    }
  }

  $.each( areaRowsArrTotal, function(i,val) { areaRowsArrTotalString += "\"" + val.join(" ") + "\"" + " "; });  

  document.querySelector("[data-name='"+subGrid+"']").style.gridTemplateAreas = areaRowsArrTotalString;
  //document.querySelector('grid-container-areas').style.gridTemplateAreas = areaRowsArrTotalString;
}

function syncInputVals(selector, inputID) {

  var revalueArr = [];   

  var reValue = $(inputID).val();       
  revalueArr = [reValue.split(/(?!\(.*)\s(?![^(]*?\))/g)];

  $(selector).html("");      
  $.each(revalueArr[0], function(index, item) {
    var itemNumber = [item.match(/\d{1,3}([\.]\d{1,3})?/g)];
    var propertyNumber = [item.match(/[A-Za-z-]{1,11}/g)];
    if (propertyNumber == "") { var propertyNumber = [item.match(/[%]{1}/g)]; }    
    propertyNumber = propertyNumber.join(" ");
    if (propertyNumber == "minmax,px,px") { 
      var propertyNumber = "minmax"; 
      var itemNumber = itemNumber.join(" ");
      var itemNumber = itemNumber.split(',');   
      itemNumber = itemNumber[0]+"px, "+itemNumber[1]+"px";    
    } else { itemNumber = itemNumber.join(" "); }
    if (propertyNumber == "min-content" || propertyNumber == "max-content" || propertyNumber == "auto") {
      var magicInput = "<div class='input-container'><select class='fullsize' name='' id=''><option value='' disabled selected></option><option value='fr'>fr</option><option value='px'>px</option><option value='%'>%</option><option value='em'>em</option><option value='auto'>auto</option><option value='min-content'>min-content</option><option value='max-content'>max-content</option><option value='minmax'>minmax</option></select><button class='remove-item'><svg version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button></div>"
    } else if ( propertyNumber == "minmax") {
      var magicInput = "<div class='input-container'><input type='text' value='"+itemNumber+"'><select name='' id=''><option value='' disabled selected></option><option value='fr'>fr</option><option value='px'>px</option><option value='%'>%</option><option value='em'>em</option><option value='auto'>auto</option><option value='min-content'>min-content</option><option value='max-content'>max-content</option><option value='minmax'>minmax</option></select><button class='remove-item'><svg version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button></div>"
    } else {
      var magicInput = "<div class='input-container'><input type='number' min='0' step='0.25' value='"+itemNumber+"'><select name='' id=''><option value='' disabled selected></option><option value='fr'>fr</option><option value='px'>px</option><option value='%'>%</option><option value='em'>em</option><option value='auto'>auto</option><option value='min-content'>min-content</option><option value='max-content'>max-content</option><option value='minmax'>minmax</option></select><button class='remove-item'><svg version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button></div>"
    }
    
    $(selector).append(magicInput);
    $(selector+" .input-container:last-child option[value='"+propertyNumber+"']").prop('selected', true);
  });
}


function generateArea(className, areaParent) {

    // Get coordinates of selected area    
    var selectedCol = [];
    var selectedRow = [];

    $('section.start-cell, section.end-cell').each(function(i){
      var thisCol = $(this).find("span").data("col");
      var thisRow = $(this).find("span").data("row"); 
      selectedCol.push(thisCol);
      selectedRow.push(thisRow);    
    });  

    // Filter unique values 
    var thisColUniques = _.uniq(selectedCol);
    var thisRowUniques = _.uniq(selectedRow);

    var areaCols = thisColUniques.join(" / ");   
    var areaRows = thisRowUniques.join(" / ");    

    // Get min and max values for columns and rows
    var minCol = _.minBy(thisColUniques);
    var minRow = _.minBy(thisRowUniques);

    if (thisRowUniques.length == 1 ) { var maxRow = _.maxBy(thisRowUniques); } else { var maxRow = _.maxBy(thisRowUniques) + 1 }
    if (thisColUniques.length == 1 ) { var maxCol = _.maxBy(thisColUniques); } else { var maxCol = _.maxBy(thisColUniques) + 1 }

    var IEmaxCol = _.maxBy(thisColUniques);
    var IEmaxRow = _.maxBy(thisRowUniques);

    // Append section with current columns and rows
    var addedAlready = $(".saved-area."+className+"").length;
    if (addedAlready == "0") { $("[data-name='"+areaParent+"']").append("<section class='saved-area "+className+"'><div></div></section>"); }

    if (thisColUniques.length > 1 && thisRowUniques.length == 1 ) {
      $("."+className).css("grid-row", areaRows + " / " + areaRows);
      $("."+className).css("grid-column", minCol + " / " + maxCol); 
    } else if (thisColUniques.length == 1 && thisRowUniques.length > 1 ) {
      $("."+className).css("grid-row", minRow + " / " + maxRow);
      $("."+className).css("grid-column", areaCols + " / " + areaCols); 
    } else if (thisColUniques.length == 1 && thisRowUniques.length == 1 ) {
      $("."+className).css("grid-row", areaRows + " / " + areaRows);
      $("."+className).css("grid-column", areaCols + " / " + areaCols); 
    } else if (thisColUniques.length > 1 && thisRowUniques.length > 1 ) {
      $("."+className).css("grid-row", minRow + " / " + maxRow);
      $("."+className).css("grid-column", minCol + " / " + maxCol);      
    }

    var numGrid = document.getElementById('grid-container-areas').style.gridTemplateRows;
    var numGridToo = document.getElementById('grid-container-areas').style.gridTemplateColumns; 

}

function saveSelectedArea(subGrid) {
  
    var areaName = $('#area-name').val();

  // Check if a name exists
  if($('#area-name').val()) {

    var currentreColor = $("section.start-cell").attr("data-color"); 
    $("section.start-cell").attr("data-color", ""); 
    var areaNamr = $(this).parent("section").eq(1).attr("data-name");

    generateArea("active", areaNamr);

    $("[data-name='"+subGrid+"']").css("background", currentreColor);
    var gridAreaName = document.querySelector(".saved-area.adding").style.gridArea;
    $('.saved-area').removeClass('edit-area');

    $('.saved-area').removeClass('adding');
    $("[data-name='"+subGrid+"']").addClass(subGrid);
    $("[data-name='"+subGrid+"'] > div").remove();
    $("[data-name='"+subGrid+"']").append("<button class='subgrid-area'><svg version='1.1' id='Grid' x='0px' y='0px' viewBox='0 0 20 20' enable-background='new 0 0 20 20' xml:space='preserve'><path fill='#FFFFFF' d='M8,4H5C4.447,4,4,4.447,4,5v3c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1V5C9,4.448,8.553,4,8,4z M15,4h-3  c-0.553,0-1,0.447-1,1v3c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1V5C16,4.448,15.553,4,15,4z M8,11H5c-0.553,0-1,0.447-1,1v3  c0,0.552,0.447,1,1,1h3c0.553,0,1-0.448,1-1v-3C9,11.448,8.553,11,8,11z M15,11h-3c-0.553,0-1,0.447-1,1v3c0,0.552,0.447,1,1,1h3  c0.553,0,1-0.448,1-1v-3C16,11.448,15.553,11,15,11z'/></svg></button><button class='remove-area' id='multi-btn'><svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button><i></i>");

    //$("[data-name='"+subGrid+"'] .remove-area").css("background", currentreColor);
    //$("[data-name='"+subGrid+"'] .subgrid-area").css("background", currentreColor);
    //$("[data-name='"+subGrid+"'] #add-area").css("background", currentreColor);

    $('#add-area-container').removeClass('active');
    $('section').removeClass("start-cell");
    $('section').removeClass("end-cell");

    var reselector = document.querySelector("[data-name='"+subGrid+"']");
    var reareaName = $(reselector).parent("section").attr("data-name");
    var gridMarr = currentLayoutJson[reareaName].current_areas;

    var currentAreas = [];
    if (gridMarr !== undefined) {
      for (i = 0; i < gridMarr.length; ++i) {
        var savedArea = gridMarr[i].name;
        var savedAreaParent = $("[data-name='"+savedArea+"']").parent("section").attr("data-name");
        var savedAreaColor = gridMarr[i].color;   
        var currentArea = gridMarr[i].area; 
        currentAreas.push({ 
          name: savedArea, 
          area: currentArea, 
          color: savedAreaColor, 
          parent: savedAreaParent 
        }); 
      }
    } 

    currentAreas.push({ 
      name: subGrid, 
      area: gridAreaName,
      color: currentreColor, 
      parent: reareaName 
    }); 

    currentLayoutJson[reareaName].current_areas = currentAreas;   

    }
  }

function selectChange(selector) {
  $(selector).removeClass("fullsize");              
  $(selector).prev("input").attr("disabled", false);
  var valSel = $(selector).val(); 

  if (valSel == "auto" || valSel == "max-content" || valSel == "min-content" ) {
    $(selector).prev("input").remove();    
    $(selector).addClass("fullsize");              
  }

  if (valSel == "minmax" ) {
    var thisInput = $(selector).prev("input");
    var thisVal = $(selector).val();
    var newInput = $("<input type='text' value='50px, 100px'/>");      
    $(selector).closest(".input-container").prepend(newInput);      
    $(thisInput).remove();
  }

  if (valSel == "fr") {
    $(selector).siblings("input").remove();
    var newInput = $("<input type='number' min='0' step='0.25' value='1'/>");      
    $(selector).closest(".input-container").prepend(newInput);      
  }

  if (valSel == "px") {
    $(selector).siblings("input").remove();
    var newInput = $("<input type='number' min='0' step='5' value='50'/>");      
    $(selector).closest(".input-container").prepend(newInput);      
  }

  if (valSel == "em") {
    $(selector).siblings("input").remove();
    var newInput = $("<input type='number' min='0' step='1' value='4'/>");      
    $(selector).closest(".input-container").prepend(newInput);      
  }    

  if (valSel == "%") {
    $(selector).siblings("input").remove();
    var newInput = $("<input type='number' min='0' step='5' value='10'/>");      
    $(selector).closest(".input-container").prepend(newInput);      
  }    
}


function resetEverything(){

  setCurrentArea("grid-container", "reset");
  syncInputVals(".input-cols", "#input-add-column-text");
  syncInputVals(".input-rows", "#input-add-row-text");
  $('.saved-area').remove();

}

$(document).ready(function() {

  // If there is no saved layout, use reset as default
  if ($.isEmptyObject(currentLayoutJson)) {
    resetEverything();
  } else { 
    setCurrentArea("grid-container");  
    updateInputVals(); 
  }

  // Show/hide grid coordinates
  $(document).on('change','input#show-coords',function () { $('#grid-container-areas').toggleClass("hidden-coords"); });

if($('input#show-coords').is(':checked')) {
  $('#grid-container-areas').addClass("hidden-coords");
}

  // Add columns or rows
  $(document).on('click', '#add-column', function() { 
    $(".input-cols").append(inputContainer); 
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-cols", subGrid); 
    updateInputVals(subGrid);
    
  });
  $(document).on('click', '#add-row', function(e) { 
    $(".input-rows").append(inputContainer); 
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-rows", subGrid); 
    updateInputVals(subGrid);

  });

  // Click on section to set adding area
  $(document).on('click','[data-name] > section',function (e) {

    // Reset areaColors if there are no more colors left
    if (areaColors.length === 0) { areaColors = ["rgba(230, 25, 75, 1)","rgba(60, 180, 75, 1)","rgba(245, 130, 48, 1)","rgba(240, 50, 230, 1)","rgba(0, 128, 128, 1)"]; }

    var startCell = $("section");
    if (startCell.hasClass("start-cell")) {
      $("section").removeClass("end-cell");          
      $(this).addClass("end-cell");      
    } else {
      $(this).addClass("start-cell");
      var randomColor = areaColors[Math.floor(Math.random() * areaColors.length)];  
      areaColors = jQuery.grep(areaColors, function(value) { return value != randomColor; });

      $(this).attr("data-color", randomColor);            
    }

    var currentreColor = $("section.start-cell").data("color"); 
    var reColor = "2px solid "+currentreColor;

    var areaName = $('.saved-area.adding #area-name').val();
    
    var areaParentName = $(this).parent("section").attr("data-name");
    //$('.saved-area.adding').remove();

    generateArea("adding", areaParentName);
    var gridAreaName = document.querySelector(".saved-area.adding").style.gridArea;
    $("section.adding").attr("data-name", areaName); 

    $(".saved-area.adding").css("border", reColor);

    $(".saved-area.adding > div").append(addAreaContainer);
    $(".saved-area.adding #area-name").val(areaName);

    $(".saved-area.adding > div").append("<button class='remove-area' id='multi-btn'><svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '/></svg></button><i></i>");
    //$(".saved-area.adding .remove-area").css("background", currentreColor);
    //$(".saved-area.adding .subgrid-area").css("background", currentreColor);
    //$(".saved-area.adding #add-area").css("background", currentreColor);

    $('#add-area-container').addClass('active');

    $('#area-name').focus();
    if($('#area-name').val() && !currentLayoutJson.hasOwnProperty(subGrid)) { $("#add-area").prop("disabled", false); }

    e.stopPropagation();
  });

  // Update grid after Select change
  $(document).on('change','.input-rows select',function () { 
    selectChange($(this));
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-rows", subGrid);         
    updateInputVals(subGrid);

  });

  $(document).on('change','.input-cols select',function () { 
    selectChange($(this));
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-cols", subGrid);     
    updateInputVals(subGrid);

  });

  $(document).on('change','.input-gaps select',function () { 
    updateInput(".input-gaps"); 
  });  

  // Update grid after input change
  $(document).on('input','.input-gaps input',function () { 
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-gaps", subGrid); 
    updateInputVals(subGrid);

  });

  $(document).on('input','.input-rows input',function () {    
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-rows", subGrid);     
    updateInputVals(subGrid);

  });

  $(document).on('input','.input-cols input',function () {   
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-cols", subGrid);   
    updateInputVals(subGrid);          
  });

  // Typing on the col/row inputs
  $(document).on('input','#input-add-column-text',function (e) { 
    var subGrid = $(".edit-area").attr("data-name");    
    syncInputVals(".input-cols", "#input-add-column-text"); 
    updateInput(".input-cols", subGrid);         

  });
  $(document).on('input','#input-add-row-text',function (e) { 
    var subGrid = $(".edit-area").attr("data-name");    
    syncInputVals(".input-rows", "#input-add-row-text"); 
    updateInput(".input-rows", subGrid);         

  });

  // Typing on the area name
  $(document).on('input','#area-name',function () { 
    var subGrid = $(this).val();
    $("section.adding").attr("data-name", subGrid); 
    $("#add-area").prop("disabled", false); 
    if (currentLayoutJson.hasOwnProperty(subGrid)) { $("#add-area").prop("disabled", true); }     
  });

  $(document).on('click','section .subgrid-area',function (e) { 

    $('.warning-area').html("Editing <span>"+subGrid+"</span>");    
    $('.warning-area').toggleClass("active");
    $('.sidebar').toggleClass("subarea");
    $("[data-name]").removeClass("edit-area");

    $(this).closest("section").toggleClass("edit-area");
    $(this).closest("section").addClass("grid-area");    
    $(this).closest("section").css("display", "grid");

    var target = e.target;
    var parent = target.parentElement;
    var subGrid = parent.dataset.name;    

    setCurrentArea(subGrid);
    updateInputVals(subGrid);
    currentLayoutJson[subGrid].display = "grid";         

    syncInputVals(".input-cols", "#input-add-column-text");
    syncInputVals(".input-rows", "#input-add-row-text");

    $(parent).find(".subgrid-area").addClass("disabled");
    $(parent).find("#multi-btn").addClass("exit-btn").html("<svg viewBox='0 0 20 20' enable-background='new 0 0 20 20'><path d='M3.4 7.1L4.5 18C4.6 18.5 6.8 20 10 20c3.2 0 5.5-1.5 5.5-2l1.1-10.9C14.9 8.1 12.4 8.5 10 8.5 7.6 8.5 5.1 8.1 3.4 7.1zM13.2 1.5l-0.9-1C12 0.1 11.6 0 10.9 0H9.1c-0.7 0-1.1 0.1-1.4 0.6L6.8 1.5C4.3 2 2.4 3.2 2.4 4v0.2C2.4 5.7 5.8 7 10 7c4.2 0 7.6-1.3 7.6-2.8v-0.2C17.6 3.2 15.7 2 13.2 1.5zM12.1 4.3L11 3H9L7.9 4.3h-1.7c0 0 1.9-2.2 2.1-2.5C8.5 1.6 8.7 1.5 9 1.5h2c0.3 0 0.4 0.1 0.6 0.3C11.9 2.1 13.8 4.3 13.8 4.3H12.1z'></path></svg>");
    $(parent).find("#multi-btn").removeClass("remove-area");

    e.stopPropagation();    
  });

 $(document).on('click','.exit-btn',function (e) { 
    var subGrid = $(this).closest("section").attr("data-name");    

    $("[data-name='"+subGrid+"']").css("display", "block");
    $("[data-name='"+subGrid+"']").css("grid-template-columns", "");
    $("[data-name='"+subGrid+"']").css("grid-template-rows", "");
    $("[data-name='"+subGrid+"']").css("grid-gap", "");

    currentLayoutJson[subGrid].display = "block"; 
    currentLayoutJson[subGrid].current_rows = "1fr 1fr"; 
    currentLayoutJson[subGrid].current_cols = "1fr 1fr"; 

    $(".subgrid-area").removeClass("disabled");
    $(".remove-area").removeClass("disabled");
    $('.warning-area').removeClass("active");
    $('.sidebar').removeClass("subarea");
    $("[data-name='"+subGrid+"']").removeClass("grid-area");
    $('[data-name]').removeClass("edit-area");
    $(".grid-container").addClass("edit-area");

    var childAreas = $("[data-name='"+subGrid+"']").find(".saved-area")

    for (i = 0; i < childAreas.length; ++i) { 
      var dataNameChild = childAreas[i].dataset.name; 
      delete currentLayoutJson[dataNameChild]; 
    }


    $("[data-name='"+subGrid+"']").find(".saved-area").remove();


    //delete currentLayoutJson[dataName];


$(this).removeClass("exit-btn");  
$(this).addClass("remove-area");  
$(this).html("<svg version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'><polygon points='512 120.9 391.1 0 256 135.1 120.9 0 0 120.9 135.1 256 0 391.1 120.9 512 256 376.9 391.1 512 512 391.1 376.9 256 '></polygon></svg>");  



    setCurrentArea(subGrid)
    updateInputVals("grid-container");
    
    syncInputVals(".input-cols", "#input-add-column-text");
    syncInputVals(".input-rows", "#input-add-row-text");

    e.stopPropagation();    
  });

  $(document).on('click','section.edit-area i',function (e) { 
    var subGrid = $(this).closest("section").attr("data-name")    
    $(".adding").remove();

    $(".subgrid-area").removeClass("disabled");
    $(".remove-area").removeClass("disabled");
    $('.warning-area').removeClass("active");
    $('.sidebar').removeClass("subarea");

    $('[data-name]').removeClass("edit-area");
    $(".grid-container").addClass("edit-area");

    setCurrentArea(subGrid)
    updateInputVals("grid-container");
    
    syncInputVals(".input-cols", "#input-add-column-text");
    syncInputVals(".input-rows", "#input-add-row-text");

    e.stopPropagation();    
  });

  // Remove adding areas
  $(document).on('click','section.adding .remove-area',function (e) { 

    $(".subgrid-area").removeClass("disabled");
    $(".remove-area").removeClass("disabled");
    $(this).closest("section").remove(); 
    $("section.start-cell").attr("data-color", "");     
    $('section').removeClass("start-cell");
    $('section').removeClass("end-cell");  
    $(addAreaContainer).remove();
    $('#add-area-container').removeClass('active');  
    $('[data-name]').removeClass("edit-area");
    $(".grid-container").addClass("edit-area");

    e.stopPropagation();    
  });

  // Remove saved areas
  $(document).on('click','section.edit-area .remove-area',function (e) { 
    
    var dataName = $(this).closest("section").data("name");

    var parentName = $(this).closest("section").parent("section").data("name");
    var reindex = currentLayoutJson[dataName].current_areas;

    delete currentLayoutJson[dataName];

    var divs = $(this).siblings("section.saved-area");
    for (i = 0; i < divs.length; ++i) { var dataNameChild = divs[i].dataset.name; delete currentLayoutJson[dataNameChild]; }

    if (parentName) {
      var reloop = currentLayoutJson[parentName].current_areas;
      for (i = 0; i < reloop.length; ++i) { if (reloop[i].name == dataName) { reloop[i] = {}; } }
    }

    $("section.start-cell").attr("data-color", ""); 
    $(this).closest("section").remove(); 
    $('[data-name]').removeClass("edit-area");
    $(".grid-container").addClass("edit-area");
  
    e.stopPropagation(); 
  });

  // Remove items
  $(document).on('click','.input-cols .remove-item',function (e) { 
    $(this).closest('.input-container').remove();
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-cols", subGrid);           
      updateInputVals(subGrid);

    e.stopPropagation();    
   });

  $(document).on('click','.input-rows .remove-item',function (e) { 
    $(this).closest('.input-container').remove();   
    var subGrid = $(".edit-area").attr("data-name");
    updateInput(".input-rows", subGrid);                
    updateInputVals(subGrid);

    e.stopPropagation();    
   });  

  // Save area on enter
  $('#area-name').bind("enterKey",function(e){});
  $(document).on('keyup','#area-name',function (e) { 
    var subGrid = $(".adding").attr("data-name");    
    if(e.keyCode == 13 && !currentLayoutJson.hasOwnProperty(subGrid)) { $(this).trigger("enterKey"); } 
  });
  $(document).on('click enterKey','#add-area, #area-name',function (e) { 
    var subGrid = $(".adding").attr("data-name");
    var parentName = $(this).closest("section").parent("section").data("name");

    $("section").removeClass("edit-area");
    $("section.grid-container").addClass("edit-area");
  var reAddedItems = $("[data-name='"+parentName+"']").children(".saved-area");

    if (currentLayoutJson.hasOwnProperty(subGrid)) { 
    } else {     
      currentLayoutJson[subGrid] = {
        current_gap: "1px", 
        current_rows: "1fr 1fr", 
        current_cols: "1fr 1fr", 
        display: "block",         
        current_areas: []
      };  
    }

    saveSelectedArea(subGrid)  

    updateInputVals("grid-container");
    
    syncInputVals(".input-cols", "#input-add-column-text");
    syncInputVals(".input-rows", "#input-add-row-text");
    generateTemplateAreas(parentName, reAddedItems)
        $('.sidebar').removeClass("subarea");
    $('.warning-area').removeClass("active");

    e.stopPropagation();
  }); 

  // Always focus on name input
  $(document).on('click','section.adding',function () { $('#area-name').focus(); });

  // Show or hide manual inputs
  $('#code-col, #code-row').on('click', function() { $(this).siblings("input").toggleClass("active"); });

  $(document).on('click', '#clear', function(e){
    resetEverything();
    //handleSaveLayout();
  });

  //handleSaveLayout();

  // setInterval(function() {
  //   handleSaveLayout();
  // }, timerSave);

});

function handleSaveLayout(){
  downloadLayoutSrc();
  saveLayout();
}

$(document).ready(function() {
  // Mobile sidebar
  $('#sidebar-mobile').on('click', function() { $(this).toggleClass('active'); $('.sidebar').toggleClass('active'); $('.sidebar-backdrop').toggleClass('active'); });
  $('.sidebar-backdrop').on('click', function() { $('.sidebar').removeClass('active'); $('#sidebar-mobile').removeClass('active'); $(this).removeClass('active'); });  
  $('#toggle-nav').on('click', function() { $('.mobile-nav').toggleClass('active'); })
});

function getJsonCode(){
  var currentGap = document.getElementById('grid-container-areas').style.gridGap;       
  if (!currentGap) { currentGap = document.getElementById('grid-container-areas').style.gap; }     
  var currentRows = document.getElementById('grid-container-areas').style.gridTemplateRows;
  var currentCols = document.getElementById('grid-container-areas').style.gridTemplateColumns; 
  var currentAreas = [] 

  var divs = document.querySelectorAll('section[data-name]');

  for (i = 0; i < divs.length; ++i) {
    var savedArea = divs[i].getAttribute('data-name');
    var savedAreaColor = divs[i].style.background;   
    var currentArea = divs[i].style.gridArea; 
    currentAreas.push({ name: savedArea, area: currentArea, color: savedAreaColor }); 
  }

  return {
    current_gap: currentGap,
    current_rows: currentRows,
    current_cols: currentCols,
    current_areas: currentAreas
  };
}

function getCssCode() {
  var currentGap = document.getElementById('grid-container-areas').style.gridGap;       
  if (!currentGap) { currentGap = document.getElementById('grid-container-areas').style.gap; }
  var currentRows = document.getElementById('grid-container-areas').style.gridTemplateRows;
  var currentCols = document.getElementById('grid-container-areas').style.gridTemplateColumns; 
  var currentAreas = document.getElementById('grid-container-areas').style.gridTemplateAreas;   

  var numRowArr = [currentRows.split(/(?!\(.*)\s(?![^(]*?\))/g)];

  var numColArr = [currentCols.split(/(?!\(.*)\s(?![^(]*?\))/g)];
  var colNumberMinus = numColArr[0].length;
  var colNumber = numColArr[0].length + 1;
  var rowNumberMinus = numRowArr[0].length;

  var exportedCss = "";
  
  //exportedCss = ".grid-container {\n    display: grid;\n    grid-template-columns: " + currentCols + ";\n    grid-template-rows: " + currentRows + ";\n    grid-gap: " + currentGap + ";\n}\n\n"; 
  


    var divs = document.querySelectorAll('section[data-name]');

    for (i = 0; i < divs.length; ++i) {
      if (!divs[i].dataset.name == "") {
        var savedArea = divs[i].getAttribute('data-name');
        var savedAreaParent = $("[data-name='"+savedArea+"']").parent("section").attr("data-name");
        var currentArea = divs[i].style.gridArea; 

        if (savedAreaParent) {
          var reCurrentAreas = [document.querySelector("[data-name='"+savedAreaParent+"']").style.gridTemplateAreas];
          if (_.includes(reCurrentAreas[0], savedArea)) { currentArea = savedArea;  }
        }

        var currentDisplay = divs[i].style.display;       
        if (!currentDisplay) { currentDisplay = currentLayoutJson[savedArea].display; }
        var currentRows = divs[i].style.gridTemplateRows;
        var currentCols = divs[i].style.gridTemplateColumns; 
        var currentAreas = divs[i].style.gridTemplateAreas;        
        if (currentArea && currentDisplay == "grid") {
          exportedCss += "." + savedArea + " {\n  display: grid;\n  grid-area: " + currentArea + ";\n  grid-template-columns: " + currentCols + ";\n  grid-template-rows: " + currentRows + ";\n  grid-template-areas: " + currentAreas + ";\n}\n\n";    

        } 
        if (currentArea && currentDisplay == "block") {
          exportedCss += "." + savedArea + " {\n  grid-area: " + currentArea + ";\n}\n\n";
        }
        if (!currentArea && currentDisplay == "grid") {
          exportedCss += "." + savedArea + " {\n  display: grid;\n  height: 100%;\n  grid-template-columns: " + currentCols + ";\n  grid-template-rows: " + currentRows + ";\n  grid-template-areas: " + currentAreas + ";\n}\n\n";
        } 
      }
    }


  if ($('input#IEsupport').is(':checked')) {

    exportedCss += "@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n"; 

    var divs = document.querySelectorAll('section[data-name]');

    for (i = 0; i < divs.length; ++i) {
      var savedArea = divs[i].getAttribute('data-name');
      var currentStartRow = divs[i].style.gridRowStart; 
      var currentEndRow = divs[i].style.gridRowEnd;      
      var currentEndRow = currentEndRow - currentStartRow;

      var currentRows = divs[i].style.gridTemplateRows;
      var currentCols = divs[i].style.gridTemplateColumns; 
      var currentStartCol = divs[i].style.gridColumnStart; 
      var currentEndCol = divs[i].style.gridColumnEnd;
      var currentEndCol = currentEndCol - currentStartCol;
      var currentAreas = divs[i].style.gridTemplateAreas;        
      var currentArea = divs[i].style.gridArea; 
      var currentDisplay = divs[i].style.display;       
      if (!currentDisplay) { currentDisplay = currentLayoutJson[savedArea].display; }

      if (currentArea && currentDisplay == "grid") {
      exportedCss += '\n  .' + savedArea + ' {\n    display: -ms-grid;\n    -ms-grid-columns: ' + currentCols + ';\n    -ms-grid-rows: ' + currentRows + ';\n    -ms-grid-row: ' + currentStartRow + ';\n    -ms-grid-row-span: ' + currentEndRow + ';\n    -ms-grid-column: ' + currentStartCol + ';\n    -ms-grid-column-span: ' + currentEndCol + ';\n  }\n';

      } 
      if (currentArea && currentDisplay == "block") {
      exportedCss += '\n  .' + savedArea + ' {\n    -ms-grid-row: ' + currentStartRow + ';\n    -ms-grid-row-span: ' + currentEndRow + ';\n    -ms-grid-column: ' + currentStartCol + ';\n    -ms-grid-column-span: ' + currentEndCol + ';\n  }\n';
      }
      if (!currentArea && currentDisplay == "grid") {
      exportedCss += '\n  .' + savedArea + ' {\n    display: -ms-grid;\n    -ms-grid-columns: ' + currentCols + ';\n    -ms-grid-rows: ' + currentRows + ';\n  }\n';
      } 


    }

    exportedCss += "\n}"; 

  }

  return exportedCss;
}

function getHtmlCode() {

  var exportedHt = $(".grid-container").clone();
  $(exportedHt).addClass("output");
  $(exportedHt).find("section").not(".saved-area").remove();
  $(exportedHt).find(".adding").remove();
  $(exportedHt).find(".subgrid-area").remove();
  $(exportedHt).find(".remove-area").remove();
  $(exportedHt).find("i").remove();
  $(exportedHt).find("div").remove();
  $(exportedHt).find("button").remove();

  $(exportedHt).find(".saved-area").removeAttr("style");
  $(exportedHt).find(".saved-area").removeAttr("data-name");
  $(exportedHt).find(".saved-area").removeClass("saved-area");
  $(exportedHt).find(".grid-area").removeClass("grid-area");

  var exportedHtml = '<div class="grid-container">';
  exportedHtml += $(exportedHt).html();
  exportedHtml += '</div>';
  exportedHtml = exportedHtml.replace(/section/g, 'div');

  return exportedHtml;
}

$(document).ready(function() {
  /* fin drageable sortable  */
  $('body').on('click', '#button-download-modal', function(e){
    e.preventDefault();
    downloadLayoutSrc();
  });

  $('body').on('click', '#download', function(){
    downloadLayout();
    return false;
  });

  $('body').on('click', '#downloadhtml', function(){
    downloadHtmlLayout();
    return false;
  });

  $('#edit').click(function(){
    $('body').removeClass('devpreview sourcepreview');
    $('body').addClass('edit');
    
    removeMenuClasses();
    
    $(this).addClass('active');

    return false;
  });

  $('#sourcepreview').click(function(){
    $('body').removeClass('edit');
    $('body').addClass('devpreview sourcepreview');
    removeMenuClasses();
    $(this).addClass('active');
    return false;
  });

  $(document).on('hidden.bs.modal', function (e) {
      $(e.target).removeData('bs.modal');
  });

  $('body').on('click', '#continue-share-non-logged', function () {
     $('#share-not-logged').hide();
     $('#share-logged').removeClass('hide');
     $('#share-logged').show();
  });

  $('body').on('click', '#continue-download-non-logged', function () {
     $('#download-not-logged').hide();
     $('#download').removeClass('hide');
     $('#download').show();
     $('#downloadhtml').removeClass('hide');
     $('#downloadhtml').show();
     $('#download-logged').removeClass('hide');
     $('#download-logged').show();
  });

  $('.btn-hire-header-builder').click(function(){
    ga('send', 'event', 'hire', 'builder-header');
  });

  $('body').on('click', '[data-toggle="modal"]', function(){
      $($(this).data("target")+' .modal-content').load($(this).attr('href'));
    });
  
  $('.nav-header').click(function(){
    $('.sidebar-nav .boxes, .sidebar-nav .rows').hide();
    $(this).next().slideDown(); 
  });
});

function randomNumber(){
  return randomFromInterval(1,1000000);
}

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
function clearDemo() {
  $('.demo').empty();
}
function removeMenuClasses(){
  $('#menu-layoutit li button').removeClass('active');
}

function changeStructure(oldClass, newClass) {
  $('#download-layout .'+oldClass).removeClass(oldClass).addClass(newClass);
}

function cleanHtml(elm) {
  $(elm).parent().append($(elm).children().html());
}

function downloadLayoutSrc() {
  var src = '';

  var downloadHtmlContent = getHtmlCode();
  var downloadCssContent = getCssCode();
  var downloadJsonContent = getJsonCode();

  formatHtmlSrc = $.htmlClean(downloadHtmlContent, {
    format:true,
    allowedAttributes:[
      ['id'], ["class"], ['data-area']
    ] 
  });
  formatHtmlSrc = formatHtmlSrc.replace(/\t/g, '  ');

  $('#download-layout').html(formatHtmlSrc);
  $('#download-layout-css').html(downloadCssContent);
  $('#download-layout-json').html(JSON.stringify(downloadJsonContent));

  $('.downloadModal #css-textarea').empty();
  $('.downloadModal #css-textarea').text(downloadCssContent);

  $('.downloadModal #html-textarea').empty();
  $('.downloadModal #html-textarea').text(formatHtmlSrc);


  downloadHtmlContentQt = downloadHtmlContent.replace(/"/g, '\'');  
  downloadCssContentQt = downloadCssContent.replace(/"/g, '\'');  


  var codepenString = '{"title": "New Pen!", "html": "'+downloadHtmlContentQt+'", "css": "html, body { margin: 0; height: 100% } .grid-container * { border: 1px solid #ccc; }.grid-container div:after { content: attr(class); color: #888; display: flex; justify-content: center; align-items: center; height: 100%; font-family: arial;}'+downloadCssContentQt+'"}';
  //codepenString = codepenString.replace(/\n/g, '');  
  //codepenString = codepenString.replace(/  /g, '');  

  $('#codepenData').val(codepenString);

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

}
