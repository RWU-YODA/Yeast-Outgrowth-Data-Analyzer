angular.module("MyApp").controller("StrainDataController",StrainDataController)


//attempt to add download button
function exportToCsv_single(filename, rows, Days) {

  var csvFile = '';
  csvFile += ("," + Days + "\n")
  csvFile += filename + "," 
  csvFile += rows

  filename = filename + ".csv"
  
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
    //console.log(vm.strain)
    //console.log(response.data)
    vm.timePoints = vm.strain.days;
    //console.log(vm.timePoints)
    //console.log(vm.strain.days)
    vm.survivalValues = vm.strain.survivalValues;
    //console.log(vm.survivalValues)
    vm.series = [vm.strain.name];
    //console.log(vm.series)
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

    //console.log("VM")
    //console.log(vm)
    //console.log("VM Data")
    //console.log(vm.survivalValues)
    //console.log(vm.timePoints)
    //console.log(vm.strain.experimentor)


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
      exportToCsv_single(vm.strain.name, vm.survivalValues, vm.timePoints);

  }
}