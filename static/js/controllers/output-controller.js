angular.module("MyApp").controller("OutputController", OutputController);

function OutputController($scope, $log, $location, strainDataFactory, expInfoFactory, indStrainService){
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
  for(var i = 0; i < $scope.data.length; i++)     //$scope.data.length is the number of unique strains
  {
    series.push($scope.data[i].SurvivalValues);
  }
  console.log(series);
  

  //slice data and pray it doesnt break more stuff
  console.log("FOR LOOP")
  for (var i = 0; i < $scope.data.length; i++) {
    //console.log($scope.data[i].SurvivalValues.slice(0,numDays.length))
    $scope.data[i].SurvivalValues = $scope.data[i].SurvivalValues.slice(0,numDays.length)
    //console.log(series[i].slice(0,(numDays.length - 1)))
    //series[i] = series[i].slice(0,(numDays.length))
  }

  //console.log("DATA")
  //console.log($scope.data)
  $scope.displayData = series;                    //$scope.displayData is the array that holds all the strain info for each strain

  //console.log("scope.displayData")
  //console.log($scope.displayData)


  var names = [];
  for(var i = 0; i < $scope.data.length; i++)
  {
    names.push($scope.data[i].StrainName);
  }
  $scope.series = names;
  console.log(names);

  var dayWords = $scope.exp.days[0].split(",")
  $scope.daysCleaned = [];
  for(var i = 0; i < dayWords.length; i++){
    $scope.daysCleaned.push(dayWords[i]);
  }

  $scope.generateIndividualPage = function($index){
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
            ticks: {min: 0, max: 100}
          }]
      },
      elements: {
          line: {tension: 0}
      },
      legend : {
        display: true,
        position: "top"
      }
    };

}
