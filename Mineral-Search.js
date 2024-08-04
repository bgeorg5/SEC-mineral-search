//import * as cheerio from '/cheerio';

//result criteria:
//A) minerals discloed
//B) Due diligence partners: orgs. that certify the supply chain as "clean"

//calls current companies to search
//TODO: This should be updated to make:
//          User input-based searches with company names and dates
//          This code should be updated to be a module that can be imported into others code.


//May need to swap lines depending on JS versions...
//import * as cheerio from 'cheerio';
require('dotenv').config();
//import dotenv from package.json
//import cheerio from package.json
//import request  from package.json
//import axios from package.json

const cheerio           = require('cheerio');
const request           = require('request');
const axios             = require('axios');
const keywords          = require('./mineral-keywords.json');
const auditorList       = keywords.auditors;
const mineralList       = keywords.mineralsList;
const tableMineralList  = keywords.tableMineralsList;
const allMinerals       = keywords.mineralsString;
const companyList       = keywords.companies;
//const cikList           = keywords.cik;


var type            = 'html'; //or 'html' 'text'
var token           = process.env.SEC_API_KEY;


var testPostURL     = `https://api.sec-api.io/full-text-search?token=${token}`;




//--- User input: (TODO) ---//
//TODO: get company name to search
//TODO: get Date specified

//Dates: "YYYY-MM-DD" format
let startDateInput = "2005-01-01";
let stopDateInput = "2024-07-31";



//--- Testing results for a specific company and dates: ---
console.log("--- "+companyList.at(2)+" ---");
searchApiCall(companyList.at(2)+allMinerals, startDateInput, stopDateInput);




//--- Searches SEC EDGAR results using Api to obtain relevant filings ---
function searchApiCall(searchString, startDateString, stopDateString) {
    console.log(searchString)

    axios.post(testPostURL,   {
        "query": searchString,        //Ex: "tesla, lithium",
        //"cik": "0001318605",        
        "formTypes": "SD",
        "startDate": startDateString,    //Ex: "2024-01-01",
        "endDate": stopDateString       //Ex: "2024-07-25"
         }).then(function (response) {

            //check if results exist
            if(response.data.filings.length == 0){
                console.error('There are no Results from this search.');
            }
            else{

                //results by filings (list)
                postRes = response.data.filings;
                //List of specific filing URLS (to be filled)
                var urlList = [];

                //testing
                //console.log(postRes[0].cik);
                console.log('thisis the lenght of postres')
                console.log(postRes.length);
 
                for(let i = 0; i < postRes.length; i++)
                {
                    //testing
                    //console.log('index = '+i);
                    //console.log(postRes[i]);
                    urlList.push(String(postRes[i].filingUrl));
                }
                console.log('url list:')
                console.log(urlList);             
                    let element = urlList[4];
                    //testing
                    console.log('this is ELEMENT')
                    console.log(element);
    
                     
                    let idurl = element.replace("https://www.sec.gov/Archives/edgar/data/", "");
                    //testing
                    //console.log(idurl);
    
                    let testGetURL      = `https://archive.sec-api.io/${idurl}?token=${token}&type=${type}`;
    
                    console.log(testGetURL)
                     axios.get(testGetURL)
                     .then(({ data }) => {
                         
                        //testing
                        //console.log('------------------this is the data---------------------------')
                        //console.log(data)
                        //console.log('------------------ END data---------------------------')
                         
                         //parse each word of this doc to get the known auditors and minerls used.
                         var knownAuditors = parseDoc(data, auditorList);
                         var knownMinerals = parseDoc(data, mineralList);
                         var knownTableMinerals = parseDoc(data, tableMineralList);
                         
                         console.log("  Known Auditors:");
                         knownAuditors.forEach(element => {
                             console.log("      "+element);
                         });
    
                         console.log("  Known Minerals:");
                         knownMinerals.forEach(element => {
                            console.log("       "+element);
                        });

                         console.log(" Smelter Table Known Minerals:");
                         knownTableMinerals.forEach(element => {
                            console.log("       "+element);
                        });
                         
                 });
    
                //save data to return
            }
        

        });
       

}

//--- Parses individual filing for our search terms ---
//TODO: change to non-linear search
function parseDoc(docFullText, keywordList){

    var knownList = [];

    for(let i = 0; i < keywordList.length; i++){

        //testing
        //console.log(i);

        //'/.../i' Specifies case insensitive search
        if(docFullText.search(keywordList[i], '/.../i') != -1){
            //testing
            //console.log("   "+keywordList[i]);
            knownList.push(keywordList[i]);
        }

    }

    return knownList;

}

