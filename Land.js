// This is the Sentinel-2 collection (all the possible available Sentinel 2 imagery)
var S2_collection = ee.ImageCollection("COPERNICUS/S2")
.filterDate('2020-01-01','2020-01-30')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
.filterBounds(geometry)
.median();
var visParamsTrue={bands: ['B4','B3','B2'], min: 0, max: 5000,gamma:1.1};
Map.addLayer(S2_collection.clip(geometry),visParamsTrue,'sentinel-2020');
Map.centerObject(geometry,8);
//Create Training Data
var training=water.merge(forest).merge(barren).merge(urban);
print(training);
var label='Class'
var bands=['B2','B3','B4','B8'];
var input=S2_collection.select(bands);

var trainImage=input.sampleRegions({
  collection: training,
  properties: [label],
  scale:30
});
 var trainingData=trainImage.randomColumn();
 var trainSet=trainingData.filter(ee.Filter.lessThan('random',0.8));
 var testSet=trainingData.filter(ee.Filter.greaterThanOrEquals('random',0.8));
 
 var classifier=ee.Classifier.smileCart().train(trainSet,label,bands);
 var classifier1=ee.Classifier.smileNaiveBayes().train(trainSet,label,bands);
 var classifier2=ee.Classifier.libsvm().train(trainSet,label,bands);
 //var classifier3=ee.Classifier.smileRandomForest().train(trainSet,label,bands);
 var classified=input.classify(classifier);
 var classified1=input.classify(classifier1);
 var classified2=input.classify(classifier2);
 
 var landcoverpallete=[
   '253494',//water (0)
   '006837',//forest(1)
   '#FFFF00',//barren(2)
   '#FF00FF',//urban(3)
   ];
   Map.addLayer(classified.clip(geometry),{palette:landcoverpallete, min:0,max:4},'Classification CART');
   Map.addLayer(classified1.clip(geometry),{palette:landcoverpallete, min:0,max:4},'NaiveBayes');
   Map.addLayer(classified2.clip(geometry),{palette:landcoverpallete, min:0,max:4},'SVM');
   // accuracy assessment
   var confusionMatrix=ee.ConfusionMatrix(testSet.classify(classifier)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix1=ee.ConfusionMatrix(testSet.classify(classifier1)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix2=ee.ConfusionMatrix(testSet.classify(classifier2)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   print('Confusion matrix CART:',confusionMatrix);
   print('Overall Accuracy CART:',confusionMatrix.accuracy());
    print('Confusion matrix NaiveBayes:',confusionMatrix1);
   print('Overall Accuracy NaiveBayes:',confusionMatrix1.accuracy());
   print('Confusion matrix SVM:',confusionMatrix2);
   print('Overall Accuracy SVM:',confusionMatrix2.accuracy());
  // Export.image.toDrive({
  //   image:classified,
  //   description:"Sentinel_2_CART_2018",
  //   scale:10,
  //   region:geometry,
  //   maxPixels:1e13,
  // });
  var S22018_collection = ee.ImageCollection("COPERNICUS/S2")
.filterDate('2018-01-01','2018-01-30')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
.filterBounds(geometry)
.median();
var visParamsTrue={bands: ['B4','B3','B2'], min: 0, max: 5000,gamma:1.1};
Map.addLayer(S22018_collection.clip(geometry),visParamsTrue,'sentinel-2020');
Map.centerObject(geometry,8);
//Create Training Data
var training=water.merge(forest).merge(barren).merge(urban);
print(training);
var label='Class'
var bands=['B2','B3','B4','B8'];
var input=S22018_collection.select(bands);

var trainImage=input.sampleRegions({
  collection: training,
  properties: [label],
  scale:30
});
 var trainingData1=trainImage.randomColumn();
 var trainSet1=trainingData1.filter(ee.Filter.lessThan('random',0.8));
 var testSet1=trainingData1.filter(ee.Filter.greaterThanOrEquals('random',0.8));
 
 var classifier1=ee.Classifier.smileCart().train(trainSet1,label,bands);
 var classifier11=ee.Classifier.smileNaiveBayes().train(trainSet1,label,bands);
 var classifier21=ee.Classifier.libsvm().train(trainSet1,label,bands);
 //var classifier3=ee.Classifier.smileRandomForest().train(trainSet,label,bands);
 var classified1=input.classify(classifier1);
 var classified11=input.classify(classifier11);
 var classified21=input.classify(classifier21);
 
 var landcoverpallete=[
   '253494',//water (0)
   '006837',//forest(1)
   '#FFFF00',//barren(2)
   '#FF00FF',//urban(3)
   ];
   Map.addLayer(classified1.clip(geometry),{palette:landcoverpallete, min:0,max:4},'CART-2018');
   Map.addLayer(classified11.clip(geometry),{palette:landcoverpallete, min:0,max:4},'NaiveBayes-2018');
   Map.addLayer(classified21.clip(geometry),{palette:landcoverpallete, min:0,max:4},'SVM-2018');
   // accuracy assessment
   var confusionMatrix2018=ee.ConfusionMatrix(testSet1.classify(classifier1)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix20181=ee.ConfusionMatrix(testSet1.classify(classifier11)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix20182=ee.ConfusionMatrix(testSet1.classify(classifier21)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   print('Confusion matrix CART:',confusionMatrix2018);
   print('Overall Accuracy 2018-CART:',confusionMatrix2018.accuracy());
    print('Confusion matrix NaiveBayes:',confusionMatrix20181);
   print('Overall Accuracy 2018-naivebayes:',confusionMatrix20181.accuracy());
   print('Confusion matrix: SVM',confusionMatrix20182);
   print('Overall Accuracy 2018-SVM:',confusionMatrix20182.accuracy());
   
   var result=classified2.subtract(classified21);
   Map.addLayer(result.clip(geometry),{palette:landcoverpallete, min:0,max:4},'result');
