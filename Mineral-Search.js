//import * as cheerio from '/cheerio';

//result criteria:
//A) minerals discloed
//B) Due diligence partners: orgs. that certify the supply chain as "clean"

//calls current companies to search
//TODO: This should be updated to make:
//          User input-based searches with company names and dates
//          This code should be updated to be a module that can be imported into others code.


//May need to swap lines depending on JS versions...
import * as cheerio from 'cheerio';
//require('dotenv').config();
import dotenv from './package.json' with { type: "json" };
//import cheerio from package.json
import request  from './package.json' with { type: "json" };
import axios from './package.json' with { type: "json" };

//const cheerio = require('cheerio');
//const request = require('request');
//const axios = require('axios');

//const keywords = require('./mineral-keywords.json');
import * as keywords from './mineral-keywords.json' with { type: "json" };
//console.log(keywords.default.auditors)
const auditorList = keywords.default.auditors;
const mineralList = keywords.default.mineralsList;
const tableMineralList = keywords.default.tableMineralsList;
const allMinerals = keywords.default.mineralsString;
const companyList = keywords.default.companies;
let startDateInput = "2023-01-01";
let stopDateInput = "2023-05-31";

//const functions = require('./functions.js');
//const cikList           = keywords.cik;
console.log('found functions')


//var type = 'html'; //or 'html' 'text'
//var token = process.env.SEC_API_KEY;


//var testPostURL = `https://api.sec-api.io/full-text-search?token=${token}`;
//rows is an array of arrays that will be turned into a csv 
//var rowObjects = [];


//--- User input: (TODO) ---//
//TODO: get company name to search
//TODO: get Date specified

//--- Testing results for a specific company and dates: ---
// STARTING WITH JUST A SMALL TIME FRAME
//Dates: "YYYY-MM-DD" format
// Se
//let startDateInput = "2023-01-01";
//let stopDateInput = "2023-05-31";
let ck = 1

//console.log(companyList)
console.log("--- " + companyList.at(ck) + " ---");
import { parseDoc, produceCSV,searchApiCall } from "./functions.js"
//import { produceCSV } from "./functions.js";
//import { searchApiCall } from "./functions.js";

//--- this will be mroe useful once the search api fn loops through multiple searches 
searchApiCall(companyList.at(ck), allMinerals, startDateInput, stopDateInput);












