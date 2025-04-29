async function myFunction() {
  console.log('starting');
  const fNames = [];
  const folder = DriveApp
  .getFoldersByName('Trust History');
  let data = [];
  while (folder.hasNext()) {
    const file = folder.next().getFiles();
    while (file.hasNext()){
     fNames.push(file.next().getName());
    }
  }
  console.log(`files to process ${[...fNames]}`)  
  for(const processFile of fNames){
    const pFile = DriveApp.getFilesByName(processFile);
    if (pFile.hasNext()){
      data.push({fname: processFile, data: (Uint8Array
      .from(pFile.next().getAs('application/pdf')
          .getBytes()))}); 
   
    }
  }
  
  for (const fileData of data){
    
    let txtArray = await extractText(fileData.data);  // ',1,4); // range is optional
    console.log(`Pages ${txtArray.numPages}`);       // Content ${txtArray.textContent}`)
    let accntArr = [...txtArray.textContent.matchAll(/Account\s+—\s+(?<accnt>\d+)/g)];
    let customRpt = [...txtArray.textContent.matchAll(/Custom([\s\S]*?)\**  Amount /g)];
    let fixDate = txtArray.textContent.replaceAll(/\b(\d\/)/gi, "0$1") // fill dates without leading zeros
    fixDate = fixDate.replaceAll(/Custom([\s\S]*?)\**  Amount /g,'' ); // gets rid of some other stuff
    console.log(accntArr.length);
    console.log(customRpt.length);
    let indexOfTransactions = [...fixDate.matchAll(/(\d+\/\d+\/\d{4}\s+\d+\/\d+\/\d{4}\s+)/g)]
    indexOfTransactions.forEach((item,ptr) =>{
      let endOfSubstr = (ptr < indexOfTransactions.length) ? indexOfTransactions[ptr+1].index-1 :
                        item.input.length-1;
      // stick some code in here for the last page so that the last transaction doesn't grab the Custom report info.
    
      console.log(`${item.input.substring(item.index+12,endOfSubstr)}`)
    }

    )
    // at this point call another function to process the transactions a put them in the spreadsheet.
    // use the code from vTransactor.mjs
    console.log(indexOfTransactions);
   
  }  
  /**
   * /(\d+\/\d+\/\d{4}\s+\d+\/\d+\/\d{4}\s+)/gms matches the dates for each transaction
   * giving us the index for each record.
   */
 
}
