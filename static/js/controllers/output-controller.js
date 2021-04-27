angular.module("MyApp").controller("OutputController", OutputController);

function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function OutputController($scope, $log, $location, strainDataFactory, expInfoFactory, indStrainService) {
  $scope.data = strainDataFactory.processedData[0].data.SurvivalOutput;
  $scope.exp = expInfoFactory;

  // added
  console.log("Output Controller")

  var numDays = $scope.exp.days[0].split(",")
  console.log("NUMDAYS")
  console.log(numDays)      //this gives us the needed index to cut off uneeded values
  console.log("SurvivalValues")
  console.log($scope.data.SurvivalValues) //undefined?

  //origional
  var series = [];
  //console.log("scope.data.length")
  //console.log($scope.data.length)
  //this for loop is for graphing data
  for (var i = 0; i < $scope.data.length; i++)     //$scope.data.length is the number of unique strains
  {
    series.push($scope.data[i].SurvivalValues);
  }
  console.log(series);


  //slice data and pray it doesnt break more stuff
  console.log("FOR LOOP")
  for (var i = 0; i < $scope.data.length; i++) {
    //console.log($scope.data[i].SurvivalValues.slice(0,numDays.length))
    $scope.data[i].SurvivalValues = $scope.data[i].SurvivalValues.slice(0, numDays.length)
    //console.log(series[i].slice(0,(numDays.length - 1)))
    //series[i] = series[i].slice(0,(numDays.length))
  }

  //console.log("DATA")
  //console.log($scope.data)
  $scope.displayData = series;
  //$scope.displayData is the array that holds all the strain info for each strain

  // create a download button 
  var s = document.createElement("button");
  s.setAttribute("class", "btn btn-primary btn-lg");
  s.setAttribute("id", "downloadCSV")
  s.setAttribute("type", "button")
  s.setAttribute("ng-click", "");
  s.innerHTML = "Download CSV"

  // Append the download button to the container 
  document.getElementsByClassName("container ng-scope")[0]
    .appendChild(s);

  document.getElementById('downloadCSV').onclick = function () {
    exportToCsv(($scope.exp.researcher[0] + ".csv"), $scope.displayData);

  }

  //exportToCsv("test.csv", $scope.displayData);




  var names = [];
  for (var i = 0; i < $scope.data.length; i++) {
    names.push($scope.data[i].StrainName);
  }
  $scope.series = names;

  console.log(names);

  var dayWords = $scope.exp.days[0].split(",")
  $scope.daysCleaned = [];
  for (var i = 0; i < dayWords.length; i++) {
    $scope.daysCleaned.push(dayWords[i]);
  }

  $scope.generateIndividualPage = function ($index) {
    indStrainService.survivalValues = $scope.data[$index].SurvivalValues;
    indStrainService.strainName = $scope.data[$index].StrainName;
    indStrainService.days = dayWords;
    indStrainService.institution = $scope.exp.institution[0];
    indStrainService.researcher = $scope.exp.researcher[0];
    indStrainService.information = $scope.exp.expInfo[0];

    $log.info(indStrainService.strainName)
    $log.info(indStrainService.survivalValues);

    $location.path("/output/" + indStrainService.strainName);
  }

  // vm.survivalIntegral = _computeSI(vm.timePoints, vm.survivalValues);
  $scope.options =
  {
    scales: {
      yAxes:
        [{
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: { min: 0, max: 100 }
        }]
    },
    elements: {
      line: { tension: 0 }
    },
    legend: {
      display: true,
      position: "top"
    }
  };

}
