// ==UserScript==
// @name infostud carica CSV
// @namespace https://github.com/mauman/infostud-load-csv
// @version 0.1.2
// @description  set the status of all students to "rinuncia"
// @match https://stud.infostud.uniroma1.it/Sest/NuovaVerb/*
// @copyright 2021, mauman
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

'use strict';

var $ = window.jQuery;



$(document).ready(function() {
  var myHTML = "<p><input type='file' id='csvFileInput'/> <a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV(0)'>Load CSV</a></p>";
  myHTML += "<p><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV(1)'>Assign absent (A) students without a date to date:</a> <input type='date' id='examdate' name='examdate'></p>";
  myHTML += "<p><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV(2)'>Assign absent (A) students without a date to today</a></p>";
  myHTML += "<p><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV(3)'>Assign all (present/A/R) students without a date to date:</a> <input type='date' id='examdate' name='examdate'></p>";
  myHTML += "<p><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV(4)'>Assign all (present/A/R) students without a date to today</a></p>";
  $(myHTML).insertAfter("h1:contains('Caricamento esiti')");

  // var ulElement = $("h1:contains('Caricamento esiti')");
  // ulElement.append("<br/><input type='file' id='csvFileInput'/><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV()'>Load CSV</a>");
//   $("select").each(function(index) {
//       //console.log($(this).attr("id"));
//       if($(this).attr("id").substr(0,8) == "selStato") {
//           if($(this).attr("disabled") != "disabled"){
//               // console.log($(this));
//               //$("option").removeAttr("selected")
//               // $("[value=3]").attr('selected', ' ');
//               $(this).children('option:nth-child(1)').removeAttr('selected');
//               $(this).children('option:nth-child(2)').removeAttr('selected');
//               $(this).children('option:nth-child(3)').removeAttr('selected');
//               $(this).children('option:nth-child(4)').removeAttr('selected');
//               $(this).children('option:nth-child(3)').attr('selected', '');
//           }
//           else{
//               //console.log("no")
//           }
//       }
//   });


function loadCSV(mode) {
  var fileInput = document.getElementById('csvFileInput');
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var csvData = e.target.result;
      processData(csvData, mode);
    };

    reader.readAsText(file);
  } else {
    alert('Please select a CSV file.');
  }
}

function getStudentResult(csvData, matriculation) {
    var rows = csvData.split('\n');
    var header = rows[0].split(',');
    for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].replace('\r', '').replace('\n', '').split(',');
    // Process the data as needed
        if (matriculation == Number(cells[0])){
            if (cells[5] != ""){
                return cells[4] + " " + cells[5];
            } else {
                return cells[4] + " //";
            }
        }
    // console.log('Row ' + i + ':', cells);
    }
    console.log("I could not find ", matriculation, "in the csv file");
    return "A //";
}

function processData(csvData, mode) {

  var i;
  for (i = 0; ; i++) {
    var studentId = "tdStud" + i;
    var student = $(studentId);
    var gradeId = "voto" + i;
    var grade = $(gradeId);
    var stateId = "selStato" + i;
    var state = $(stateId);
    var day = $("giorno" + i);
    var month = $("mese" + i);
    var year = $("anno" + i);
    var check = $("Check" + i);
    var date;

    if (student) {
        var matriculation = Number(student.textContent.substring(student.textContent.lastIndexOf(" ") + 1));
        if (state.type != "hidden"){
            var result = getStudentResult(csvData, matriculation);
            if (result[0] != "A" && result[0] != "R"){
                grade.value = result.substring(0, result.lastIndexOf(" "));
                state.value = "1";
            }
            if (result[0] == "A"){
                state.value = "2";
            }
            if (result[0] == "R"){
                state.value = "3";
            }
            var result_date = result.split(" ")[1];
            if (result_date != "//"){
                if (mode == 0){
                    date = result_date.split("/");
                    if (result_date != "//"){
                        day.value = date[0];
                        month.value = date[1];
                        year.value = date[2];
                    }
                }
            } else {
                if (((result[0] == "A") && (mode == 1)) || (mode == 3)){
                    date = $("examdate").value.split("-");
                    day.value = date[2];
                    month.value = date[1];
                    year.value = date[0];
                } else {
                    if (((result[0] == "A") && (mode == 2)) || (mode == 4)){
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                        var yyyy = today.getFullYear();
                        day.value = dd;
                        month.value = mm;
                        year.value = yyyy;
                    }
                }
            }
            
            check.checked = true;
        }else{
            console.log(matriculation, " is already recorded");
        }

    } else {
      // Break the loop if a row with the current ID doesn't exist
      break;
    }
  }
}
  function addDOMScriptNode (funcText, funcSrcUrl, funcToRun) {
  var scriptNode = document.createElement('script');
  scriptNode.type = "text/javascript";

  if (funcText) {
    scriptNode.textContent = funcText;
  } else if (funcSrcUrl) {
    scriptNode.src = funcSrcUrl;
  } else if (funcToRun) {
    scriptNode.textContent = funcToRun.toString();
  }

  var target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(scriptNode);
}

  addDOMScriptNode(null, null, loadCSV);
  addDOMScriptNode(null, null, processData);
  addDOMScriptNode(null, null, getStudentResult);


});
