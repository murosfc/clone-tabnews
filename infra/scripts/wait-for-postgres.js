const { exec } = require('child_process');

function checkPostgres(){  
  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn);
    
  function handleReturn(error, stdout){
    if(stdout.search('accepting connections') === -1){
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\n\n🟢 PostgreSQL is ready and accepting connections!\n");
  }
  
}

process.stdout.write("\n\n🔴 PostgreSQL is not available yet. \n\nLoading...");
checkPostgres();
