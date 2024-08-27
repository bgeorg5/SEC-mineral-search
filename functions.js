//--- Searches SEC EDGAR results using Api to obtain relevant filings ---
//--- editing this to put results into a csv instead
// changed the parameters of this function to allow for easy access of company name later on
import * as fs from 'fs';
import convertArrayToCSV from 'convert-array-to-csv'; //from './package.json' with { type: "json" };
console.log(convertArrayToCSV)
import * as keywords from './mineral-keywords.json' with { type: "json" };
import * as cheerio from 'cheerio';
//require('dotenv').config();
import dotenv from './package.json' with { type: "json" };
//import cheerio from package.json
import request from './package.json' with { type: "json" };
import axios from "axios";
//import  axios from './package.json' with { type: "json" };
const auditorList = keywords.auditors;
const mineralList = keywords.mineralsList;
const tableMineralList = keywords.tableMineralsList;
const allMinerals = keywords.mineralsString;
const companyList = keywords.companies;
//const fs = require('fs');
//const { convertArrayToCSV } = require('convert-array-to-csv');
var type = 'html'; //or 'html' 'text'
const token = process.env.SEC_API_KEY;
console.log(token);


var testPostURL = `https://api.sec-api.io/full-text-search?token=c66678a9d89152e72561cc65177356370a90e7ff6aaf7354535c2c7e95c8515f`;
//${token}
//rows is an array of arrays that will be turned into a csv 
var rowObjects = [];

//--- Parses individual filing for our search terms ---
//TODO: change to non-linear search
export function parseDoc(docFullText, keywordList) {

  var knownList = [];

  for (let i = 0; i < keywordList.length; i++) {

    //testing
    //console.log(i);

    //'/.../i' Specifies case insensitive search
    if (docFullText.search(keywordList[i], '/.../i') != -1) {
      //testing
      //console.log("   "+keywordList[i]);
      knownList.push(keywordList[i]);
    }

  }

  return knownList;

}

//convert rowobjects to csv and output a file
export function produceCSV(objects) {
  // this will be mroe useful once the search api fn loops through multiple searches 
  var csvFromArrayOfObjects = convertArrayToCSV.convertArrayToCSV(objects);
  console.log("this is csvFromArrayOfObjects")
  console.log(csvFromArrayOfObjects)
  fs.writeFile('output.csv', csvFromArrayOfObjects, err => {
    if (err) {
      console.log(18, err);
    }
    console.log("CSV file saved succesfully!")
  })
}



export function searchApiCall(company, minerals, startDateString, stopDateString) {
  let searchString = company + minerals
  console.log(searchString)

  axios.post(testPostURL, {
    "query": searchString, //Ex: "tesla, lithium",
    //"cik": "0001318605",        
    "formTypes": "SD",
    "startDate": startDateString,    //Ex: "2024-01-01",
    "endDate": stopDateString       //Ex: "2024-07-25"
  }).then(function (response) {
    //check if results exist
    if (response.data.filings.length == 0) {
      console.error('There are no Results from this search.');
    }
    else {
      //results by filings (list)
      var postRes = response.data.filings;
      //List of specific filing URLS (to be filled)
      var urlList = [];
      var filingyearList = [];

      //testing
      //console.log(postRes[0].cik);
      //console.log('thisis the lenght of postres')
      //console.log(postRes.length);

      for (let i = 0; i < postRes.length; i++) {
        //testing
        //console.log('index = '+i);
        //console.log(postRes[i]);
        urlList.push(String(postRes[i].filingUrl));
        filingyearList.push(String(postRes[i].filedAt));
      }
      console.log('url list:')
      console.log(urlList);
      let element = urlList[0];
      let filingYear = filingyearList[0];
      //testing
      //console.log('this is ELEMENT')
      //console.log(element);

      let idurl = element.replace("https://www.sec.gov/Archives/edgar/data/", "");
      //testing
      console.log(idurl);

      let testGetURL = `https://archive.sec-api.io/${idurl}?token=${token}&type=${type}`;

      console.log(testGetURL)
      axios.get(testGetURL)
        .then(({ data }) => {

          // testing
          // console.log('------------------this is the data---------------------------')
          // console.log(data)
          // console.log('------------------ END data---------------------------')

          // parse each word of this doc to get the known auditors and minerls used.
          var knownAuditors = parseDoc(data, auditorList);
          var knownMinerals = parseDoc(data, mineralList);
          var knownTableMinerals = parseDoc(data, tableMineralList);

          // create objeect of all data 
          // single row of table to be made in this order
          rowObjects.push({
            companyName: company,
            filingDate: filingYear,
            tableMineralArray: knownTableMinerals,
            MineralsArray: knownMinerals,
            Auditors: knownAuditors,
            filingUrl: testGetURL
          })

          console.log(rowObjects)
          console.log("  Known Auditors:");
          knownAuditors.forEach(element => {
            console.log("      " + element);
          });

          console.log("  Known Minerals:");
          knownMinerals.forEach(element => {
            console.log("       " + element);
          });

          console.log(" Smelter Table Known Minerals:");
          knownTableMinerals.forEach(element => {
            console.log("       " + element);
          });

        });//hoping this will help 

      //save data to return
      
    }
  });
  setTimeout(console.log, 0,);
}



