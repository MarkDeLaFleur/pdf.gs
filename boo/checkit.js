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
    const docX = await pdfjsLib.getDocument(fileData.data).promise;
    console.log(docX.numPages)

    let txtArray = await extractText(fileData.data,1,4);
    console.log(`${txtArray}`) 
  }  
  /**
   * /(\d+\/\d+\/\d{4}\s+\d+\/\d+\/\d{4}\s+)/gms matches the dates for each transaction
   * giving us the index for each record.
   */
 
}
