angular.module("MyApp").controller("StrainDataController",StrainDataController)


//attempt to add download button
function exportToCsv(filename, rows, Days) {
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
    //console.log(processRow(rows[i]))
    csvFile += processRow(rows[i].slice(0, Days.length));
    //csvFile += processRow(rows[i]);
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



function StrainDataController(strainDataFactory, $routeParams){
  vm  = this;

  //  Fetching the id of the specific strain in question
  var id = $routeParams.strainID;

  // Acquiring the data related to this specific yeast strain.
  strainDataFactory.strainDisplay(id).then(function(response){
    // Setting the response to get the strain in question.
    vm.strain = response.data;
    vm.timePoints = vm.strain.days;
    vm.survivalValues = vm.strain.survivalValues;
    vm.series = [vm.strain.name];
    // vm.survivalIntegral = _computeSI(vm.timePoints, vm.survivalValues);
    vm.options =
      {
        scales: {
          yAxes:
              [{
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {min: 0, max: 100}
              }]
          },
          elements: {
              line: {tension: 0}
          }
        };
      });


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
      exportToCsv(($scope.exp.researcher[0] + ".csv"), $scope.displayData, $scope.exp.days[0].split(","));

  }
}