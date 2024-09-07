import pandas as pd
import numpy as np
#from keydoc_2 import * ## replacing this with the following to runin github workflows

import os 
key = os.environ["key"]

# to get filings
from sec_api import FullTextSearchApi
fullTextSearchApi = FullTextSearchApi(api_key=key)

#getting the actual text document 
from sec_api import RenderApi
ra = RenderApi(api_key=key)

# ParseDoc
csvData = {
  "companyName": [],
  "filingDate": [],
  "tableMineralArray": [],
  #"mineralsArray": [],
  "auditors": [],
  "filingUrl": [],
  "cik": [],
  "accessionNo" :[]
}

def searchApiCall(params,csvData,metalKeywords,auditKeywords):
  response = fullTextSearchApi.get_filings(params)
  filings = response["filings"] 
  cf = parseDoc(filings,csvData,metalKeywords,auditKeywords)
  return cf

def parseDoc(filings,csvData,metalKeywords,auditKeywords):
  for i in filings:
    print(i["companyNameLong"])
    ##if 'tesla' in i["companyNameLong"].lower(): ## Optional
    tempMetalList = []
    tempAuditorList = []
    
    test_url = i["filingUrl"]
    doc_html = ra.get_filing(test_url)

    ## parse doc for the metals
    for k in metalKeywords:
      metalresult = doc_html.lower().find(k.lower()) 
      if metalresult > 0: 
        tempMetalList.append(k.replace('>', "").replace('<', ""))

    ## parse doc for the auditors
    for a in auditKeywords:
      auditresult = doc_html.lower().find(a.lower()) 
      if auditresult > 0: 
        tempAuditorList.append(a)

    ## Add everything to the dictionary
    if len(tempMetalList) < 1: 
      csvData["tableMineralArray"].append(['no table metals found'])
    else:
      csvData["tableMineralArray"].append(tempMetalList)

    if len(tempAuditorList) < 1: 
      csvData["auditors"].append(['no auditors found'])
    else:
      csvData["auditors"].append(tempAuditorList)

    csvData["companyName"].append(i["companyNameLong"])
    csvData["filingDate"].append(i["filedAt"])
    csvData["filingUrl"].append(i["filingUrl"])
    csvData["cik"].append(i["cik"])
    csvData["accessionNo"].append(i["accessionNo"])

  tab = pd.DataFrame(data=csvData)
  return tab

#csvData