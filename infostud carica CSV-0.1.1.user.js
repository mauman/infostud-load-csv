// ==UserScript==
// @name infostud carica CSV
// @namespace http://www.google.com
// @version 0.1.1
// @description  set the status of all students to "rinuncia"
// @match https://stud.infostud.uniroma1.it/Sest/NuovaVerb/*
// @copyright 2021, mauman
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

'use strict';

var $ = window.jQuery;



$(document).ready(function() {
  var ulElement = $("#intestazione ul");
  ulElement.append("<li><input type='file' id='csvFileInput'/><a href='javascript:void(0);' onclick='event.preventDefault(); loadCSV()'>Load CSV</a></li>");
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


function loadCSV() {
  var fileInput = document.getElementById('csvFileInput');
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var csvData = e.target.result;
      processData(csvData);
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
        if (matriculation == Number(cells[3])){
            return cells[4] + " " + cells[5];
        }
    // console.log('Row ' + i + ':', cells);
    }
    return "A //";
}

function processData(csvData) {
  // Assuming CSV parsing logic, you may use a library like PapaParse for better handling
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

    if (student) {
        if (state.type != "hidden"){
            var matriculation = Number(student.textContent.substring(student.textContent.lastIndexOf(" ") + 1))
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
            var date = result.split(" ")[1].split("/");
            day.value = date[0];
            month.value = date[1];
            year.value = date[2];
            check.checked = true;
        }else{
            console.log("skipping ", matriculation);
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
  
  console.log("ciao");

});