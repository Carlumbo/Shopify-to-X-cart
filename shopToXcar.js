
var ss = SpreadsheetApp.getActiveSpreadsheet(); 
var impSheet = ss.getSheetByName("Master Import");
let ll = Logger.log;

//adds function option to ui for Google Sheets
   function onOpen() {
     
      if (impSheet === null ) {
        ss.insertSheet().setName('Master Import')
      }
      else if (impSheet !== null) {
      ll("He really does exist")
      }
      else {
      }
  
    SpreadsheetApp.getUi()
    .createMenu('Format Options')
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Shopify')
          .addItem('Full Setup', 'runIt')
          .addItem( 'Copy Line Sheet','copyLineSheet')
          .addItem('Delete Repeated Skus', 'delReps')
          .addItem('Format Skus ', 'adjustCell')
          .addItem('Set Main Price', 'priceSetter')
          .addItem('Fill Down Skus', 'massFillDown')
          .addItem('Set Variant Columns', 'myVar')
          .addItem('Set Import Location', 'vcBuild')
          )
    .addToUi();
  };




//Copys entirety of the line sheet begins renaming
function copyLineSheet() {
var ss = SpreadsheetApp.getActiveSpreadsheet(); 
var lsSheet = ss.getSheets()[0];
var lsCount = lsSheet.getMaxRows();
var lsCount2 = lsSheet.getMaxColumns();
var impCount = impSheet.getMaxRows();
var impCount2= impSheet.getMaxColumns();
var rowCount = lsCount - impCount;
var oddCount = impCount - lsCount;
var colCount = lsCount2 - impCount2;

if (impCount > lsCount) {
 impSheet.deleteRows(lsCount, oddCount)
};

impSheet.appendRow([''])


if (impCount < lsCount){
impSheet.insertRowsAfter(impCount, rowCount +1)
}
impSheet.appendRow(['']);


impSheet.clear();

var oldHeaders = lsSheet.getRange("A1:AT1");
var headerData = oldHeaders.getValues();
var hData= headerData[0];

var i; for (i= 0 ; i < hData.length; ++i) {
 if (hData[i]== "Handle") {
   hData[i]= "sku"
 } else if (hData[i]== "Title") {
   hData[i]= "name"
 } else if (hData[i]== "Body (HTML)") {
   hData[i]= "description"
 } else if(hData[i]== "Option1 Name") {
   hData[i]= "Attribute1"
 } else if (hData[i]== "Option1 Value") {
   hData[i]= "Variant1"
 } else if (hData[i]== "Option2 Name") {
   hData[i]= "Attribute2"
 } else if (hData[i]== "Option2 Value") {
   hData[i]= "Variant2"
 } else if (hData[i]== "Option3 Name") {
   hData[i]= "Attribute3"
 } else if (hData[i]== "Option3 Value") {
   hData[i]= "Variant3"
 } else if (hData[i]== "Variant SKU") {
   hData[i]= "variantSku"
 } else if (hData[i]== "Variant Price") {
   hData[i]= "variantPrice"
 } else if(hData[i]== "Variant Grams") {
   hData[i]= "Weight"
 }  else if (hData[i]== "Image Src") {
   hData[i]= "images"
 }
}


var headerRange = impSheet.getRange("A1:AT1");

headerRange.setValues(headerData).setFontWeight('bold');

var data = lsSheet.getRange('a2:at');
var newData = data.getValues();
var dataRange = impSheet.getRange('a2:at');

dataRange.setValues(newData);

var newValues = impSheet.getRange("a1:at1");
var toDelete = newValues.getValues();
var deleteEm = toDelete[0];

var required = ['sku' , 'name','description' , 'Attribute1' , 'Attribute2' , 'Attribute3' , 'Variant1' , 'Variant2'  , 'Variant3', 'images', 'variantSku' ,'variantPrice' ];

var width = impSheet.getLastColumn();
var headers = impSheet.getRange(1, 1, 1, width).getValues()[0];
for (var i = headers.length - 1; i >= 0; i--) {
 if (required.indexOf(headers[i]) == -1) {
   impSheet.deleteColumn(i+1);
 }
};


impSheet.insertColumnAfter(2)
var thing = impSheet.getRange("c1:c1")
 thing.setValue("price");

 

};
//deletes skus to prep for renaming and drop down
function delReps() {

var rowValues = impSheet.getRange('a2:a').clear


var titleRow = impSheet.getRange('b2:B').getValues()
impSheet.getRange('a2:a').setValues(titleRow)

}

//adjust sku names to fit x-cart system
function adjustCell() { 
var rowValues = impSheet.getRange('a2:a').getValues()

ll(rowValues.length)
var i;for(i=0; i < rowValues.length; i++) {
 rowValues[i][0] = rowValues[i][0].replace(/[^a-zA-Z0-9]/g, '-');
  if (rowValues[i][0].length > 30) {
  
   rowValues[i][0]= rowValues[i][0].substring(0,24)
   rowValues[i][0] = rowValues[i][0] + '-' + i

 } else { 
 }
 
 var newRange = impSheet.getRange('a2:a');
 newRange.setValues(rowValues)
}

}

//formats variant prices to the correct main product
function priceSetter() {  
var prices = impSheet.getRange("L2:L").getValues()

var oldPrice = impSheet.getRange("c2:C")

oldPrice.setValues(prices)

var cell1 = impSheet.getRange("B2:B").getValues()
var cell2 = impSheet.getRange("C2:C").getValues()

let i; for(i=0; i < cell1.length; ++i) {
 if (cell1[i][0]== "") {
   
   cell2[i][0] = ""
   
 }
 let newCells = cell2
 var oldCells = impSheet.getRange("c2:c")
 oldCells.setValues(newCells) 
}

}

//fills down the sku values for their chlld variants

function massFillDown() {
var range = impSheet.getRange(2,1,impSheet.getLastRow()-1,1);
var values = range.getValues();
var current;
for (var i = 0; i < values.length; i++) {
 if (values[i][0] === '' ) {
   values[i][0] = current
 } else {
   current = values[i][0]
 }
} 
range.setValues(values)
}
//Creates Var columns
function myVar() {
let ss = SpreadsheetApp.getActive();
let impSheet = ss.getSheetByName('Master Import')
let varSetup = impSheet.getRange('E2:E').getValues();
let ll = Logger.log

let  unique=[] 
let x; for( x=0; x<varSetup.length; x++) {
  if (unique.indexOf(varSetup[x][0]===-1 && varSetup[x][0] !== '')) {
      unique.push(varSetup[x][0]) }
  
}
let  uniq = [...new Set(unique)]

var filtered = uniq.filter(function (el) {
return el != "";
});

impSheet.insertColumnsAfter(impSheet.getLastColumn(), filtered.length)
let varHeads = []
let y; for (y=0; y < filtered.length ; y++ ) {

 varHeads.push(filtered[y] + " (field:product)")
} 
var oldHeads = impSheet.getRange(1, 14 , 1 , filtered.length)
oldHeads.setValues([varHeads]).getValues()
 
} 
//preps sheet for importing to proper location of import
function vcBuild() {

var cName =  Browser.inputBox('Enter Company Name')  
var catName = Browser.inputBox('Enter Category Name');
var vName =  Browser.inputBox("Vendor Email");


  
  let sName = ss.getName() 
  var n = /products/;
  let y = n.test(sName)
  
  Logger.log(y)
if (y == false ) {

   ss.setName("products " + cName )                               
}

impSheet.insertColumnAfter(3)
var vendorVals = impSheet.getRange(1,4,1,1)
 vendorVals.setValue("vendor")
 
 
impSheet.insertColumnAfter(4)
var catVals = impSheet.getRange(1,5,1,1)
 catVals.setValue("categories")

impSheet.insertColumnAfter(5)
var metaVals = impSheet.getRange(1,6,1,1)
metaVals.setValue("metaTitle")

let valContainer = [];
let wholeSale =  '="Wholesale " & B2 &' + '" | '  + cName + '"';
valContainer.push(vName,cName + " >>> " + catName, wholeSale);

let i; for(i = 0 ; i < valContainer.length; i++) {
 
var valRange =  impSheet.getRange(2,4+i,impSheet.getLastRow()-1,1)
valRange.setValue(valContainer[i])
}

let metaArray = []
var metaCol =  impSheet.getRange(2,6,impSheet.getLastRow()-1,1).getValues()
let x;for(x=0; x < metaCol.length; x++) {
 if (metaCol[x][0] == "Wholesale  " + "| " + cName) {
   metaCol[x][0] = ""
 }
metaArray.push([metaCol[x][0]])
}
var newMeta =  impSheet.getRange(2,6,impSheet.getLastRow()-1,1)
newMeta.setValues(metaArray)

}

//runs as one function
function runIt() { 
      if (impSheet === null ) {
        ss.insertSheet().setName('Master Import')
      }
      else if (impSheet !== null) {
      ll("He really does exist")
      }
      else {
      }
     copyLineSheet()
     ll('copy')
     delReps()
     ll('del')
     adjustCell()
     ll('adjust')
     priceSetter()
     ll('price')
     massFillDown()
     ll('mass')
     myVar()
     ll('myBar')
     vcBuild()
     ('vc')
 
}